/*
 * House motion tokens. Every animation on the site keys off these so the
 * timing reads as one system rather than a per-page improvisation.
 */

/** Primary easing curve. Mirrors --ease-premium in theme.css. */
export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

/** Symmetric curve for elements leaving as well as entering. */
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const;

/**
 * Scroll-reveal viewport settings. Fires once and slightly before the element
 * reaches its resting position, so content is already settled by the time the
 * reader's eye lands on it.
 */
export const REVEAL_VIEWPORT = { once: true, margin: "-100px" } as const;

/** A shorter trigger, for rows that appear in dense sequences. */
export const REVEAL_VIEWPORT_TIGHT = { once: true, margin: "-60px" } as const;

/**
 * Wraps `v` into the half-open range [min, max), including for negative
 * values — JavaScript's % operator keeps the sign of the dividend, which
 * breaks the infinite ticker as soon as it scrolls backwards.
 */
export function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}
