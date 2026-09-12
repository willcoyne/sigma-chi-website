import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Variants } from "motion/react";
import { EASE_PREMIUM, REVEAL_VIEWPORT_TIGHT } from "../lib/motion";
import "./IndexRow.css";

interface IndexRowProps {
  /** The oversized ordinal in the left column. Usually a zero-padded number. */
  ordinal: ReactNode;
  title: ReactNode;
  /** Optional body copy under the title. */
  children?: ReactNode;
  /** Small right-aligned label, e.g. a year or a role. */
  meta?: ReactNode;
  /** Position in its list, used to stagger the entrance. */
  index?: number;
  headingLevel?: "h3" | "h4";
  as?: "div" | "li";
  className?: string;
}

/*
 * One set of named variants for the whole row, so the rule, the ordinal and
 * the title all respond to the row's own hover state rather than each needing
 * its own listener. Motion propagates the active variant name to any child
 * declaring the same key.
 */
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: index * 0.07, ease: EASE_PREMIUM },
  }),
  /* The row itself does not move on hover — its children do. The key still has
     to exist here, or there is no "hover" state for Motion to propagate down. */
  hover: {},
};

/** The gold rule wipes in from the left across the existing hairline. */
const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.55, ease: EASE_PREMIUM } },
};

const ordinalVariants: Variants = {
  hidden: {},
  shown: { x: 0, transition: { duration: 0.4, ease: EASE_PREMIUM } },
  hover: { x: 8, transition: { duration: 0.4, ease: EASE_PREMIUM } },
};

const titleVariants: Variants = {
  hidden: {},
  shown: { x: 0, transition: { duration: 0.45, ease: EASE_PREMIUM } },
  hover: { x: 12, transition: { duration: 0.45, ease: EASE_PREMIUM } },
};

/**
 * The site's editorial replacement for a card: a hairline rule, an oversized
 * ordinal, then the content — a magazine contents page rather than a grid of
 * boxes. Rows rise in as they enter the viewport, and shift toward the reader
 * under a gold rule on hover.
 */
export default function IndexRow({
  ordinal,
  title,
  children,
  meta,
  index = 0,
  headingLevel: Heading = "h3",
  as: Tag = "div",
  className = "",
}: IndexRowProps) {
  const MotionTag = Tag === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      className={`index-row index-row--motion ${className}`.trim()}
      variants={rowVariants}
      custom={index}
      initial="hidden"
      whileInView="shown"
      whileHover="hover"
      viewport={REVEAL_VIEWPORT_TIGHT}
    >
      <motion.span className="index-row__rule" variants={ruleVariants} aria-hidden="true" />

      <motion.span className="index-row__ordinal" variants={ordinalVariants}>
        {ordinal}
      </motion.span>

      <motion.div className="index-row__body" variants={titleVariants}>
        <div className="index-row__headline">
          <Heading>{title}</Heading>
          {meta && <span className="index-row__meta">{meta}</span>}
        </div>
        {children}
      </motion.div>
    </MotionTag>
  );
}
