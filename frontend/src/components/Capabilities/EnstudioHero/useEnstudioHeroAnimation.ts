/**
 * The enSTUDIO hero's flow animation — all of it, in one place.
 *
 * The composition (EnstudioHeroVisual) stays a pure static render. This hook
 * owns every moving part, so nothing about the drawing has to change for the
 * motion to change, and no frame of the animation goes through React: Anime.js
 * writes transforms and opacities straight to the DOM nodes. The only state
 * this hook holds is `inView`, which flips twice per scroll-past.
 *
 * ── What moves ──────────────────────────────────────────────────────────
 *   packets   a particle rides each connector, source → core, then core →
 *             output. Constant SPEED, not constant duration: the links differ
 *             in length by 5×, and a fixed duration would have the short ones
 *             crawling while the long ones raced.
 *   link      the connector under a packet swells from 0.7 to full opacity
 *             and back, so the active link is the bright one.
 *   dots      the endpoint dot brightens and widens as its packet leaves or
 *             lands. The two hub dots react on arrival instead, because five
 *             links share each of them.
 *   core      a short glow lift on arrival, plus its own idle life: the outer
 *             hexagon breathes, the inner one drifts a sixth of a turn, the
 *             schematic shimmers, and a signal runs two lengths of it. All of
 *             that is slower and smaller than the flow — the packets are the
 *             subject, the core is the room they arrive in. The arrival
 *             response stays the only thing that reacts to an event.
 *
 * ── Causality ───────────────────────────────────────────────────────────
 * Output link i departs 260ms after input link i lands, so the eye reads
 * INPUT → CORE → OUTPUT rather than two independent streams. Every path runs
 * on the same CYCLE with its own phase offset, so packets never bunch up and
 * the loop has no moment where the picture empties.
 *
 * ── Cost ────────────────────────────────────────────────────────────────
 * 30 looping tweens for the flow (10 packets, 10 links, 10 dots), 5 more for
 * the core, and a few short one-shots per cycle for the hubs. They pause
 * entirely when the hero scrolls out of view, and `scope.revert()` removes
 * them and restores every inline style on unmount.
 */
import { useCallback, useEffect, useRef } from 'react';
import { animate, createScope, stagger, svg, utils } from 'animejs';
import type { JSAnimation, Scope } from 'animejs';
import { useInView } from 'react-intersection-observer';
import { prefersReducedMotion } from '../../../utils/motion';

/** User units per millisecond. 62 units/second across a 700-unit canvas: a
 *  packet crosses the longest link in about four seconds. Slower reads as
 *  stalled, faster reads as a game. */
const SPEED = 0.062;
/** One packet per link per cycle. Must exceed the longest single traversal
 *  (~4s) so every link gets a gap between packets rather than a queue. */
const CYCLE = 5600;
/** Between input links leaving. Deliberately not a divisor of CYCLE. */
const LAUNCH_STEP = 900;
/** Core dwell: how long processing appears to take before the result leaves. */
const PROCESS = 260;

/** Phase within the cycle. Delays past one full cycle would leave a link empty
 *  for its first several seconds and then settle into exactly this. */
const phase = (t: number) => t % CYCLE;

/* ── The core's own idle life ───────────────────────────────────────────
   Everything here is slower than the data flow by design: the packets are the
   subject, and the core is the room they arrive in. Long durations, small
   ranges, and nothing that changes an outline's geometry. */

/** Outer hexagon breath. Nine seconds each way — slow enough that the change
 *  registers as the drawing being alive, not as an animation running. Its
 *  drop-shadow is painted from the element's own alpha, so fading the stroke
 *  varies the glow with it and no filter has to be animated. */
const BREATH = 9000;
const BREATH_LOW = 0.65;
const BREATH_HIGH = 0.9;

/** Inner hexagon drift. 60° over two minutes on a six-fold symmetric shape:
 *  the end state is pixel-identical to the start, so the loop has no seam and
 *  nothing needs to alternate. About 0.5°/s — visible only if you watch for
 *  it, which is the point. */
const DRIFT = 120000;

/** Schematic shimmer: symbols lifting and settling out of step with each
 *  other, so the diagram reads as busy rather than as one fading block. */
const SHIMMER = 5200;
const SHIMMER_STEP = 420;

/** The internal signal sweep. Far slower than a data packet — 20 units/second
 *  against the flow's 62 — and idle between runs. */
const SIGNAL_SPEED = 0.02;
const SIGNAL_GAP = 4200;

type Els = {
  particle: SVGCircleElement;
  path: SVGPathElement;
  dot: SVGCircleElement;
  len: number;
  dur: number;
};

export function useEnstudioHeroAnimation() {
  const rootRef = useRef<SVGSVGElement | null>(null);
  const animsRef = useRef<JSAnimation[]>([]);
  const scopeRef = useRef<Scope | null>(null);

  // Not triggerOnce: the hero has to go quiet again once scrolled past.
  const { ref: inViewRef, inView } = useInView({ threshold: 0, rootMargin: '160px' });

  /** One node, two refs — the observer's and ours. */
  const setRef = useCallback(
    (node: SVGSVGElement | null) => {
      rootRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    const root = rootRef.current;
    // Reduced motion keeps the static composition: the particles are already
    // transparent in CSS, so doing nothing is the correct still frame.
    if (!root || prefersReducedMotion()) return;

    const scope = createScope({ root }).add(() => {
      const anims: JSAnimation[] = [];
      const glow = root.querySelector<SVGCircleElement>('.enstudio-glow');
      const outerRing = root.querySelector<SVGPolygonElement>('.enstudio-core-ring');
      const innerRing = root.querySelector<SVGPolygonElement>('.enstudio-core-inner');
      const hubIn = root.querySelector<SVGCircleElement>('[data-hub="in"]');
      const hubOut = root.querySelector<SVGCircleElement>('[data-hub="out"]');

      /* Resting values the swell and the lift return to. Set from JS, not in
         the stylesheet, so a reduced-motion visitor — who never gets here —
         keeps the composition at full strength instead of a dimmed version of
         it waiting for an animation that will not run. */
      utils.set('.enstudio-connector', { opacity: 0.7 });
      if (innerRing) utils.set(innerRing, { opacity: 0.85 });

      /** Collect one side's links with their measured lengths. */
      const collect = (flow: 'in' | 'out'): Els[] =>
        Array.from(
          root.querySelectorAll<SVGCircleElement>(`.enstudio-flow-particle[data-flow="${flow}"]`),
        ).map((particle) => {
          const path = root.querySelector<SVGPathElement>(particle.dataset.path as string)!;
          const dot = root.querySelector<SVGCircleElement>(
            `.enstudio-connector-dot[data-flow="${flow}"][data-index="${particle.dataset.index}"]`,
          )!;
          const len = path.getTotalLength();
          return { particle, path, dot, len, dur: len / SPEED };
        });

      const ins = collect('in');
      const outs = collect('out');

      const pulseHub = (hub: SVGCircleElement | null, delay = 0) => {
        if (!hub) return;
        animate(hub, {
          r: [
            { to: 6.6, duration: 200, ease: 'out(3)' },
            { to: 5, duration: 620, ease: 'inOut(2)' },
          ],
          delay,
        });
      };

      /* The core's whole reaction, fired only when a packet LANDS on it —
         never on a departure, or with ten events a cycle it would read as a
         constant pulse rather than as a response. Throttled on top of that,
         because five links share the hub and two arrivals a few hundred
         milliseconds apart are one busy moment, not two.

         The output hub follows one PROCESS later, which is the packet being
         handed on: in, held, out. */
      let lastArrival = 0;
      const arrive = () => {
        const now = performance.now();
        if (now - lastArrival < 420) return;
        lastArrival = now;
        pulseHub(hubIn);
        pulseHub(hubOut, PROCESS);
        if (glow) {
          animate(glow, {
            opacity: [
              { to: 0.5, duration: 240, ease: 'out(2)' },
              { to: 0.34, duration: 900, ease: 'inOut(2)' },
            ],
            scale: [
              { to: 1.05, duration: 240, ease: 'out(2)' },
              { to: 1, duration: 900, ease: 'inOut(2)' },
            ],
          });
        }
        if (innerRing) {
          animate(innerRing, {
            opacity: [
              { to: 1, duration: 220, ease: 'out(2)' },
              { to: 0.85, duration: 820, ease: 'inOut(2)' },
            ],
          });
        }
      };

      /** One link: its packet, its swell, and its endpoint dot. `onArrive`
       *  fires as the packet completes a run — set only on the input side, so
       *  the core answers data coming in and stays quiet the rest of the
       *  time. */
      const run = (el: Els, start: number, dotAt: number, onArrive: () => void = () => {}) => {
        const { translateX, translateY } = svg.createMotionPath(el.path);
        const gap = CYCLE - el.dur;

        anims.push(
          animate(el.particle, {
            translateX,
            translateY,
            // Linear: a packet that eases is a packet that hesitates.
            ease: 'linear',
            // Lit for the middle of the journey, dark at both ends, so it
            // arrives and departs rather than blinking in and out.
            opacity: [
              { to: 0.95, duration: el.dur * 0.18, ease: 'out(2)' },
              { to: 0.95, duration: el.dur * 0.64 },
              { to: 0, duration: el.dur * 0.18, ease: 'in(2)' },
            ],
            duration: el.dur,
            delay: start,
            loop: true,
            loopDelay: gap,
            onLoop: onArrive,
          }),

          // The link brightens under its packet and settles behind it.
          animate(el.path, {
            opacity: [
              { to: 1, duration: el.dur * 0.42, ease: 'inOut(2)' },
              { to: 0.7, duration: el.dur * 0.58, ease: 'inOut(2)' },
            ],
            delay: start,
            loop: true,
            loopDelay: gap,
          }),

          // The endpoint dot: a widen-and-brighten as the packet passes it.
          animate(el.dot, {
            opacity: [
              { to: 1, duration: 260, ease: 'out(2)' },
              { to: 0.75, duration: 520, ease: 'inOut(2)' },
            ],
            r: [
              { to: 4.1, duration: 260, ease: 'out(2)' },
              { to: 3, duration: 520, ease: 'inOut(2)' },
            ],
            delay: dotAt,
            loop: true,
            loopDelay: CYCLE - 780,
          }),
        );
      };

      /* On a phone the composition is 320px wide and ten packets on it read as
         static noise rather than as flow. Every other link runs instead, which
         also drops the tween count from 30 to 18. The skipped links keep their
         resting stroke — a drawn connector with no packet on it is exactly
         what the static composition already looks like. */
      const compact = window.matchMedia('(max-width: 719px)').matches;
      const skip = (i: number) => compact && i % 2 === 1;

      ins.forEach((el, i) => {
        if (skip(i)) return;
        const start = phase(i * LAUNCH_STEP);
        // The source dot fires as its packet leaves; the core answers when it
        // lands.
        run(el, start, start, arrive);
      });

      outs.forEach((el, i) => {
        if (skip(i)) return;
        // Departs once the matching input has landed and been processed.
        const start = phase(i * LAUNCH_STEP + ins[i].dur + PROCESS);
        // The output dot fires as its packet lands, not as it leaves, and the
        // landing itself is the end of the story — nothing reacts to it.
        run(el, start, phase(start + el.dur - 300));
      });

      /* ── The core's idle life ──────────────────────────────────────────
         Secondary to the flow in every dimension: slower, smaller, and never
         touching an outline's geometry. The arrival response above stays the
         only thing in the composition that reacts to an event. */

      /* 1. The outer hexagon breathes. Opacity only — the drop-shadow is
            painted from the element's alpha and follows it for free.

            The resting value is set BEFORE the tween is built, not after: a
            tween reads its implicit start value at creation, so setting it
            afterwards leaves the animation running from wherever the element
            happened to be and the set value is overwritten on the next
            frame. */
      if (outerRing) {
        utils.set(outerRing, { opacity: BREATH_LOW });
        anims.push(
          animate(outerRing, {
            opacity: BREATH_HIGH,
            duration: BREATH,
            ease: 'inOutSine',
            alternate: true,
            loop: true,
          }),
        );
      }

      /* 2. The inner hexagon drifts. The one rotating element in the SVG, and
            it turns exactly one sixth of a turn, so the hexagon lands on
            itself and the loop is seamless. The schematic is its sibling, not
            its child, so nothing inside the core turns with it. */
      if (innerRing) {
        anims.push(
          animate(innerRing, { rotate: 60, duration: DRIFT, ease: 'linear', loop: true }),
        );
      }

      /* 3. The schematic shimmers. One call over every symbol with a stagger,
            so they lift out of step and the diagram never dims as a block.
            The range is small on purpose: this has to stay readable. */
      utils.set('.enstudio-process-symbol', { opacity: 0.72 });
      anims.push(
        animate('.enstudio-process-symbol', {
          opacity: 1,
          duration: SHIMMER,
          delay: stagger(SHIMMER_STEP),
          ease: 'inOutSine',
          alternate: true,
          loop: true,
        }),
      );

      /* 4. The signal sweep: a small light running two lengths of the
            schematic, appearing and fading at the ends so it reads as a
            signal passing rather than as a dot being switched on. */
      root.querySelectorAll<SVGCircleElement>('.enstudio-process-signal').forEach((dot, i) => {
        const path = root.querySelector<SVGPathElement>(dot.dataset.path as string);
        if (!path) return;
        const { translateX, translateY } = svg.createMotionPath(path);
        const dur = path.getTotalLength() / SIGNAL_SPEED;
        anims.push(
          animate(dot, {
            translateX,
            translateY,
            opacity: [
              { to: 0.85, duration: dur * 0.25, ease: 'outSine' },
              { to: 0.85, duration: dur * 0.5 },
              { to: 0, duration: dur * 0.25, ease: 'inSine' },
            ],
            duration: dur,
            ease: 'linear',
            // Offset so the two runs never fire together.
            delay: i * (SIGNAL_GAP * 0.6),
            loop: true,
            loopDelay: SIGNAL_GAP,
          }),
        );
      });

      animsRef.current = anims;
    });

    scopeRef.current = scope;

    return () => {
      scope.revert();
      scopeRef.current = null;
      animsRef.current = [];
    };
  }, []);

  /* Off-screen the hero costs nothing. Pausing rather than reverting keeps
     every packet's phase, so scrolling back finds the flow mid-stride instead
     of restarting it. */
  useEffect(() => {
    animsRef.current.forEach((a) => (inView ? a.resume() : a.pause()));
  }, [inView]);

  return setRef;
}
