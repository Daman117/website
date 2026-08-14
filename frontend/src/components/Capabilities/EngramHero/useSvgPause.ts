import { useEffect, useRef } from 'react';

/**
 * Pauses an SVG's SMIL timeline when the hero is off-screen.
 *
 * `animation-play-state` — which handles the CSS layers — has no effect on
 * SMIL, so it has to be driven directly. Returns a ref to put on the <svg>.
 */
export function useSvgPause(active: boolean) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (active) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [active]);

  return ref;
}
