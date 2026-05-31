"use client";

import { useState } from "react";
import styles from "./AgentCard.module.css";

export default function AgentCard({ agent, index }) {
  const [expanded, setExpanded] = useState(true);
  const { status, data, label, icon } = agent;

  const accentColors = {
    0: "#2b8ad6", // Flight — sky blue
    1: "#4da3e8", // Hotel — lighter sky blue
    2: "#06b6d4", // Itinerary — cyan
    3: "#10b981", // Final — emerald
  };

  const accent = accentColors[index] || "#2b8ad6";
  const isRunning = status === "running";
  const isComplete = status === "complete";
  const isWaiting = status === "waiting";

  return (
    <div
      className={`
        ${styles.card}
        ${isRunning ? styles.running : ""}
        ${isComplete ? styles.complete : ""}
        ${isWaiting ? styles.waiting : ""}
      `}
      style={{
        "--agent-accent": accent,
        animationDelay: `${index * 200}ms`,
      }}
      role="article"
      aria-label={`${label} — ${status}`}
    >
      {/* Header */}
      <button
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`agent-content-${index}`}
      >
        <div className={styles.headerLeft}>
          <span className={styles.icon}>{icon}</span>
          <span className={styles.name}>{label}</span>
        </div>

        <div className={styles.headerRight}>
          {/* Status badge */}
          <span
            className={`${styles.statusBadge} ${styles[`status_${status}`]}`}
          >
            {isWaiting && "Waiting"}
            {isRunning && (
              <>
                <span className={styles.spinner} />
                Running
              </>
            )}
            {isComplete && (
              <>
                <svg className={styles.checkmark} viewBox="0 0 24 24" width="14" height="14">
                  <path
                    d="M5 13l4 4L19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Complete
              </>
            )}
          </span>

          {/* Expand chevron */}
          <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}>
            ▾
          </span>
        </div>
      </button>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressBar}
          style={{
            width: isComplete ? "100%" : isRunning ? "60%" : "0%",
            background: accent,
          }}
        />
      </div>

      {/* Content */}
      {expanded && (
        <div className={styles.content} id={`agent-content-${index}`}>
          {isWaiting && (
            <div className={styles.skeletonGroup}>
              <div className={styles.skeleton} style={{ width: "90%" }} />
              <div className={styles.skeleton} style={{ width: "75%" }} />
              <div className={styles.skeleton} style={{ width: "60%" }} />
            </div>
          )}

          {isRunning && (
            <div className={styles.runningContent}>
              <div className={styles.typingIndicator}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
              <p className={styles.runningText}>Agent is processing...</p>
            </div>
          )}

          {isComplete && data && (
            <div className={styles.dataContent}>
              <pre className={styles.dataText}>{data}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
