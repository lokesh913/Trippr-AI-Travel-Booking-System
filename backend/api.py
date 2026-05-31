"""
Trippr — FastAPI Backend Bridge
Wraps the existing LangGraph multi-agent pipeline and exposes it
via Server-Sent Events (SSE) for the Next.js frontend.
"""

import json
import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from langchain_core.messages import HumanMessage

# Import the compiled LangGraph app from the existing main.py
import sys
import os

# Ensure the project root is on the path so `main` and `tools` resolve
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from main import app as langgraph_app


# ── FastAPI App ────────────────────────────────────────────────────────────────

api = FastAPI(
    title="Trippr AI: Multi-Agent Travel Orchestrator API",
    description="Trippr AI: Multi-Agent Travel Orchestrator — Multi-Agent Backend",
    version="1.0.0",
)

import os
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

api.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ─────────────────────────────────────────────────────────────────────

class PlanRequest(BaseModel):
    user_query: str
    thread_id: str = "traveler_001"


# ── Agent metadata for SSE events ─────────────────────────────────────────────

AGENT_META = {
    "flight_agent": {
        "icon": "✈️",
        "label": "Flight Agent",
        "description": "Searching real-time flights via AviationStack",
        "data_key": "flight_results",
    },
    "hotel_agent": {
        "icon": "🏨",
        "label": "Hotel Agent",
        "description": "Finding best hotels via Tavily Web Search",
        "data_key": "hotel_results",
    },
    "itinerary_agent": {
        "icon": "🗓️",
        "label": "Itinerary Agent",
        "description": "Creating day-by-day travel itinerary",
        "data_key": "itinerary",
    },
    "final_agent": {
        "icon": "🧠",
        "label": "Final Agent",
        "description": "Polishing and delivering the final travel plan",
        "data_key": "messages",
    },
}

AGENT_ORDER = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"]


# ── Routes ─────────────────────────────────────────────────────────────────────

@api.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "agents": 4}


@api.post("/api/generate-plan")
async def generate_plan(request: PlanRequest):
    """
    Stream the multi-agent travel plan generation via SSE.
    Each agent's result is sent as a separate event.
    """

    async def event_generator():
        config = {"configurable": {"thread_id": request.thread_id}}

        initial_state = {
            "messages": [HumanMessage(content=request.user_query)],
            "user_query": request.user_query,
            "flight_results": "",
            "hotel_results": "",
            "itinerary": "",
            "llm_calls": 0,
        }

        # Send a "started" event
        yield {
            "event": "status",
            "data": json.dumps({
                "type": "started",
                "message": "Pipeline started",
                "total_agents": 4,
            }),
        }

        try:
            for chunk in langgraph_app.stream(
                initial_state,
                config=config,
                stream_mode="updates",
            ):
                for node_name, state_update in chunk.items():
                    if node_name not in AGENT_META:
                        continue

                    meta = AGENT_META[node_name]
                    llm_calls = state_update.get("llm_calls", 0)

                    # Extract agent-specific data
                    if node_name == "final_agent":
                        msgs = state_update.get("messages", [])
                        agent_data = msgs[-1].content if msgs else ""
                    else:
                        agent_data = state_update.get(meta["data_key"], "")

                    # Send running event
                    yield {
                        "event": "agent",
                        "data": json.dumps({
                            "agent": node_name,
                            "label": meta["label"],
                            "icon": meta["icon"],
                            "status": "complete",
                            "data": agent_data,
                            "llm_calls": llm_calls,
                            "index": AGENT_ORDER.index(node_name),
                        }),
                    }

            # Send completion event
            yield {
                "event": "status",
                "data": json.dumps({
                    "type": "complete",
                    "message": "All agents finished successfully",
                }),
            }

        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({
                    "type": "error",
                    "message": str(e),
                }),
            }

    return EventSourceResponse(event_generator())


# ── Entry point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api:api", host="0.0.0.0", port=8000, reload=True)
