import { motion } from "framer-motion";
import type { ReactNode } from "react";
import ShieldCrest from "./ShieldCrest";
import SectionDivider from "./SectionDivider";
import "./HeroBanner.css";

interface HeroBannerProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  showShield?: boolean;
  size?: "large" | "small";
}

export default function HeroBanner({
  eyebrow,
  title,
  subtitle,
  children,
  showShield = true,
  size = "large",
}: HeroBannerProps) {
  return (
    <section className={`hero hero--${size}`}>
      <div className="hero__arch-bg" aria-hidden="true" />
      <div className="container hero__inner">
        {showShield && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShieldCrest size={84} animate className="hero__shield" />
          </motion.div>
        )}
        {eyebrow && (
          <motion.p
            className="eyebrow hero__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            className="hero__cta-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )}
      </div>
      <SectionDivider count={8} tone="cream" className="hero__divider" />
    </section>
  );
}
