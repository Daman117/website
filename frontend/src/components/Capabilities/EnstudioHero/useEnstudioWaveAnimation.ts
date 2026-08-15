/**
 * The bottom band's motion — deliberately separate from
 * useEnstudioHeroAnimation, so the wave can be retimed without touching the
 * composition and vice versa.
 *
 * Two kinds of tween, five in total:
 *
 *   layers   each <g> scrolls left by exactly one pattern period and repeats.
 *            Because the node grid inside it is periodic with that distance,
 *            the end state is identical to the start and the loop is
 *            seamless. Linear, because a scrolling field that eases reads as
 *            the whole page hesitating.
 *
 *   signals  two particles tracking a route through the net. They sit inside
 *            the scrolling <g>, so the layer transform carries them and the
 *            motion path only has to describe the route's shape.
 *
 * Same lifecycle as the composition's hook: Anime.js writes to the DOM
 * directly, `inView` is the only state and flips twice per scroll-past,
 * reduced motion returns before anything is created, and `scope.revert()`
 * removes every tween and inline style on unmount.
 */
import { useCallback, useEffect, useRef } from 'react';
import { animate, createScope, svg } from 'animejs';
import type { JSAnimation, Scope } from 'animejs';
import { useInView } from 'react-intersection-observer';
import { prefersReducedMotion } from '../../../utils/motion';

/** Signal speed in user units per millisecond. Slower than the flow packets
 *  above so the band stays secondary, but several times faster than the layer
 *  it rides, which is what makes it read as activation running through the
 *  net rather than as a speck stuck to it. */
const SIGNAL_SPEED = 0.11;
/** Idle between runs, so the field is not continuously busy. */
const SIGNAL_GAP = 3000;

export function useEnstudioWaveAnimation() {
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
    // Reduced motion keeps the band exactly as rendered: a still network at
    // low contrast, which is a finished picture on its own.
    if (!root || prefersReducedMotion()) return;

    const scope = createScope({ root }).add(() => {
      const anims: JSAnimation[] = [];

      root.querySelectorAll<SVGGElement>('.enstudio-net-layer').forEach((layer, i) => {
        const period = Number(layer.dataset.period);
        const duration = Number(layer.dataset.duration);

        // The scroll. Exactly one pattern period — see the note in the
        // component about why that is what makes the repeat invisible.
        anims.push(
          animate(layer, {
            translateX: -period,
            duration,
            ease: 'linear',
            loop: true,
          }),
        );

        const signal = layer.querySelector<SVGCircleElement>('.enstudio-net-particle');
        if (!signal) return;
        const path = root.querySelector<SVGPathElement>(signal.dataset.path as string);
        if (!path) return;

        const { translateX, translateY } = svg.createMotionPath(path);
        const dur = path.getTotalLength() / SIGNAL_SPEED;

        anims.push(
          animate(signal, {
            translateX,
            translateY,
            // Dark at both ends: activation passing through, not a dot being
            // switched on and off at the ends of the route.
            opacity: [
              { to: 0.7, duration: dur * 0.2, ease: 'outSine' },
              { to: 0.7, duration: dur * 0.6 },
              { to: 0, duration: dur * 0.2, ease: 'inSine' },
            ],
            duration: dur,
            ease: 'linear',
            // Offset so the routes never fire together.
            delay: i * 3400,
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

  useEffect(() => {
    animsRef.current.forEach((a) => (inView ? a.resume() : a.pause()));
  }, [inView]);

  return setRef;
}
