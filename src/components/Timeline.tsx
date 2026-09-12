import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import type { TimelineEntry } from "../data/content";
import { EASE_PREMIUM, REVEAL_VIEWPORT_TIGHT } from "../lib/motion";
import "./Timeline.css";

const MARKER_SPRING = { type: "spring", stiffness: 380, damping: 22 } as const;

/**
 * The site's history, drawn rather than listed. A spine runs down the left
 * edge and is inked in as the reader scrolls through the list, so the era
 * being read is always the one the line has reached. Each entry's marker
 * springs open as it arrives.
 */
export default function Timeline({ items }: { items: TimelineEntry[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    // The spine starts inking once the list is well into view and finishes
    // as the last entry clears the middle of the screen.
    offset: ["start 75%", "end 60%"],
  });

  return (
    <div className="timeline">
      <div className="timeline__spine" aria-hidden="true">
        <motion.span className="timeline__spine-fill" style={{ scaleY: scrollYProgress }} />
      </div>

      <ol className="timeline__list" ref={listRef}>
        {items.map((item) => (
          <motion.li
            key={item.year}
            className="timeline__item"
            initial="hidden"
            whileInView="shown"
            viewport={REVEAL_VIEWPORT_TIGHT}
            variants={{
              hidden: { opacity: 0, y: 24 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_PREMIUM } },
            }}
          >
            <motion.span
              className="timeline__marker"
              aria-hidden="true"
              variants={{
                hidden: { scale: 0 },
                shown: { scale: 1, transition: { ...MARKER_SPRING, delay: 0.12 } },
              }}
            />
            <p className="timeline__year">{item.year}</p>
            <h3>{item.heading}</h3>
            <p className="timeline__body">{item.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
