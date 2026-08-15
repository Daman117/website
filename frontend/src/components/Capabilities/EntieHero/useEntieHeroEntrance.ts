/**
 * The enTIE hero's entrance — one timeline, played once on mount.
 *
 * Background, then the copy line by line, then the system assembling itself:
 * core, its connection points, the source column, the output column, the
 * lanes drawing between them, the core's interior, the data flow, and last
 * the field underneath. About four seconds end to end.
 *
 * ── The rule that keeps this from fighting the loops ────────────────────
 * useEntieFlowAnimation and useEntieWaveAnimation already own `opacity` on
 * individual outlines, signals, sparks, node dots, packets and pulses. Two
 * animations on one property do not blend — the later one wins — so an
 * entrance that faded those same elements would be overwritten by the first
 * loop frame and the reveal would collapse.
 *
 * So the entrance never touches an element a loop owns. It animates:
 *
 *   · the copy, which no loop touches at all;
 *   · GROUP wrappers — .entie-core, .entie-core-nodes, .entie-core-signals,
 *     .entie-flow-particles, .entie-connector-pulses, each tile's <g> — none
 *     of which any loop targets. Nested opacity multiplies, so a signal
 *     resting at 0.55 inside a group at 0 is invisible and fades up to
 *     exactly its own 0.55 as the group reaches 1. The loop never notices;
 *   · `draw` on the connector BASE lines, which is stroke-dasharray — the
 *     loops drive the separate pulse copies, not these, so the lanes can be
 *     drawn in while nothing argues about it;
 *   · the wave's own <svg>, whose lanes and riders are driven from inside.
 *
 * The loops therefore run from mount, unseen, and are already mid-cycle when
 * the entrance uncovers them. That is why the flow looks continuous the
 * instant it appears rather than starting from an empty first packet — and
 * why nothing here restarts or duplicates the existing systems.
 *
 * ── Why useLayoutEffect ─────────────────────────────────────────────────
 * The hidden starting state is set from JS, not CSS, so reduced motion —
 * which returns before any of it runs — is left with the finished hero
 * rather than an invisible one. Setting it in a passive effect would paint
 * one frame of the fully-composed hero first.
 *
 * ── Observers ───────────────────────────────────────────────────────────
 * None added. This plays once on mount; the flow and wave hooks keep their
 * existing in-view pausing, which is the only thing that needs it.
 */
import { useCallback, useLayoutEffect, useRef } from 'react';
import { createScope, createTimeline, stagger, svg, utils } from 'animejs';
import type { Scope } from 'animejs';
import { prefersReducedMotion } from '../../../utils/motion';

/** How far the copy starts below its resting place. Small: this is a settle,
 *  not an arrival. */
const COPY_LIFT = 12;
/** How far each column starts from the core it feeds. */
const COLUMN_SHIFT = 14;
/** The wave's resting opacity — matched to its CSS so the reveal lands
 *  exactly where the stylesheet would have left it. */
const WAVE_REST = 0.62;
/** The core halo's resting opacity, matched to the flow hook's. */
const GLOW_REST = 0.32;

export function useEntieHeroEntrance() {
  const rootRef = useRef<HTMLElement | null>(null);
  const scopeRef = useRef<Scope | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    rootRef.current = node;
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    // Reduced motion: never hide anything, so the hero is simply there.
    if (!root || prefersReducedMotion()) return;

    const scope = createScope({ root }).add(() => {
      const lanes = svg.createDrawable(root.querySelectorAll('.entie-connector'));

      /* Hidden state, before the first paint. Group wrappers and the base
         lanes only — see the note above about why no individual outline,
         signal, dot or packet is touched here. */
      utils.set(root, { opacity: 0 });
      utils.set('.eth-badge, .eth-title, .eth-sub, .eth-cta', {
        opacity: 0,
        translateY: COPY_LIFT,
      });
      utils.set('.entie-core', { opacity: 0, translateY: 14 });
      utils.set('.entie-core-glow', { opacity: 0 });
      utils.set('.entie-core-nodes, .entie-core-signals', { opacity: 0 });
      utils.set('.entie-source', { opacity: 0, translateX: -COLUMN_SHIFT });
      utils.set('.entie-output', { opacity: 0, translateX: COLUMN_SHIFT });
      utils.set(lanes, { draw: '0 0' });
      utils.set('.entie-flow-particles, .entie-connector-pulses', { opacity: 0 });
      utils.set('.entie-wave', { opacity: 0 });

      /* One timeline, absolute positions in milliseconds. Written as numbers
         rather than relative offsets so the running order reads as a column
         and a single step can be retimed without shifting the rest. */
      createTimeline({ defaults: { ease: 'outQuad', duration: 550 } })
        // 1. Background atmosphere.
        .add(root, { opacity: 1, duration: 450 }, 0)

        // 2. The copy, line by line.
        .add('.eth-badge', { opacity: 1, translateY: 0 }, 200)
        .add('.eth-title', { opacity: 1, translateY: 0, duration: 650 }, 400)
        .add('.eth-sub', { opacity: 1, translateY: 0 }, 680)
        .add('.eth-cta', { opacity: 1, translateY: 0 }, 1300)

        /* 3. The core, settling into place with its halo. Its outline,
              interior fill and shield come with it; the parts that make it
              look busy are held back for step 7. */
        .add('.entie-core', { opacity: 1, translateY: 0, duration: 700 }, 1350)
        .add('.entie-core-glow', { opacity: GLOW_REST, duration: 800 }, 1350)

        // 4. Its connection points, so the lanes have somewhere to land.
        .add('.entie-core-nodes', { opacity: 1, duration: 500 }, 1750)

        // 5. The columns, each drifting the last few units toward the core.
        .add('.entie-source', { opacity: 1, translateX: 0, duration: 520, delay: stagger(90) }, 1900)
        .add('.entie-output', { opacity: 1, translateX: 0, duration: 520, delay: stagger(90) }, 2150)

        /* 6. The lanes draw themselves in, source end first. This is the step
              that makes the picture read as being built rather than faded
              up. */
        .add(lanes, { draw: '0 1', duration: 900, delay: stagger(70), ease: 'inOutQuad' }, 2400)

        // 7. The core's interior, once it has something connected to it.
        .add('.entie-core-signals', { opacity: 1, duration: 600 }, 2950)

        /* 8. The flow. Its loops have been running unseen since mount, so it
              is already mid-stride when it becomes visible. */
        .add('.entie-flow-particles, .entie-connector-pulses', { opacity: 1, duration: 600 }, 3100)

        // 9. The field underneath, last and slowest.
        .add('.entie-wave', { opacity: WAVE_REST, duration: 800, ease: 'inOutSine' }, 3200);
    });

    scopeRef.current = scope;

    return () => {
      scope.revert();
      scopeRef.current = null;
    };
  }, []);

  return setRef;
}
