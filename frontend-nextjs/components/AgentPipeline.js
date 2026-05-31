"use client";

import styles from "./AgentPipeline.module.css";
import AgentCard from "./AgentCard";

const AGENT_ORDER = ["flight_agent", "hotel_agent", "itinerary_agent", "final_agent"];

export default function AgentPipeline({ agents, isComplete, isVisible }) {
  if (!isVisible) return null;

  return (
    <section className={styles.section} id="agent-pipeline" aria-label="Agent pipeline live view">
      <div className={styles.container}>
        <h2 className={styles.title}>
          {isComplete ? (
            <>
              <span className={styles.completeIcon}>✅</span> Plan Complete!
            </>
          ) : (
            <>
              <span className={styles.workingIcon}>🤖</span> AI Agents Working...
            </>
          )}
        </h2>

        <div className={styles.cardStack}>
          {AGENT_ORDER.map((agentKey, i) => (
            <AgentCard
              key={agentKey}
              agent={agents[agentKey]}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
