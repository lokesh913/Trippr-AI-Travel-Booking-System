/**
 * Trippr — useStreamPlan Hook
 * Custom React hook that consumes SSE from the FastAPI backend
 * and progressively updates agent results in state.
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { generatePlanStream } from "../utils/api";

const INITIAL_AGENTS = {
  flight_agent: { status: "waiting", data: null, label: "Flight Agent", icon: "✈️", index: 0 },
  hotel_agent: { status: "waiting", data: null, label: "Hotel Agent", icon: "🏨", index: 1 },
  itinerary_agent: { status: "waiting", data: null, label: "Itinerary Agent", icon: "🗓️", index: 2 },
  final_agent: { status: "waiting", data: null, label: "Final Agent", icon: "🧠", index: 3 },
};

export function useStreamPlan() {
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState({ ...INITIAL_AGENTS });
  const [metrics, setMetrics] = useState({ agentsRun: 0, llmCalls: 0 });
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const abortRef = useRef(null);

  const resetPlan = useCallback(() => {
    setIsLoading(false);
    setAgents(structuredClone(INITIAL_AGENTS));
    setMetrics({ agentsRun: 0, llmCalls: 0 });
    setError(null);
    setIsComplete(false);
  }, []);

  const generatePlan = useCallback(async (query, threadId) => {
    // Reset state
    setIsLoading(true);
    setAgents(structuredClone(INITIAL_AGENTS));
    setMetrics({ agentsRun: 0, llmCalls: 0 });
    setError(null);
    setIsComplete(false);

    // Mark agents ahead of current as "waiting" and set current running
    const agentOrder = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"];
    let completedCount = 0;

    // Set first agent to running
    setAgents((prev) => ({
      ...prev,
      flight_agent: { ...prev.flight_agent, status: "running" },
    }));

    try {
      const response = await generatePlanStream(query, threadId);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const dataStr = line.slice(5).trim();
          if (!dataStr || dataStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataStr);

            // Handle agent events
            if (parsed.agent) {
              const agentName = parsed.agent;
              completedCount++;

              setAgents((prev) => {
                const updated = { ...prev };
                // Mark this agent as complete
                updated[agentName] = {
                  ...updated[agentName],
                  status: "complete",
                  data: parsed.data,
                  label: parsed.label || updated[agentName].label,
                  icon: parsed.icon || updated[agentName].icon,
                };

                // Mark next agent as running if there is one
                const currentIdx = agentOrder.indexOf(agentName);
                if (currentIdx < agentOrder.length - 1) {
                  const nextAgent = agentOrder[currentIdx + 1];
                  updated[nextAgent] = {
                    ...updated[nextAgent],
                    status: "running",
                  };
                }

                return updated;
              });

              setMetrics({
                agentsRun: completedCount,
                llmCalls: parsed.llm_calls || completedCount,
              });
            }

            // Handle completion
            if (parsed.type === "complete") {
              setIsComplete(true);
              setIsLoading(false);
            }

            // Handle errors
            if (parsed.type === "error") {
              setError(parsed.message);
              setIsLoading(false);
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }

      // If stream ended without explicit complete event
      if (!error) {
        setIsComplete(true);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || "Failed to connect to the backend");
      setIsLoading(false);
    }
  }, [error]);

  const loadPlan = useCallback((sessionResults) => {
    if (sessionResults) {
      setAgents(sessionResults.agents || structuredClone(INITIAL_AGENTS));
      setMetrics(sessionResults.metrics || { agentsRun: 0, llmCalls: 0 });
      setError(sessionResults.error || null);
      setIsComplete(sessionResults.isComplete || false);
      setIsLoading(sessionResults.isLoading || false);
    } else {
      resetPlan();
    }
  }, [resetPlan]);

  return {
    isLoading,
    agents,
    metrics,
    error,
    isComplete,
    generatePlan,
    resetPlan,
    loadPlan,
  };
}
