"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./TravelPlan.module.css";

export default function TravelPlan({ plan, query, isVisible, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!isVisible || !plan) return null;

  const handlePrintPDF = () => {
    window.print();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = plan;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePlanAnother = () => {
    onReset();
    const el = document.getElementById("trip-planner");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="travel-plan" aria-label="Your travel plan">
      <div className={styles.container}>
        <h2 className={styles.title}>
          🧠 Your Complete Travel Plan
        </h2>

        <div className={styles.planCard}>
          {/* Printable custom header (hidden on screen, visible on print) */}
          <div className={styles.printHeader} aria-hidden="true">
            <h1>Trippr AI: Multi-Agent Travel Orchestrator</h1>
            <p>Trippr AI: Multi-Agent Travel Orchestrator Recommendations</p>
            <p style={{ marginTop: '6px', fontSize: '10pt', opacity: 0.8 }}>
              <strong>Query:</strong> {query} | <strong>Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className={`${styles.planContent} markdownContent`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {plan}
            </ReactMarkdown>
          </div>
        </div>

        {/* Action bar */}
        <div className={styles.actionBar}>
          <button
            className={styles.actionBtn}
            onClick={handlePrintPDF}
            aria-label="Export travel plan as PDF"
            id="export-pdf-button"
          >
            📥 Export as PDF
          </button>

          <button
            className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ""}`}
            onClick={handleCopy}
            aria-label="Copy plan to clipboard"
            id="copy-plan-button"
          >
            {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
          </button>

          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={handlePlanAnother}
            aria-label="Plan another trip"
            id="plan-another-button"
          >
            🔄 Plan Another Trip
          </button>
        </div>
      </div>
    </section>
  );
}
