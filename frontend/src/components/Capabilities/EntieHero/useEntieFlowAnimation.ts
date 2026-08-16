/**
 * The enTIE hero's data flow — source → core → output, continuously.
 *
 * Scoped to the .eth-visual container rather than to one SVG, because the
 * flow crosses layers: the packets and lanes live in EntieConnectors, and the
 * connection points they light up live in EntieCore.
 *
 * ── What moves ──────────────────────────────────────────────────────────
 *   packets   one per lane, riding the real connector path. Constant SPEED,
 *             not constant duration.
 *   pulse     a short dash sweeping each lane while its packet crosses it —
 *             a signal passing through the line, with the base line still
 *             visible underneath and no whole-line flash.
 *   core      an arrival brightens the CORRESPONDING connection point, not
 *             the whole core: row 2's packet lights row 2's node. The core's
 *             own shield lifts a little, throttled, so four
 *             arrivals a cycle read as one busy moment rather than a strobe.
 *             A departure is a smaller event on the outbound node only.
 *   idle      the core's own life underneath all that: the outer outline
 *             breathes, the inner one drifts a fraction of a degree, the
 *             interior lines shimmer out of step, and five sparks run
 *             stretches of those lines. All slower and smaller than the
 *             flow — the packets stay the primary movement.
 *
 * ── Causality ───────────────────────────────────────────────────────────
 * Output lane i departs PROCESS after input lane i lands, so the eye reads
 * IN → PROCESSING → OUT rather than two independent streams. The return leg
 * is not a mirror of the inbound one: it runs slightly faster and each lane
 * carries its own extra offset, so the two sides never move in lockstep.
 *
 * Every lane shares one CYCLE with its own phase, so packets never bunch and
 * the picture is never empty.
 *
 * ── Cost ────────────────────────────────────────────────────────────────
 * 16 looping tweens for the flow (8 packets, 8 pulses), 8 more for the core,
 * plus a few short one-shots per cycle for the connection points. No React
 * state drives a frame; `inView` flips twice per scroll-past.
 * `scope.revert()` removes every tween and inline style on unmount.
 */
import { useCallback, useEffect, useRef } from 'react';
import { animate, createScope, stagger, svg, utils } from 'animejs';
import type { JSAnimation, Scope } from 'animejs';
import { useInView } from 'react-intersection-observer';
import { prefersReducedMotion } from '../../../utils/motion';

/** Canvas units per millisecond. The return leg is quicker — results leave
 *  faster than material arrives, and it stops the two sides mirroring. */
const SPEED_IN = 0.055;
const SPEED_OUT = 0.066;

/** One packet per lane per cycle. Must exceed the longest traversal so every
 *  lane gets a gap rather than a queue. */
const CYCLE = 5200;
/** Between inbound lanes leaving. Deliberately not a divisor of CYCLE. */
const LAUNCH_STEP = 820;
/** How long the core appears to hold a packet before the result leaves. */
const PROCESS = 240;
/** Extra per-lane drift on the way out, so the return leg is not the inbound
 *  leg played backwards. */
const OUT_DRIFT = 90;

/** Length of the travelling highlight, as a fraction of its lane. Short
 *  enough to read as a signal passing rather than as the line lighting up. */
const PULSE_LEN = 0.14;

/* ── The core's own life ────────────────────────────────────────────────
   Everything here is slower and smaller than the flow above it: the packets
   are the subject, the core is what they pass through. */

/** Outer outline breath. Nine seconds each way — slow enough to register as
 *  the drawing being alive, not as an animation running. Its drop-shadow is
 *  painted from the element's own alpha. */
const BREATH = 9000;
const BREATH_LOW = 0.65;
const BREATH_HIGH = 0.85;

/** The inner outline's drift. Six tenths of a degree over eighty seconds, and
 *  back: on a 490-unit-tall box that moves a corner by about two units. The
 *  one rotating element in the composition, and deliberately the one you have
 *  to look for. */
const DRIFT = 80000;
const DRIFT_DEG = 0.6;

/** Resting and lit values for the interior lines. */
const SIGNAL_REST = 0.55;
const SIGNAL_SHIMMER = 6400;

/** The shield sits dimmed and answers arrivals. */
const SHIELD_REST = 0.7;

const phase = (t: number) => t % CYCLE;

export function useEntieFlowAnimation() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const animsRef = useRef<JSAnimation[]>([]);
  const scopeRef = useRef<Scope | null>(null);

  // Not triggerOnce: the hero has to go quiet again once scrolled past.
  const { ref: inViewRef, inView } = useInView({ threshold: 0, rootMargin: '160px' });

  /** One node, two refs — the observer's and ours. */
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    const root = rootRef.current;
    // Reduced motion keeps the static composition: the packets and pulses are
    // already transparent in CSS, so doing nothing is the correct still frame.
    if (!root || prefersReducedMotion()) return;

    const scope = createScope({ root }).add(() => {
      const anims: JSAnimation[] = [];
      const shield = root.querySelector<SVGGElement>('.entie-core-shield');

      /* The core's response to an arrival: a brief brightening of the shield.
         Only on arrival, never on departure, and throttled on top of that —
         eight events a cycle would read as a constant pulse rather than as an
         answer. The halo that used to lift with it has been removed. */
      let lastArrival = 0;
      const respond = () => {
        const now = performance.now();
        if (now - lastArrival < 420) return;
        lastArrival = now;
        if (shield) {
          animate(shield, {
            opacity: [
              { to: 1, duration: 220, ease: 'outSine' },
              { to: SHIELD_REST, duration: 780, ease: 'inOutSine' },
            ],
          });
        }
      };

      /** Brighten one connection point on the core — the one this lane
       *  actually serves. Ring and centre are separate elements, so the ring
       *  can widen while the centre only brightens. `strength` is what makes
       *  a departure a smaller event than an arrival. */
      const lightNode = (side: 'in' | 'out', index: number, strength = 1) => {
        const node = root.querySelector<SVGGElement>(`#eth-core-node-${side}-${index}`);
        if (!node) return;
        animate(node.querySelector('.entie-core-node-ring')!, {
          r: [
            { to: 9 + 2.5 * strength, duration: 200, ease: 'out(3)' },
            { to: 9, duration: 620, ease: 'inOutSine' },
          ],
        });
        animate(node.querySelector('.entie-core-node-dot')!, {
          opacity: [
            { to: 0.85 + 0.15 * strength, duration: 200, ease: 'outSine' },
            { to: 0.85, duration: 620, ease: 'inOutSine' },
          ],
        });
      };

      /* Resting values set from JS, not the stylesheet, so a reduced-motion
         visitor — who never reaches this code — keeps the composition at full
         strength instead of a dimmed version of it. */
      utils.set('.entie-core-node-dot', { opacity: 0.85 });

      /** One lane: its packet and its travelling highlight. */
      const runLane = (
        dir: 'source' | 'output',
        index: number,
        start: number,
        // Defaulted, not optional: Anime's param type rejects an explicit
        // undefined for onLoop.
        onArrive: () => void = () => {},
      ) => {
        const path = root.querySelector<SVGPathElement>(
          `.entie-connector[data-dir="${dir}"][data-index="${index}"]`,
        );
        const packet = root.querySelector<SVGCircleElement>(
          `.entie-flow-particle[data-dir="${dir}"][data-index="${index}"]`,
        );
        const pulse = root.querySelector<SVGPathElement>(
          `.entie-connector-pulse[data-dir="${dir}"][data-index="${index}"]`,
        );
        if (!path || !packet || !pulse) return;

        const dur = path.getTotalLength() / (dir === 'source' ? SPEED_IN : SPEED_OUT);
        const gap = CYCLE - dur;
        const { translateX, translateY } = svg.createMotionPath(path);

        anims.push(
          animate(packet, {
            translateX,
            translateY,
            // Linear: a packet that eases is a packet that hesitates.
            ease: 'linear',
            // Lit for the middle of the run, dark at both ends, so it arrives
            // and departs rather than blinking in and out.
            opacity: [
              { to: 0.95, duration: dur * 0.2, ease: 'outSine' },
              { to: 0.95, duration: dur * 0.6 },
              { to: 0, duration: dur * 0.2, ease: 'inSine' },
            ],
            duration: dur,
            delay: start,
            loop: true,
            loopDelay: gap,
            onLoop: onArrive,
          }),

          /* The highlight, travelling with its packet. `draw` is Anime's own
             drawable property — a "start end" pair in path fractions — so a
             segment of fixed length slides from one end of the lane to the
             other. Written by hand as stroke-dashoffset it silently did
             nothing: Anime does not recognise that key on an SVG element,
             and both the set and the tween were dropped without an error. */
          animate(svg.createDrawable(pulse), {
            draw: [`0 ${PULSE_LEN}`, `${1 - PULSE_LEN} 1`],
            duration: dur,
            ease: 'linear',
            delay: start,
            loop: true,
            loopDelay: gap,
          }),

          /* Its opacity rides on the element itself, so the highlight fades
             in and out at the ends of the run rather than sitting parked on
             the lane through the idle gap. */
          animate(pulse, {
            opacity: [
              { to: 0.85, duration: dur * 0.2, ease: 'outSine' },
              { to: 0.85, duration: dur * 0.6 },
              { to: 0, duration: dur * 0.2, ease: 'inSine' },
            ],
            duration: dur,
            delay: start,
            loop: true,
            loopDelay: gap,
          }),
        );

        return dur;
      };

      /* On a phone the composition is 320px wide and eight lanes carrying
         packets read as noise rather than as flow. Every other row runs
         instead — half the packets, half the pulses, and the lanes that sit
         out keep their drawn base line, which is exactly what the static
         composition already looks like. */
      const compact = window.matchMedia('(max-width: 719px)').matches;
      const skip = (i: number) => compact && i % 2 === 1;

      // Inbound: staggered launches; each arrival lights its own core node.
      const inDurations: number[] = [];
      [0, 1, 2, 3].forEach((i) => {
        if (skip(i)) return;
        const start = phase(i * LAUNCH_STEP);
        const dur = runLane('source', i, start, () => {
          lightNode('in', i);
          respond();
        });
        inDurations[i] = dur ?? 0;
      });

      /* Outbound: departs once the matching input has landed and been
         processed, plus a per-lane drift so the return leg is its own
         movement rather than the inbound one reversed. Its departure lights
         the core's outbound node on that row. */
      [0, 1, 2, 3].forEach((i) => {
        if (skip(i)) return;
        const start = phase(i * LAUNCH_STEP + inDurations[i] + PROCESS + i * OUT_DRIFT);
        // A departure is a smaller event than an arrival, and it does not
        // wake the shield — it answers incoming data only.
        runLane('output', i, start, () => lightNode('out', i, 0.6));
      });

      /* ── The core's own life ────────────────────────────────────────────
         Secondary to the flow in every dimension: slower, smaller, and never
         touching a shape's geometry. Resting values are set BEFORE each
         tween is built — a tween reads its implicit start value at creation,
         so setting it afterwards leaves the animation running from wherever
         the element happened to be and the set value is overwritten on the
         next frame. They are set from JS rather than the stylesheet so a
         reduced-motion visitor, who never reaches this code, keeps the
         composition at full strength. */

      // 1. The outer outline breathes. Opacity only — its shadow follows.
      const outline = root.querySelector<SVGPolygonElement>('.entie-core-outline');
      if (outline) {
        utils.set(outline, { opacity: BREATH_LOW });
        anims.push(
          animate(outline, {
            opacity: BREATH_HIGH,
            duration: BREATH,
            ease: 'inOutSine',
            alternate: true,
            loop: true,
          }),
        );
      }

      /* 2. The inner outline drifts, and nothing else in the core rotates.
            It alternates rather than turning continuously, because a
            chamfered box is not rotationally symmetric — a full turn would
            be obvious, where a fraction of a degree and back is not. */
      const innerOutline = root.querySelector<SVGPolygonElement>('.entie-core-inner');
      if (innerOutline) {
        anims.push(
          animate(innerOutline, {
            rotate: DRIFT_DEG,
            duration: DRIFT,
            ease: 'inOutSine',
            alternate: true,
            loop: true,
          }),
        );
      }

      /* 3. The interior lines shimmer out of step with each other, so the
            core never brightens as one block. */
      utils.set('.entie-core-signal', { opacity: SIGNAL_REST });
      anims.push(
        animate('.entie-core-signal', {
          opacity: 1,
          duration: SIGNAL_SHIMMER,
          delay: stagger(700),
          ease: 'inOutSine',
          alternate: true,
          loop: true,
        }),
      );

      /* 4. Signals running the interior: each spark travels its own stretch
            of line, half of them downward and half up, fading at both ends
            so it reads as information moving through rather than as a dot
            being switched on. Ranges are sized to stay inside the container
            at every point of the run. */
      utils.set(shield ?? [], { opacity: SHIELD_REST });
      root.querySelectorAll<SVGCircleElement>('.entie-core-spark').forEach((spark, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const travel = 90 + i * 10;
        const dur = 9000 + i * 1400;
        utils.set(spark, { translateY: (-dir * travel) / 2, opacity: 0 });
        anims.push(
          animate(spark, {
            translateY: (dir * travel) / 2,
            opacity: [
              { to: 0.85, duration: dur * 0.22, ease: 'outSine' },
              { to: 0.85, duration: dur * 0.56 },
              { to: 0, duration: dur * 0.22, ease: 'inSine' },
            ],
            duration: dur,
            ease: 'linear',
            delay: i * 1300,
            loop: true,
            loopDelay: 2200,
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
     every packet's phase, so scrolling back finds the flow mid-stride. */
  useEffect(() => {
    animsRef.current.forEach((a) => (inView ? a.resume() : a.pause()));
  }, [inView]);

  return setRef;
}
