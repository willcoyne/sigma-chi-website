import { Fragment } from "react";
import { motion } from "motion/react";
import type { ElementType } from "react";
import type { Variants } from "motion/react";
import { EASE_PREMIUM, REVEAL_VIEWPORT } from "../../lib/motion";
import "./MaskedText.css";

interface MaskedTextProps {
  text: string;
  /** Semantic tag to render. The animation is identical for all of them. */
  as?: ElementType;
  className?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Seconds between each word. */
  stagger?: number;
  /** Animate on mount rather than when scrolled into view. */
  immediate?: boolean;
}

const container: Variants = {
  hidden: {},
  visible: (custom: { delay: number; stagger: number }) => ({
    transition: { delayChildren: custom.delay, staggerChildren: custom.stagger },
  }),
};

const word: Variants = {
  // Pushed a hair past 100% so no sliver of the glyph shows above the mask
  // edge on fractional-pixel layouts.
  hidden: { y: "108%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: EASE_PREMIUM } },
};

/**
 * Headline type that rises word by word out of a clipping mask, rather than
 * simply fading in. Each word sits in its own overflow-hidden box, so the
 * letters appear to be uncovered by the line above them.
 *
 * The animated spans are hidden from assistive tech and the whole string is
 * restated with aria-label, so screen readers get one clean heading instead
 * of a stream of disconnected words.
 *
 * Reduced motion is handled by the app-level MotionConfig: it drops the
 * transform, and the words are simply present.
 */
export default function MaskedText({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.055,
  immediate = false,
}: MaskedTextProps) {
  const words = text.split(" ");
  const activeState = immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: REVEAL_VIEWPORT };

  return (
    <Tag className={`masked-text ${className}`.trim()} aria-label={text}>
      <motion.span
        className="masked-text__run"
        aria-hidden="true"
        variants={container}
        custom={{ delay, stagger }}
        initial="hidden"
        {...activeState}
      >
        {words.map((value, i) => (
          <Fragment key={`${value}-${i}`}>
            <span className="masked-text__clip">
              <motion.span className="masked-text__word" variants={word}>
                {value}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
