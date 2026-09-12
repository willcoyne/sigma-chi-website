import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children?: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Standard scroll-reveal wrapper: fade + rise into view, once, with an
 * optional stagger delay for grids of cards. Respects reduced-motion via
 * Motion's automatic feature detection through the parent config.
 */
export default function Reveal({ children, delay = 0, y = 24, className = "" }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
