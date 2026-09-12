import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import "./StatCounter.css";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

function format(value: number): string {
  return value >= 10000 ? value.toLocaleString("en-US") : String(value);
}

/**
 * A figure that counts up when it first scrolls into view.
 *
 * The running number lives in a MotionValue and is rendered straight into the
 * DOM as a child of a motion element, so the count does not re-render the
 * component on every frame. The settled value is also written out for screen
 * readers, which should be given the number rather than a blur of digits.
 */
export default function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const count = useMotionValue(prefersReducedMotion ? value : 0);
  const display = useTransform(() => format(Math.round(count.get())));

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      count.set(value);
      return;
    }

    const controls = animate(count, value, {
      duration: 1.6,
      // Long, decelerating tail — the figure lands rather than stopping dead.
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, value, count]);

  return (
    <motion.div
      className="stat-counter"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="stat-counter__number">
        <span className="sr-only">
          {format(value)}
          {suffix}
        </span>
        <span aria-hidden="true">
          <motion.span>{display}</motion.span>
          {suffix}
        </span>
      </p>
      <p className="stat-counter__label">{label}</p>
    </motion.div>
  );
}
