import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { wrap } from "../../lib/motion";
import "./VelocityMarquee.css";

interface VelocityMarqueeProps {
  /** Phrases shown between diamond separators, repeated across the band. */
  items: string[];
  /** Percent of the strip's width travelled per second at rest. */
  baseVelocity?: number;
  tone?: "navy" | "cream" | "gold";
}

/** The run is rendered four times, so wrapping by half is always seamless. */
const COPIES = 4;

/**
 * A motto band that drifts continuously and then reacts to the page's scroll:
 * scrolling down drives it faster, scrolling up reverses it. At rest it keeps
 * a slow constant drift, so the band is never completely still.
 *
 * The x offset is driven by a MotionValue from a single rAF callback rather
 * than by a keyframe animation, because the direction has to be able to flip
 * mid-flight in response to scroll velocity.
 */
export default function VelocityMarquee({
  items,
  baseVelocity = 2.4,
  tone = "navy",
}: VelocityMarqueeProps) {
  const reducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // clamp: false lets a hard flick push the factor past the range, which is
  // what gives the band its snap.
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const x = useTransform(() => `${wrap(-50, 0, baseX.get())}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_t, delta) => {
    if (reducedMotion) return;

    let moveBy = directionFactor.current * -baseVelocity * (delta / 1000);

    // Scrolling down pushes the band left, scrolling up pushes it right.
    const factor = velocityFactor.get();
    if (factor < 0) {
      directionFactor.current = -1;
    } else if (factor > 0) {
      directionFactor.current = 1;
    }
    moveBy += moveBy * factor;

    baseX.set(baseX.get() + moveBy);
  });

  const run = Array.from({ length: COPIES }, (_, copy) => (
    <span className="marquee__run" key={copy} aria-hidden={copy > 0 ? "true" : undefined}>
      {items.map((item, i) => (
        <span className="marquee__item" key={`${item}-${i}`}>
          {item}
          <span className="marquee__sep" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </span>
  ));

  return (
    <div className={`marquee marquee--${tone}`} role="presentation">
      <motion.div className="marquee__track" style={reducedMotion ? undefined : { x }}>
        {run}
      </motion.div>
    </div>
  );
}
