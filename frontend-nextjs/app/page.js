"use client";

import { useState, useCallback, useEffect } from "react";
import { useStreamPlan } from "../hooks/useStreamPlan";
import { useSessionManager } from "../hooks/useSessionManager";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Destinations from "../components/Destinations";
import TripPlanner from "../components/TripPlanner";
import AgentPipeline from "../components/AgentPipeline";
import MetricsBar from "../components/MetricsBar";
import TravelPlan from "../components/TravelPlan";
import Footer from "../components/Footer";

export default function Home() {
  const {
    sessions,
    activeSessionId,
    activeSession,
    createSession,
    switchSession,
    deleteSession,
    updateSession,
    isInitialized
  } = useSessionManager();

  const [query, setQuery] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const {
    isLoading,
    agents,
    metrics,
    error,
    isComplete,
    generatePlan,
    resetPlan,
    loadPlan,
  } = useStreamPlan();

  // Sync local query and results when session switches
  useEffect(() => {
    if (activeSession) {
      setQuery(activeSession.query || "");
      if (activeSession.results) {
        loadPlan(activeSession.results);
        setHasStarted(true);
      } else {
        resetPlan();
        setHasStarted(false);
      }
    }
  }, [activeSessionId, activeSession?.id]);

  // Sync running plan progress back to the active session
  useEffect(() => {
    if (activeSession && (isLoading || isComplete || error)) {
      updateSession(activeSession.id, {
        query,
        results: {
          agents,
          metrics,
          error,
          isComplete,
          isLoading
        }
      });
    }
  }, [activeSessionId, query, isLoading, agents, metrics, error, isComplete]);

  // Get the final agent's data for the travel plan section
  const finalPlan = agents.final_agent?.data || null;

  const handleGenerate = useCallback(() => {
    if (!query.trim() || !activeSession) return;
    setHasStarted(true);
    
    // Update session with the latest query
    updateSession(activeSession.id, { query });
    
    generatePlan(query, activeSession.threadId);

    // Scroll to pipeline after a short delay
    setTimeout(() => {
      const el = document.getElementById("agent-pipeline");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, [query, activeSession, generatePlan, updateSession]);

  const handleSelectDestination = useCallback((destQuery) => {
    setQuery(destQuery);
    if (activeSession) {
      updateSession(activeSession.id, { query: destQuery });
    }
    // Scroll to trip planner
    setTimeout(() => {
      const el = document.getElementById("trip-planner");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [activeSession, updateSession]);

  const handleReset = useCallback(() => {
    setQuery("");
    setHasStarted(false);
    if (activeSession) {
      updateSession(activeSession.id, { query: "" });
    }
    resetPlan();
  }, [activeSession, updateSession, resetPlan]);

  if (!isInitialized) return null; // Wait for sessions to load

  return (
    <main>
      <Hero />

      <HowItWorks />

      <Destinations onSelectDestination={handleSelectDestination} />

      <TripPlanner
        query={query}
        setQuery={setQuery}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onCreateSession={createSession}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
        onGenerate={handleGenerate}
        isGenerating={isLoading}
      />

      {/* Error display */}
      {error && (
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          <div
            style={{
              background: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              color: "#f43f5e",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
            role="alert"
          >
            ⚠️ {error}
          </div>
        </div>
      )}

      <AgentPipeline
        agents={agents}
        isComplete={isComplete}
        isVisible={hasStarted}
      />

      <MetricsBar
        metrics={metrics}
        isVisible={isComplete}
      />

      <TravelPlan
        plan={finalPlan}
        query={query}
        isVisible={isComplete && !!finalPlan}
        onReset={handleReset}
      />

      <Footer />
    </main>
  );
}
