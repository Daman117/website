/**
 * The enSTUDIO hero's entrance — one timeline, played once on mount.
 *
 * Background, then the copy line by line, then the composition assembling
 * itself: container, connectors drawing in, core, nodes, packets, and finally
 * the network field underneath. About 4.7 seconds end to end.
 *
 * ── The rule that keeps this from fighting the loops ────────────────────
 * The continuous animations (useEnstudioHeroAnimation, useEnstudioWaveAnimation)
 * already own `opacity` on individual connectors, dots, rings, symbols and
 * particles. Two animations on one property do not blend — the later one
 * wins — so an entrance that faded those same elements would be overwritten
 * by the first loop frame and the reveal would collapse.
 *
 * So the entrance never touches an element a loop owns. It animates:
 *
 *   · the copy, which no loop touches at all;
 *   · the GROUP wrappers — .enstudio-connector-dots, .enstudio-core,
 *     .enstudio-flow-particles, each <g> node — which no loop targets.
 *     Nested opacity multiplies, so a connector resting at 0.7 inside a group
 *     at 0 is invisible, and fades up to exactly its own 0.7 as the group
 *     reaches 1. The loop never notices;
 *   · `draw` on the connectors, which is stroke-dasharray/offset — a property
 *     no loop uses, so the lines can be drawn in while their opacity swell
 *     runs underneath.
 *
 * The loops therefore run from mount, unseen, and are already mid-cycle when
 * the entrance uncovers them. That is why the flow looks continuous the
 * instant it appears rather than starting from an empty first packet.
 *
 * ── Why useLayoutEffect ─────────────────────────────────────────────────
 * The hidden starting state is set from JS, not CSS, so that reduced motion
 * (which returns before any of it runs) is left with the finished hero rather
 * than an invisible one. Setting it in a passive effect would paint one frame
 * of the fully-composed hero first — exactly the "everything appears at once"
 * flash this is meant to remove.
 *
 * ── Observers ───────────────────────────────────────────────────────────
 * None added. This plays once on mount and is done; the two continuous hooks
 * keep their existing in-view pausing, which is the only thing that needs it.
 */
import { useCallback, useLayoutEffect, useRef } from 'react';
import { createScope, createTimeline, stagger, svg, utils } from 'animejs';
import type { Scope } from 'animejs';
import { prefersReducedMotion } from '../../../utils/motion';

/** Everything that starts hidden, and how far it starts below its resting
 *  place. SVG groups get no offset — moving a node off its connector and
 *  back would read as the drawing settling, not as it being built. */
const COPY_LIFT = 12;

export function useEnstudioHeroEntrance() {
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
      const links = svg.createDrawable(root.querySelectorAll('.enstudio-connector'));

      /* Hidden state, before the first paint. Group wrappers only — see the
         note above about why no individual connector, dot or ring is touched
         here. */
      utils.set(root, { opacity: 0 });
      utils.set('.esh-badge, .esh-title, .esh-sub, .esh-body, .esh-chip, .esh-cta', {
        opacity: 0,
        translateY: COPY_LIFT,
      });
      utils.set('.enstudio-visual', { opacity: 0 });
      utils.set(links, { draw: '0 0' });
      utils.set('.enstudio-connector-dots, .enstudio-core, .enstudio-flow-particles', { opacity: 0 });
      utils.set('.enstudio-source-node, .enstudio-output-node', { opacity: 0 });
      utils.set('.esh-wave', { opacity: 0 });

      /* One timeline, absolute positions in milliseconds. Written as numbers
         rather than relative offsets so the running order is readable as a
         column and a single step can be retimed without shifting the rest. */
      createTimeline({ defaults: { ease: 'outQuad', duration: 600 } })
        // 1. Background.
        .add(root, { opacity: 1, duration: 450 }, 0)

        // 2. The copy, line by line.
        .add('.esh-badge', { opacity: 1, translateY: 0, duration: 550 }, 200)
        .add('.esh-title', { opacity: 1, translateY: 0, duration: 650 }, 400)
        .add('.esh-sub', { opacity: 1, translateY: 0, duration: 550 }, 680)
        .add('.esh-body', { opacity: 1, translateY: 0, duration: 550 }, 880)
        .add('.esh-chip', { opacity: 1, translateY: 0, duration: 480, delay: stagger(80) }, 1080)
        .add('.esh-cta', { opacity: 1, translateY: 0, duration: 550 }, 1350)

        // 3. The composition's container.
        .add('.enstudio-visual', { opacity: 1, duration: 600 }, 1500)

        /* 4. Connectors draw themselves in, source end first. This is the
              step that makes the picture read as being built rather than
              faded up. */
        .add(links, { draw: '0 1', duration: 1000, delay: stagger(60), ease: 'inOutQuad' }, 1850)
        .add('.enstudio-connector-dots', { opacity: 1, duration: 550 }, 2450)

        // 5. The core.
        .add('.enstudio-core', { opacity: 1, duration: 750 }, 2600)

        // 6. Nodes, staggered down each column.
        .add('.enstudio-source-node', { opacity: 1, duration: 550, delay: stagger(80) }, 2950)
        .add('.enstudio-output-node', { opacity: 1, duration: 550, delay: stagger(80) }, 3150)

        /* 7. The packets. Their loops have been running unseen since mount,
              so the flow is already mid-stride when it becomes visible. */
        .add('.enstudio-flow-particles', { opacity: 1, duration: 650 }, 3600)

        // 8. The network field, last and slowest.
        .add('.esh-wave', { opacity: 0.4, duration: 900, ease: 'inOutSine' }, 3800);
    });

    scopeRef.current = scope;

    return () => {
      scope.revert();
      scopeRef.current = null;
    };
  }, []);

  return setRef;
}
