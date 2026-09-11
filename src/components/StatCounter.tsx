import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import "./StatCounter.css";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export default function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    const duration = 1200;
    const start = performance.now();

    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, prefersReducedMotion, value]);

  return (
    <div className="stat-counter" ref={ref}>
      <p className="stat-counter__number">
        {value >= 10000 ? display.toLocaleString("en-US") : display}
        {suffix}
      </p>
      <p className="stat-counter__label">{label}</p>
    </div>
  );
}
