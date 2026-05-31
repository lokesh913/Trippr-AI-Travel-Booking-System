"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./MetricsBar.module.css";

function AnimatedCounter({ target, duration = 1200, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (target <= 0 || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span ref={ref} className={styles.value}>
      {count}{suffix}
    </span>
  );
}

export default function MetricsBar({ metrics, isVisible }) {
  if (!isVisible) return null;

  return (
    <section className={styles.section} aria-label="Pipeline metrics">
      <div className={styles.container}>
        <div className={styles.card}>
          <AnimatedCounter target={4} />
          <span className={styles.label}>Agents Run</span>
        </div>

        <div className={styles.card}>
          <AnimatedCounter target={metrics.llmCalls} />
          <span className={styles.label}>LLM Calls</span>
        </div>

        <div className={styles.card}>
          <span className={`${styles.value} ${styles.statusValue}`}>✅</span>
          <span className={styles.label}>Status</span>
        </div>
      </div>
    </section>
  );
}
