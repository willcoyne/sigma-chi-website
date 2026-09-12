import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { EASE_PREMIUM } from "../lib/motion";

interface ShieldCrestProps {
  size?: number;
  /** Draw the shield's outline, then set the cross and monogram into it. */
  animate?: boolean;
  className?: string;
}

const OUTLINE = "M60 4 L112 20 V68 C112 108 89 130 60 142 C31 130 8 108 8 68 V20 Z";
const INLINE = "M60 10 L105 24 V68 C105 104 85 124 60 135 C35 124 15 104 15 68 V24 Z";

const outlineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 1.6, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
};

const inlineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: {
    pathLength: 1,
    opacity: 0.9,
    transition: {
      pathLength: { type: "spring", duration: 1.4, bounce: 0, delay: 0.25 },
      opacity: { duration: 0.01, delay: 0.25 },
    },
  },
};

const crossVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  shown: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 20, delay: 0.85 },
  },
};

const monogramVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 1.15, ease: EASE_PREMIUM } },
};

/**
 * Original shield + cross mark — a Norman-shield silhouette with a plain
 * white cross and a small "ΣΧ" monogram. Intentionally omits the eagle,
 * key, and scroll that appear on Sigma Chi's actual trademarked crest.
 *
 * With `animate`, the outline is drawn stroke-first as the crest scrolls into
 * view — not on mount, since most placements are below the fold and an
 * on-mount draw is one nobody is there to see. Reduced motion is handled by
 * the app-level MotionConfig, which drops straight to the finished state.
 */
export default function ShieldCrest({ size = 96, animate = false, className = "" }: ShieldCrestProps) {
  const motionProps = animate
    ? ({
        initial: "hidden",
        whileInView: "shown",
        viewport: { once: true, margin: "-80px" },
      } as const)
    : {};

  return (
    <motion.svg
      width={size}
      height={(size * 142) / 120}
      viewBox="0 0 120 142"
      role="img"
      aria-label="Sigma Chi Beta Colony shield"
      className={className}
      {...motionProps}
    >
      <motion.path
        d={OUTLINE}
        fill="var(--navy)"
        stroke="var(--gold)"
        strokeWidth="3"
        variants={animate ? outlineVariants : undefined}
      />
      <motion.path
        d={INLINE}
        fill="none"
        stroke="var(--cream)"
        strokeWidth="1.5"
        opacity={animate ? undefined : 0.9}
        variants={animate ? inlineVariants : undefined}
      />
      <motion.g
        variants={animate ? crossVariants : undefined}
        style={{ transformOrigin: "60px 68px" }}
      >
        <rect x="52" y="34" width="16" height="68" fill="var(--cream)" />
        <rect x="28" y="56" width="64" height="16" fill="var(--cream)" />
      </motion.g>
      <motion.text
        x="60"
        y="122"
        textAnchor="middle"
        fontFamily="var(--font-display-sc)"
        fontSize="16"
        fill="var(--gold)"
        variants={animate ? monogramVariants : undefined}
      >
        ΣΧ
      </motion.text>
    </motion.svg>
  );
}
