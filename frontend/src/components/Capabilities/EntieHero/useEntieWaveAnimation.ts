/**
 * The enTIE bottom band's motion — deliberately separate from
 * useEntieFlowAnimation, so the wave can be retimed without touching the
 * composition and vice versa.
 *
 * Two kinds of tween, nine in total:
 *
 *   lanes    each <g> scrolls left by exactly one wavelength and repeats.
 *            Because the curve inside it is periodic with that wavelength,
 *            the end state is identical to the start and the loop is
 *            seamless. Linear, because a scrolling field that eases reads as
 *            the whole page hesitating.
 *
 *   riders   three particles tracking their lane's curve. They sit inside
 *            the scrolling <g>, so the lane transform carries them and the
 *            motion path only has to describe the line's shape.
 *
 * Same lifecycle as the flow's hook: Anime.js writes to the DOM directly,
 * `inView` is the only state and flips twice per scroll-past, reduced motion
 * returns before anything is created — leaving the six still curves, which
 * is a finished picture on its own — and `scope.revert()` removes every tween
 * and inline style on unmount.
 */
import { useCallback, useEffect, useRef } from 'react';
import { animate, createScope, svg } from 'animejs';
import type { JSAnimation, Scope } from 'animejs';
import { useInView } from 'react-intersection-observer';
import { prefersReducedMotion } from '../../../utils/motion';

/** Rider speed in canvas units per millisecond — about 25 seconds to cross.
 *  Slower than the flow packets above so the band stays secondary, but
 *  several times faster than the lane it rides, which is what makes it read
 *  as a signal running along a slowly drifting line rather than as a speck
 *  stuck to it. */
const RIDER_SPEED = 0.11;
/** Idle between a rider's runs, so the band is not continuously busy. */
const RIDER_GAP = 3200;
/** Spread between the three riders' first runs. */
const RIDER_STAGGER = 2800;

export function useEntieWaveAnimation() {
  const rootRef = useRef<SVGSVGElement | null>(null);
  const animsRef = useRef<JSAnimation[]>([]);
  const scopeRef = useRef<Scope | null>(null);

  const { ref: inViewRef, inView } = useInView({ threshold: 0, rootMargin: '160px' });

  const setRef = useCallback(
    (node: SVGSVGElement | null) => {
      rootRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const scope = createScope({ root }).add(() => {
      const anims: JSAnimation[] = [];

      root.querySelectorAll<SVGGElement>('.entie-wave-lane').forEach((lane, i) => {
        const period = Number(lane.dataset.period);
        const duration = Number(lane.dataset.duration);

        // The scroll. Exactly one wavelength — see the note in the component
        // about why that is what makes the repeat invisible.
        anims.push(
          animate(lane, { translateX: -period, duration, ease: 'linear', loop: true }),
        );

        const rider = lane.querySelector<SVGCircleElement>('.entie-wave-particle');
        if (!rider) return;
        const path = root.querySelector<SVGPathElement>(rider.dataset.path as string);
        if (!path) return;

        const { translateX, translateY } = svg.createMotionPath(path);
        const dur = path.getTotalLength() / RIDER_SPEED;

        anims.push(
          animate(rider, {
            translateX,
            translateY,
            // Dark at both ends: a signal passing through the frame, not a
            // dot being switched on and off at the edges.
            opacity: [
              { to: 0.7, duration: dur * 0.2, ease: 'outSine' },
              { to: 0.7, duration: dur * 0.6 },
              { to: 0, duration: dur * 0.2, ease: 'inSine' },
            ],
            duration: dur,
            ease: 'linear',
            delay: i * RIDER_STAGGER,
            loop: true,
            loopDelay: RIDER_GAP,
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

  useEffect(() => {
    animsRef.current.forEach((a) => (inView ? a.resume() : a.pause()));
  }, [inView]);

  return setRef;
}
