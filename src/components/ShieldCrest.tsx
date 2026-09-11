import { motion, useReducedMotion } from "framer-motion";

interface ShieldCrestProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

/**
 * Original shield + cross mark — a Norman-shield silhouette with a plain
 * white cross and a small "ΣΧ" monogram. Intentionally omits the eagle,
 * key, and scroll that appear on Sigma Chi's actual trademarked crest.
 */
export default function ShieldCrest({ size = 96, animate = false, className = "" }: ShieldCrestProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  const outline = "M60 4 L112 20 V68 C112 108 89 130 60 142 C31 130 8 108 8 68 V20 Z";
  const inline = "M60 10 L105 24 V68 C105 104 85 124 60 135 C35 124 15 104 15 68 V24 Z";

  return (
    <svg
      width={size}
      height={(size * 142) / 120}
      viewBox="0 0 120 142"
      role="img"
      aria-label="Sigma Chi Beta Colony shield"
      className={className}
    >
      <motion.path
        d={outline}
        fill="var(--navy)"
        stroke="var(--gold)"
        strokeWidth="3"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <path d={inline} fill="none" stroke="var(--cream)" strokeWidth="1.5" opacity="0.9" />
      <motion.g
        initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : false}
        animate={shouldAnimate ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 0.5, delay: shouldAnimate ? 0.5 : 0 }}
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
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : false}
        transition={{ duration: 0.5, delay: shouldAnimate ? 0.9 : 0 }}
      >
        ΣΧ
      </motion.text>
    </svg>
  );
}
