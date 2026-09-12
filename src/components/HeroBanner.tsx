import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import ShieldCrest from "./ShieldCrest";
import SectionDivider from "./SectionDivider";
import MaskedText from "./motion/MaskedText";
import { EASE_PREMIUM } from "../lib/motion";
import "./HeroBanner.css";

interface HeroBannerProps {
  eyebrow?: ReactNode;
  /** Plain string: the headline is split per word for the masked reveal. */
  title: string;
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
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll-linked parallax. Progress runs 0 -> 1 as the hero leaves the
  // viewport, and the layers move at different rates to give the band depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Spring-smooth the raw progress so the parallax does not track the scroll
  // wheel one-to-one, which reads as jittery on trackpads.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const shieldY = useTransform(smooth, [0, 1], [0, 140]);
  const shieldScale = useTransform(smooth, [0, 1], [1, 1.12]);
  const shieldRotate = useTransform(smooth, [0, 1], [0, 8]);
  const archY = useTransform(smooth, [0, 1], [0, 70]);
  const contentY = useTransform(smooth, [0, 1], [0, -40]);
  const contentOpacity = useTransform(smooth, [0, 0.75], [1, 0]);
  // The rules behind the type spread apart as the hero is scrolled off, so the
  // arcade opens up rather than simply sliding.
  const archScale = useTransform(smooth, [0, 1], [1, 1.15]);

  // Reduced motion: no parallax, no fade-on-scroll, no entrance transforms.
  // Everything below collapses to a static layout.
  const parallax = prefersReducedMotion
    ? {}
    : { style: { y: shieldY, scale: shieldScale, rotate: shieldRotate } };
  const archParallax = prefersReducedMotion ? {} : { style: { y: archY, scaleX: archScale } };
  const contentParallax = prefersReducedMotion
    ? {}
    : { style: { y: contentY, opacity: contentOpacity } };

  const rise = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE_PREMIUM },
        };

  return (
    <section ref={sectionRef} className={`hero hero--${size}`}>
      <motion.div className="hero__arch-bg" aria-hidden="true" {...archParallax} />

      {/*
        The crest is a watermark behind the type. It carries no meaning the
        headline does not already state, so it is hidden from assistive tech
        rather than repeating "Sigma Chi" on every page.
      */}
      {showShield && (
        <motion.div className="hero__shield-wrap" aria-hidden="true" {...parallax}>
          <ShieldCrest size={340} className="hero__shield" />
        </motion.div>
      )}

      <motion.div className="container hero__inner" {...contentParallax}>
        {eyebrow && (
          <motion.p className="eyebrow hero__eyebrow" {...rise(0.15)}>
            {eyebrow}
          </motion.p>
        )}

        <MaskedText text={title} as="h1" immediate delay={0.24} stagger={0.055} />

        {/* The editorial hinge between headline and standfirst, drawn left to
            right once the last word of the headline has landed. */}
        <motion.span
          className="hero__rule"
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { scaleX: 0 }}
          animate={prefersReducedMotion ? false : { scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE_PREMIUM }}
        />

        {subtitle && (
          <motion.p className="hero__subtitle" {...rise(0.62)}>
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div className="hero__cta-row" {...rise(0.72)}>
            {children}
          </motion.div>
        )}
      </motion.div>

      <SectionDivider count={8} tone="cream" className="hero__divider" />
    </section>
  );
}
