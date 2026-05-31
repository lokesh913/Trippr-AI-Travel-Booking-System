"use client";

import { useState } from "react";
import styles from "./TripPlanner.module.css";
import ScrollReveal from "./ScrollReveal";

const QUICK_PROMPTS = [
  "7-day Japan trip under ₹2L",
  "Weekend getaway to Dubai",
  "5-day Paris romantic trip",
  "10-day Bali backpacking adventure",
  "Family trip to Bangkok 4 days",
];

const MAX_CHARS = 500;

export default function TripPlanner({
  query,
  setQuery,
  sessions = [],
  activeSessionId,
  onCreateSession,
  onSwitchSession,
  onDeleteSession,
  onGenerate,
  isGenerating,
}) {
  const charCount = query.length;
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  const handleGenerate = () => {
    if (query.trim() && !isGenerating) {
      onGenerate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleGenerate();
    }
  };

  return (
    <section className={styles.section} id="trip-planner" aria-label="Plan your trip">
      <ScrollReveal>
        <h2 className={styles.title}>Plan Your Trip</h2>
        <p className={styles.subtitle}>
          Describe your dream trip and let our AI Travel Crew handle the rest
        </p>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className={styles.card}>
          {/* Session tabs */}
          <div className={styles.sessionHeader}>
            <div className={styles.sessionsList} role="tablist" aria-label="Travel Sessions">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`${styles.sessionTab} ${s.id === activeSessionId ? styles.sessionTabActive : ""}`}
                  role="tab"
                  aria-selected={s.id === activeSessionId}
                  onClick={() => onSwitchSession(s.id)}
                >
                  <span className={styles.sessionTabName}>{s.name}</span>
                  {sessions.length > 1 && (
                    <button
                      className={styles.deleteSessionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      aria-label={`Delete ${s.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              className={styles.newSessionBtn}
              onClick={onCreateSession}
              aria-label="Create new travel session"
            >
              ➕ New Session
            </button>
          </div>

          {/* Quick prompt chips */}
          <div className={styles.chipRow} role="group" aria-label="Quick trip suggestions">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                className={`${styles.chip} ${query === prompt ? styles.chipActive : ""}`}
                onClick={() => setQuery(prompt)}
                aria-label={`Fill with: ${prompt}`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder='Describe your dream trip... e.g., "Plan a complete 7-day Japan trip including flights, hotels and sightseeing under ₹2 lakhs"'
              rows={4}
              maxLength={MAX_CHARS}
              aria-label="Trip description"
              id="trip-query-input"
            />
            <span className={styles.charCount}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>

          {/* Thread ID read-only info */}
          {activeSession && (
            <div className={styles.sessionMetaGroup}>
              <span className={styles.sessionMetaLabel}>Active Session Thread ID:</span>
              <code className={styles.sessionMetaValue}>{activeSession.threadId}</code>
            </div>
          )}

          {/* Generate button */}
          <button
            className={`${styles.generateBtn} ${isGenerating ? styles.generating : ""}`}
            onClick={handleGenerate}
            disabled={!query.trim() || isGenerating}
            aria-label="Generate travel plan"
            id="generate-plan-button"
          >
            {isGenerating ? (
              <span className={styles.loadingDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </span>
            ) : (
              <>🚀 Generate My Travel Plan</>
            )}
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
