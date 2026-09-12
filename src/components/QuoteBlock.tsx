import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { EASE_PREMIUM, REVEAL_VIEWPORT } from "../lib/motion";
import "./QuoteBlock.css";

interface QuoteBlockProps {
  quote: string;
  attribution?: string;
  tone?: "light" | "dark";
}

const ruleVariants: Variants = {
  hidden: { scaleY: 0 },
  shown: { scaleY: 1, transition: { duration: 0.8, ease: EASE_PREMIUM } },
};

const bodyVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15, ease: EASE_PREMIUM } },
};

const markVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7, rotate: -12 },
  shown: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 18, delay: 0.25 },
  },
};

/**
 * A pull quote, set at display scale. The gold rule draws itself downward as
 * the quote arrives and an oversized opening mark swings in beside it, so the
 * quote announces itself rather than sitting in the flow as indented prose.
 */
export default function QuoteBlock({ quote, attribution, tone = "light" }: QuoteBlockProps) {
  return (
    <motion.blockquote
      className={`quote-block quote-block--${tone}`}
      initial="hidden"
      whileInView="shown"
      viewport={REVEAL_VIEWPORT}
    >
      <motion.span className="quote-block__rule" variants={ruleVariants} aria-hidden="true" />
      <motion.span className="quote-block__mark" variants={markVariants} aria-hidden="true">
        &ldquo;
      </motion.span>
      <motion.div className="quote-block__body" variants={bodyVariants}>
        <p>{quote}</p>
        {attribution && <cite>{attribution}</cite>}
      </motion.div>
    </motion.blockquote>
  );
}
