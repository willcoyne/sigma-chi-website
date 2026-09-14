import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { EASE_PREMIUM } from "../lib/motion";
import "./PhotoBand.css";

interface PhotoBandProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  /** Intrinsic size of `src`, used to reserve the box and avoid layout shift. */
  width: number;
  height: number;
  caption?: ReactNode;
}

/**
 * A full-width photograph that wipes open as it arrives and drifts against the
 * scroll while it is on screen. The image is oversized inside a clipping frame
 * so the parallax never exposes an edge.
 *
 * Both animated properties (clipPath and y) are ones the browser can run on
 * the GPU. Under reduced motion the frame is simply open and the photo still.
 */
export default function PhotoBand({
  src,
  srcSet,
  sizes = "100vw",
  alt,
  width,
  height,
  caption,
}: PhotoBandProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <figure className="photo-band" ref={ref}>
      <motion.div
        className="photo-band__frame"
        initial={prefersReducedMotion ? false : { clipPath: "inset(14% 0% 14% 0%)" }}
        whileInView={prefersReducedMotion ? undefined : { clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: EASE_PREMIUM }}
      >
        <motion.img
          className="photo-band__img"
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          width={width}
          height={height}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={prefersReducedMotion ? undefined : { y }}
        />
      </motion.div>

      {caption && <figcaption className="photo-band__caption">{caption}</figcaption>}
    </figure>
  );
}
