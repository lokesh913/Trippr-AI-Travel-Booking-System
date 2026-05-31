"use client";

import styles from "./Hero.module.css";

const AGENT_CHIPS = [
  { emoji: "✈️", label: "Flights", delay: 0 },
  { emoji: "🏨", label: "Hotels", delay: 0.5 },
  { emoji: "🗓️", label: "Itinerary", delay: 1.0 },
  { emoji: "🧠", label: "Planner", delay: 1.5 },
];

export default function Hero() {
  const handleCTA = () => {
    const el = document.getElementById("trip-planner");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero} id="hero" aria-label="Hero section">
      {/* Animated cloud layers */}
      <div className={styles.cloudContainer} aria-hidden="true">
        <div className={`${styles.cloudLayer} ${styles.cloud1}`} />
        <div className={`${styles.cloudLayer} ${styles.cloud2}`} />
        <div className={`${styles.cloudLayer} ${styles.cloud3}`} />
      </div>

      {/* Floating airplane silhouette decoration */}
      <div className={styles.airplaneDecor} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="120" height="120" fill="currentColor">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5L21 16z" />
        </svg>
      </div>

      <div className={styles.content}>
        {/* Floating plane */}
        <div className={styles.planeIcon} aria-hidden="true">
          ✈️
        </div>

        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeStar}>✦</span> Powered by Multi-Agent AI
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          Trippr AI: Multi-Agent Travel Orchestrator
        </h1>

        {/* Subheadline */}
        <p className={styles.subheadline}>
          Four specialized AI agents collaborate in real-time to search flights, find hotels,
          build itineraries, and deliver your perfect trip. Experience the ultimate Trippr AI: Multi-Agent Travel Orchestrator.
        </p>

        {/* CTA Button */}
        <button
          className={styles.ctaButton}
          onClick={handleCTA}
          aria-label="Plan my trip — scroll to planner"
        >
          Plan My Trip
          <span className={styles.ctaArrow}>→</span>
        </button>

        {/* Agent chips */}
        <div className={styles.chipRow}>
          {AGENT_CHIPS.map((chip) => (
            <div
              key={chip.label}
              className={styles.chip}
              style={{ animationDelay: `${chip.delay}s` }}
            >
              <span>{chip.emoji}</span> {chip.label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollChevron} />
      </div>
    </section>
  );
}
