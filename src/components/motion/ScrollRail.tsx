import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import "./ScrollRail.css";

/**
 * A hairline that fills as its own height passes through the viewport. Drop it
 * into a position: relative section as the left-hand margin rule, and it reads
 * as a progress indicator for that section specifically.
 *
 * It tracks itself rather than taking a ref to the section, so a caller only
 * has to place it. Purely decorative, and hidden from assistive tech.
 */
export default function ScrollRail({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts filling as the rail enters the lower third and completes a little
    // before it leaves, so it resolves while the section is still being read.
    offset: ["start 85%", "end 45%"],
  });

  return (
    <div ref={ref} className={`scroll-rail ${className}`.trim()} aria-hidden="true">
      <motion.span style={{ scaleY: scrollYProgress }} />
    </div>
  );
}
