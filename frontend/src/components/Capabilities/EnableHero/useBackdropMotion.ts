/**
 * Forward flow for the hero's background: the wave, and the perspective grid.
 *
 * Both are made to travel FORWARD — toward the viewer and toward the analysis
 * side — without either being translated as a whole. That distinction is the
 * whole design of this file, and each half solves it differently.
 *
 * ── The wave ────────────────────────────────────────────────────────────
 * A bright segment travels each strand: an 18% dash with an 82% gap, offset
 * run from 1 to 0. `pathLength="1"` on the strands normalises them, so curves
 * of different lengths advance at the same rate and the only thing separating
 * them is duration and phase. Because the pattern is periodic, the end of the
 * loop is pixel-identical to its start — there is nothing to reset.
 *
 * ── The grid ────────────────────────────────────────────────────────────
 * Forward motion on a perspective grid is each row taking over the position
 * of the row in front of it. Over one loop every row does exactly that, so
 * the configuration at the end is identical to the one at the start and the
 * wrap is invisible — while the grid as a whole never moves.
 *
 * Each row carries `--ty` (how far to the next row) and `--sx` (how much
 * wider it gets on the way) from HeroBackdrop, so the projection stays in the
 * component and this file only reads two numbers off the element. The
 * scale-up is what stops it reading as a flat conveyor: on a real plane, a
 * line coming toward you widens.
 *
 * Rows are scaled about their own centre — `transform-box: fill-box` in the
 * stylesheet — and the row arriving out of the horizon fades in as the
 * nearest one fades out.
 *
 * ── Why it is cheap ─────────────────────────────────────────────────────
 * Everything here is `transform` and `opacity`, both compositor properties.
 * No layout is read or written per frame, no React state is touched, and
 * every instance is reverted on unmount so nothing is left stamped inline.
 */
import { useEffect } from 'react';
import { animate } from 'animejs';
import type { JSAnimation } from 'animejs';

/** One full pass of a bright segment down a strand. */
const WAVE = 9500;
/** One row-step of the grid. Slower than the wave, so the two never lock. */
const GRID = 12000;

const num = (el: Element, prop: string, fallback: number) => {
  const v = parseFloat((el as HTMLElement).style.getPropertyValue(prop));
  return Number.isFinite(v) ? v : fallback;
};

export function useBackdropMotion(
  ref: React.RefObject<SVGSVGElement | null>,
  reduceMotion: boolean
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion) return;

    const runs: JSAnimation[] = [];
    const on = (sel: string) => Array.from(root.querySelectorAll<SVGElement>(sel));

    /* One instance per strand rather than one call with function values:
       each needs its OWN duration, and per-element durations are what make
       the band read as a stream instead of one pulse it all shares. */
    on('.eab-bg-flow').forEach((el, i) => {
      runs.push(
        animate(el, {
          strokeDashoffset: [1, 0],
          duration: WAVE + i * 900,
          delay: i * 1200,
          ease: 'linear',
          loop: true,
        })
      );
    });

    /* Per row, because every row travels a different distance and widens by a
       different amount — that difference IS the perspective. They share one
       duration, which is what makes the wrap exact. */
    on('.eab-grid-row').forEach((el) => {
      runs.push(
        animate(el, {
          translateY: [0, num(el, '--ty', 0)],
          scaleX: [1, num(el, '--sx', 1)],
          duration: GRID,
          ease: 'linear',
          loop: true,
        })
      );
    });

    /* The row arriving out of the horizon and the one leaving the frame. Both
       cross zero at the loop boundary, so neither pops. */
    on('.eab-grid-row.is-entering').forEach((el) => {
      runs.push(animate(el, { opacity: [0, 1], duration: GRID, ease: 'linear', loop: true }));
    });
    on('.eab-grid-row.is-leaving').forEach((el) => {
      runs.push(animate(el, { opacity: [1, 0], duration: GRID, ease: 'linear', loop: true }));
    });

    return () => runs.forEach((r) => r.revert());
  }, [ref, reduceMotion]);
}
