"use client";

import styles from "./HowItWorks.module.css";
import ScrollReveal from "./ScrollReveal";

const AGENTS = [
  {
    icon: "✈️",
    name: "Flight Agent",
    description: "Searches real-time flights from global airlines",
    source: "AviationStack",
    color: "#2b8ad6",
  },
  {
    icon: "🏨",
    name: "Hotel Agent",
    description: "Finds the best-rated hotels and accommodations",
    source: "Tavily Search",
    color: "#4da3e8",
  },
  {
    icon: "🗓️",
    name: "Itinerary Agent",
    description: "Creates a detailed day-by-day travel plan",
    source: "Groq LLM",
    color: "#06b6d4",
  },
  {
    icon: "🧠",
    name: "Final Agent",
    description: "Polishes and delivers your complete trip",
    source: "Groq LLM",
    color: "#10b981",
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works" aria-label="How it works">
      <ScrollReveal>
        <h2 className={styles.title}>How AI Travel Crew Works</h2>
        <p className={styles.subtitle}>
          Four AI agents work sequentially to build your perfect travel plan
        </p>
      </ScrollReveal>

      <div className={styles.pipeline}>
        {AGENTS.map((agent, i) => (
          <ScrollReveal key={agent.name} delay={i * 150}>
            <div className={styles.agentWrapper}>
              <div className={styles.card}>
                <div
                  className={styles.iconContainer}
                  style={{ background: `${agent.color}15`, borderColor: `${agent.color}30` }}
                >
                  <span className={styles.icon}>{agent.icon}</span>
                </div>
                <h3 className={styles.agentName}>{agent.name}</h3>
                <p className={styles.agentDesc}>{agent.description}</p>
                <div
                  className={styles.sourceBadge}
                  style={{ color: agent.color, borderColor: `${agent.color}40` }}
                >
                  {agent.source}
                </div>
              </div>

              {/* Connector line (not on last) */}
              {i < AGENTS.length - 1 && (
                <div className={styles.connector} aria-hidden="true">
                  <div className={styles.connectorLine} />
                  <div className={styles.flowDot} />
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
