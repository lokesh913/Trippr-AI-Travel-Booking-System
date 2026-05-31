"use client";

import styles from "./Footer.module.css";

const TECH_STACK = [
  "LangGraph",
  "Groq · LLaMA 3.3",
  "MySQL",
  "Tavily",
  "AviationStack",
  "Next.js",
];

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.plane}>✈️</span>
          <span className={styles.name}>Trippr AI</span>
        </div>

        <div className={styles.techRow} role="list" aria-label="Technology stack">
          {TECH_STACK.map((tech) => (
            <span key={tech} className={styles.techBadge} role="listitem">
              {tech}
            </span>
          ))}
        </div>

        <p className={styles.copyright}>
          © 2026 Trippr AI: Multi-Agent Travel Orchestrator. Built with AI.
        </p>
      </div>
    </footer>
  );
}
