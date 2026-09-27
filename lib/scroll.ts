export const JOURNEY_ID = "journey";

/** Ease used for the train's approach/departure from a station. */
export function ease(x: number): number {
  return x * x * (3 - 2 * x);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scrolls so the sticky journey lands on station index `i` (0-based,
 * out of `count` stations). Used by nav links and station buttons.
 */
export function scrollToStation(i: number, count: number, reduced: boolean) {
  const journey = document.getElementById(JOURNEY_ID);
  if (!journey) return;
  const top = journey.offsetTop + ((journey.offsetHeight - window.innerHeight) * i) / (count - 1) + 2;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}
