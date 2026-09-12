import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import "./Magnetic.css";

interface MagneticProps {
  children: ReactNode;
  /** Fraction of the cursor's offset from centre that the element follows. */
  strength?: number;
  className?: string;
}

/**
 * Makes its child drift toward the cursor while the pointer is over it, then
 * spring back when the pointer leaves. Applied to the primary call to action
 * on each page so the one thing we want clicked reaches back.
 *
 * Deliberately mouse-only: on touch there is no hover state to respond to,
 * and a magnetic target under a fingertip just fights the tap. Under reduced
 * motion the child is rendered untouched, with no listeners attached.
 */
export default function Magnetic({ children, strength = 0.3, className = "" }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 });

  if (prefersReducedMotion) {
    return <span className={`magnetic ${className}`.trim()}>{children}</span>;
  }

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={`magnetic ${className}`.trim()}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={release}
      /* A magnetic element that is tabbed to should sit where it was drawn,
         not wherever the mouse happened to leave it. */
      onBlurCapture={release}
    >
      {children}
    </motion.span>
  );
}
