"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollReveal.module.css";

/**
 * ScrollReveal — IntersectionObserver wrapper.
 * Wraps children and applies a fadeInUp animation when they enter the viewport.
 *
 * @param {Object}  props
 * @param {number}  props.threshold   — Visibility threshold (0–1), default 0.1
 * @param {string}  props.rootMargin  — Root margin, default "0px 0px -60px 0px"
 * @param {number}  props.delay       — Animation delay in ms, default 0
 * @param {string}  props.className   — Additional CSS class
 * @param {React.ReactNode} props.children
 */
export default function ScrollReveal({
  children,
  threshold = 0.1,
  rootMargin = "0px 0px -60px 0px",
  delay = 0,
  className = "",
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles.visible : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
