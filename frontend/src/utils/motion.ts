// Shared check for JS-driven (GSAP/manual) animations — CSS-driven ones are
// already handled by the @media (prefers-reduced-motion) rules in index.css.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
