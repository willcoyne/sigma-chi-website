import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Wraps routed page content with the site's house fade + rise motion,
 * used for animating between routes. Pair with AnimatePresence in the
 * router and key each instance on the route pathname. Reduced-motion is
 * handled automatically by the app-level MotionConfig.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
