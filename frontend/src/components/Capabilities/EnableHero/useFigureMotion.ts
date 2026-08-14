/**
 * The engineering figure's second animation layer, on Anime.js.
 *
 * The first layer — product flowing through the pipes — is SMIL inside the
 * SVG and is deliberately left alone: it needs to follow real path geometry,
 * which is the one thing `animateMotion` does natively. This layer is
 * everything else, and it is all opacity, colour, scale and dash offset, so a
 * JS timeline is the right tool.
 *
 * ── Why the two never collide ───────────────────────────────────────────
 * Anime writes inline styles. A CSS animation with `both` fill OUTRANKS an
 * inline style, so any element this hook drives must not also carry the
 * stylesheet's entrance `draw`. Three of them had it — the step curve, the
 * region and the signal lines — and their `eab-draw` class was removed when
 * this layer took ownership. That is the whole reason those markup changes
 * exist; nothing about the composition changed.
 *
 * ── Lifecycle ───────────────────────────────────────────────────────────
 * Every instance is collected and reverted on unmount, which puts the
 * targets back to the styles the stylesheet gave them rather than leaving
 * Anime's last frame stamped inline. Reduced motion never starts the layer at
 * all, so the figure stays exactly as composed.
 *
 * Colours are the figure's own — cyan, purple, the near-white of the maths.
 * Nothing here introduces one.
 */
import { useEffect } from 'react';
import { animate, stagger } from 'animejs';
import type { JSAnimation } from 'animejs';

/** Roughly one turn of the whole hero. Every loop below is a divisor or a
 *  near-divisor of it, so the figure never settles into one visible beat. */
const CYCLE = 7000;

export function useFigureMotion(
  ref: React.RefObject<SVGSVGElement | null>,
  reduceMotion: boolean
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion) return;

    const runs: JSAnimation[] = [];
    const on = (sel: string) => Array.from(root.querySelectorAll<SVGElement>(sel));

    /* 1. The equation. A long hold, then one slow dip and recovery — a pulse
          every four and a half seconds rather than a sine that never rests,
          which would read as blinking. */
    const eq = on('.eab-math-lg');
    if (eq.length) {
      runs.push(
        animate(eq, {
          opacity: [
            { to: 1, duration: 2600 },
            { to: 0.6, duration: 900 },
            { to: 1, duration: 1000 },
          ],
          ease: 'inOutSine',
          loop: true,
        })
      );
    }

    /* 2. The state vectors. One entry brightens at a time, in order, which is
          what suggests values moving through the model. On `fill` rather than
          opacity so the resting appearance is untouched — dimming them to
          make room for a brighten would have changed the composition. */
    const cells = on('.eab-math-sm');
    if (cells.length) {
      runs.push(
        animate(cells, {
          fill: ['#e9d5ff', '#ffffff', '#e9d5ff'],
          duration: 1100,
          delay: stagger(190, { start: 900 }),
          ease: 'inOutQuad',
          loop: true,
          loopDelay: 2400,
        })
      );
    }

    /* 3. Eigenvalues. Each pulses in turn, scaled about its OWN centre —
          `transform-box: fill-box` in the stylesheet is what makes that true,
          otherwise the origin would be the middle of the viewBox and the
          points would swing rather than pulse. Their coordinates are never
          touched. */
    const eigs = on('.eab-eig');
    if (eigs.length) {
      runs.push(
        animate(eigs, {
          scale: [1, 1.42, 1],
          opacity: [1, 0.65, 1],
          duration: 1200,
          delay: stagger(260, { start: 1600 }),
          ease: 'inOutSine',
          loop: true,
          loopDelay: 2200,
        })
      );
    }

    /* 4. The step response, drawing left to right, holding, then drawing
          again. `pathLength="1"` on the curve means the offset runs 1 to 0
          whatever the curve's real length is. */
    const curve = on('.eab-curve-step');
    if (curve.length) {
      runs.push(
        animate(curve, {
          strokeDashoffset: [
            { to: 1, duration: 0 },
            { to: 0, duration: 2400, ease: 'outQuad' },
            { to: 0, duration: 2200 },
          ],
          loop: true,
        })
      );
    }

    /* 5. The stability region: revealed once, then breathing. The shape never
          changes — only how strongly it is shaded. */
    const region = on('.eab-region');
    if (region.length) {
      runs.push(
        animate(region, {
          opacity: [
            { to: 0, duration: 0 },
            { to: 0.78, duration: 1400, ease: 'outQuad' },
            { to: 0.42, duration: 2600, ease: 'inOutSine' },
            { to: 0.78, duration: 2600, ease: 'inOutSine' },
          ],
          delay: 2400,
          loop: true,
        })
      );
    }

    /* 6. The connection lines. The dash pattern marches along the existing
          curves toward the analysis side — a travelling pulse, and no new
          geometry. The offset travels exactly one dash period (4 + 5), so the
          march is continuous with no visible restart. */
    const signals = on('.eab-signal path');
    if (signals.length) {
      runs.push(
        animate(signals, {
          strokeDashoffset: [9, 0],
          duration: 1900,
          delay: stagger(320),
          ease: 'linear',
          loop: true,
        })
      );
    }

    return () => runs.forEach((r) => r.revert());
  }, [ref, reduceMotion]);
}

export { CYCLE };
