import { Fragment, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import "./ScrollWordReveal.css";

interface ScrollWordRevealProps {
  /** The sentence to reveal. Split on spaces, one span per word. */
  statement: string;
  kicker?: string;
  /** Small line pinned under the statement once it has resolved. */
  footnote?: string;
  tone?: "navy" | "cream";
}

/** Opacity a word sits at before its slice of the scroll range begins. */
const START_OPACITY = 0.16;
/** Share of the scroll range across which words start lighting up. */
const SPREAD = 0.8;
/** Share of the scroll range a single word takes to resolve. */
const WORD_DURATION = 0.2;

interface WordProgressRange {
  start: number;
  end: number;
}

function getWordProgressRange(index: number, count: number): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD;
  return { start, end: Math.min(1, start + WORD_DURATION) };
}

function getWordOpacity(progress: number, { start, end }: WordProgressRange): number {
  if (progress <= start) return START_OPACITY;
  if (progress >= end) return 1;
  return START_OPACITY + (1 - START_OPACITY) * ((progress - start) / (end - start));
}

function Word({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  reducedMotion: boolean;
}) {
  const range = getWordProgressRange(index, count);
  // Function syntax, so the range object is captured once rather than
  // reallocated on every frame of the scroll.
  const opacity = useTransform(() => getWordOpacity(progress.get(), range));

  return <motion.span style={reducedMotion ? undefined : { opacity }}>{children}</motion.span>;
}

/**
 * A statement that is pinned to the viewport and lit word by word as the
 * reader scrolls past it — the page holds still and the sentence assembles
 * itself. Used for the one line on a page that should not be skimmed.
 *
 * Opacity is the only animated property, so the whole effect runs on the
 * compositor. Under reduced motion the statement renders fully legible and
 * the section collapses to its natural height, with no pinning.
 */
export default function ScrollWordReveal({
  statement,
  kicker,
  footnote,
  tone = "navy",
}: ScrollWordRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const words = statement.split(" ");

  return (
    <section
      ref={sectionRef}
      className={`word-reveal word-reveal--${tone}${reducedMotion ? " word-reveal--static" : ""}`}
    >
      <div className="word-reveal__stage">
        <div className="container word-reveal__layout">
          <div className="word-reveal__rail" aria-hidden="true">
            <motion.span style={{ scaleY: reducedMotion ? 1 : scrollYProgress }} />
          </div>

          <div className="word-reveal__content">
            {kicker && <p className="eyebrow word-reveal__kicker">{kicker}</p>}
            <p className="word-reveal__statement" aria-label={statement}>
              <span aria-hidden="true">
                {words.map((value, i) => (
                  <Fragment key={`${value}-${i}`}>
                    <Word
                      progress={scrollYProgress}
                      index={i}
                      count={words.length}
                      reducedMotion={reducedMotion}
                    >
                      {value}
                    </Word>
                    {i < words.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </span>
            </p>
            {footnote && <p className="word-reveal__footnote">{footnote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
