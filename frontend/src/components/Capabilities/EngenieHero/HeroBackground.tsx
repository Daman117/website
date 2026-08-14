/**
 * The enGENIE hero's flowing background.
 *
 * Replaces the photographic backdrop with drawn structure: four bands of thin
 * technical lines across the lower half, reading as data in transit rather
 * than as water. Nothing here is an image, so it costs a few kilobytes of
 * markup instead of a hundred, and it can be animated.
 *
 * ── One surface, not four ribbons ───────────────────────────────────────
 * Each BAND is a family of curves sharing one spine, offset by a fraction of
 * the band's thickness. That is what makes a family read as a single surface
 * twisting through space; drawn as unrelated curves they read as a bundle of
 * wires. The four bands differ in height, curvature, thickness, opacity and
 * speed, so no two ever crest together.
 *
 * ── How the flow works ──────────────────────────────────────────────────
 * The wave pattern travels; the wave container never moves. Anime drives a
 * bright SEGMENT along each band — an 18% dash with an 82% gap, offset run
 * from 1 to 0 — and `pathLength="1"` normalises every strand, so curves of
 * different lengths advance at the same rate and only duration and phase
 * separate them. Because the dash pattern is periodic, the end of a loop is
 * pixel-identical to its start: there is nothing to reset and no jump to see.
 *
 * The bands themselves are static line work. Moving them would be the "whole
 * group sliding" the brief rules out; moving light along them is what reads
 * as continuous forward flow.
 *
 * ── The left field ──────────────────────────────────────────────────────
 * A second family enters off-canvas on the left and sweeps toward the centre,
 * fanning WIDE at the edge and converging as it travels — data entering the
 * system and being brought into order. It is authored as a convergence rather
 * than a parallel sweep for exactly that reason: parallel lines read as
 * decoration, converging ones read as a process.
 *
 * It shares the bottom bands' technique and palette, so the two read as one
 * field rather than two effects: same offset-spine construction, same
 * travelling-segment flow, same gradients.
 *
 * It is held to the left GUTTER by its own mask — full strength at the edge,
 * gone by the time it reaches the middle of the headline. That is what keeps
 * it off the copy rather than relying on opacity alone.
 *
 * ── The particles ───────────────────────────────────────────────────────
 * Fourteen of them, and they ride the SAME paths the travelling light does —
 * `svg.createMotionPath` takes the existing flow path and hands back the
 * translate track for it. That is the whole reason they read as part of the
 * system rather than as dust laid over it: they are not following a
 * similar-looking route, they are following the identical one.
 *
 * It also means they inherit the readability guarantee for free. Each set
 * lives inside the same mask as the family it rides, so a particle crossing
 * the copy is already faded out by the mask that keeps the lines off it —
 * no per-particle exclusion zone to maintain.
 *
 * Each carries its own duration, delay, radius and brightness so the set
 * never reads as synchronised, and each fades up on entry and down on exit,
 * which is what makes the wrap invisible: a particle is at zero opacity at
 * both ends of its loop, so there is no moment where one is seen jumping back
 * to the start.
 *
 * ── Readability ─────────────────────────────────────────────────────────
 * A mask fades the whole layer out toward the top and the right, so the
 * headline, body copy, badges and CTA all sit over the part of the canvas
 * where the waves have already dissolved. The layer is also `pointer-events:
 * none` and sits below the hero content in the stacking order.
 */
import React, { useEffect, useRef } from 'react';
import { animate, svg } from 'animejs';
import type { JSAnimation } from 'animejs';

const W = 1600;
const H = 900;

/** The four bands, low on the canvas and fanning out to the right.
 *
 *  `y` is where the spine enters on the left, `dip` how far it falls, `k` the
 *  crest position across the width. They are authored rather than generated
 *  because four curves that never quite agree read as a real field, and a
 *  formula would make them siblings. */
const BANDS = [
  { y: 470, dip: 168, k: 0.24, spread: 62, strands: 16, w: 0.55, o: 0.5, dur: 12000, hue: '#818cf8' },
  { y: 560, dip: 132, k: 0.31, spread: 78, strands: 20, w: 0.6, o: 0.62, dur: 15000, hue: '#a855f7' },
  { y: 655, dip: 96, k: 0.19, spread: 54, strands: 14, w: 0.5, o: 0.44, dur: 18500, hue: '#38bdf8' },
  { y: 745, dip: 60, k: 0.35, spread: 40, strands: 11, w: 0.45, o: 0.32, dur: 21500, hue: '#6366f1' },
];

/** One strand of a band. `t` runs -1..1 across the thickness; the push is
 *  pinched at the entry and widest past the crest, which is what makes the
 *  band look like it twists rather than fanning open forever. */
function strand(b: (typeof BANDS)[number], t: number): string {
  const s = b.spread * t;
  const crest = W * b.k;
  return (
    `M-120 ${(b.y + s * 0.15).toFixed(1)}` +
    `C${(crest * 0.42).toFixed(0)} ${(b.y + b.dip * 0.5 + s * 0.55).toFixed(1)} ` +
    `${(crest * 0.72).toFixed(0)} ${(b.y + b.dip + s * 1.05).toFixed(1)} ` +
    `${crest.toFixed(0)} ${(b.y + b.dip * 0.86 + s * 0.9).toFixed(1)}` +
    `C${(crest + W * 0.18).toFixed(0)} ${(b.y + b.dip * 0.6 + s * 0.6).toFixed(1)} ` +
    `${(crest + W * 0.38).toFixed(0)} ${(b.y - b.dip * 0.16 + s * 0.24).toFixed(1)} ` +
    `${W + 120} ${(b.y - b.dip * 0.34 + s * 0.1).toFixed(1)}`
  );
}

/** The left field. Entries spread down the left edge; exits bunch toward the
 *  centre, which is the convergence. */
const LEFT = { lines: 26, x0: -200, x1: 780, flow: [0.08, 0.24, 0.4, 0.56, 0.72, 0.9] };

function leftPath(t: number): string {
  const yIn = 70 + t * 620;
  const yOut = 415 + t * 205;
  // Fattest bend through the middle of the fan, so the family twists rather
  // than fanning open in a straight sheaf.
  const bend = 46 + Math.sin(t * Math.PI) * 104;
  return (
    `M${LEFT.x0} ${yIn.toFixed(1)}` +
    `C${(LEFT.x0 + 300).toFixed(0)} ${(yIn + bend).toFixed(1)} ` +
    `${(LEFT.x1 * 0.5).toFixed(0)} ${(yOut - bend * 0.55).toFixed(1)} ` +
    `${LEFT.x1} ${yOut.toFixed(1)}`
  );
}

/* A deliberately small set. `fam` picks which family's path it rides and `i`
   which line within it; the rest is what keeps two particles from ever
   looking like a pair. Tints stay inside the field's own palette. */
const PARTICLES = [
  { fam: 'wave', i: 0, dur: 17000, delay: 0, r: 1.6, o: 0.75, tint: '#a5b4fc', pulse: true },
  { fam: 'wave', i: 0, dur: 21000, delay: -9000, r: 1.1, o: 0.5, tint: '#c4b5fd', pulse: false },
  { fam: 'wave', i: 1, dur: 19500, delay: -4200, r: 1.9, o: 0.8, tint: '#c4b5fd', pulse: true },
  { fam: 'wave', i: 1, dur: 26000, delay: -15000, r: 1.2, o: 0.45, tint: '#7dd3fc', pulse: false },
  { fam: 'wave', i: 2, dur: 23000, delay: -7000, r: 1.4, o: 0.6, tint: '#7dd3fc', pulse: true },
  { fam: 'wave', i: 3, dur: 29000, delay: -12000, r: 1.1, o: 0.4, tint: '#a5b4fc', pulse: false },
  { fam: 'left', i: 0, dur: 15000, delay: -2000, r: 1.3, o: 0.62, tint: '#c4b5fd', pulse: false },
  { fam: 'left', i: 1, dur: 18500, delay: -8000, r: 1.7, o: 0.78, tint: '#a78bfa', pulse: true },
  { fam: 'left', i: 2, dur: 16500, delay: -5500, r: 1.2, o: 0.5, tint: '#a5b4fc', pulse: false },
  { fam: 'left', i: 3, dur: 20500, delay: -11000, r: 1.5, o: 0.66, tint: '#a78bfa', pulse: true },
  { fam: 'left', i: 4, dur: 17500, delay: -3000, r: 1.1, o: 0.44, tint: '#7dd3fc', pulse: false },
  { fam: 'left', i: 5, dur: 22500, delay: -14000, r: 1.4, o: 0.58, tint: '#c4b5fd', pulse: false },
  { fam: 'wave', i: 2, dur: 31000, delay: -20000, r: 1, o: 0.34, tint: '#818cf8', pulse: false },
  { fam: 'left', i: 2, dur: 25000, delay: -17000, r: 1, o: 0.36, tint: '#818cf8', pulse: false },
  /* On the second lit strand of each band, so traffic spreads across a band's
     thickness rather than filing down its centre line. */
  { fam: 'wave', i: 4, dur: 24000, delay: -6000, r: 1.3, o: 0.5, tint: '#c4b5fd', pulse: false },
  { fam: 'wave', i: 5, dur: 27500, delay: -13000, r: 1.1, o: 0.42, tint: '#a5b4fc', pulse: true },
  { fam: 'wave', i: 7, dur: 33000, delay: -21000, r: 1, o: 0.3, tint: '#7dd3fc', pulse: false },
] as const;

type Particle = (typeof PARTICLES)[number];

/** One particle. Drawn at the origin — the motion path supplies its position,
 *  so a fixed cx/cy would fight the translate. */
const Dot: React.FC<{ p: Particle; id: number }> = ({ p, id }) => (
  <circle
    className={`egn-dot${p.pulse ? ' is-pulsing' : ''}`}
    data-dot={id}
    cx="0"
    cy="0"
    r={p.r}
    fill={p.tint}
    opacity="0"
  />
);

interface Props {
  reduceMotion: boolean;
  /** False when the hero is off-screen. Around a hundred instances run across
   *  this hero; leaving them ticking behind the fold is work nobody sees. */
  active: boolean;
}

const HeroBackground: React.FC<Props> = ({ reduceMotion, active }) => {
  const ref = useRef<SVGSVGElement>(null);
  const runsRef = useRef<JSAnimation[]>([]);

  /* Paused rather than reverted — a revert would snap every dash back to its
     resting offset. Pausing holds the frame. */
  useEffect(() => {
    runsRef.current.forEach((r) => (active ? r.play() : r.pause()));
  }, [active]);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion) return;

    const runs: JSAnimation[] = [];
    /* One instance per band, because each needs its OWN duration — that
       difference is what stops the four reading as one pulse. */
    root.querySelectorAll<SVGPathElement>('.egn-wave-flow, .egn-left-flow').forEach((el, i) => {
      runs.push(
        animate(el, {
          strokeDashoffset: [1, 0],
          duration: Number(el.dataset.dur) || 14000,
          delay: i * 1700,
          ease: 'linear',
          loop: true,
        })
      );
    });

    /* Particles ride the flow paths themselves. createMotionPath turns an
       existing <path> into a translate track, so a particle follows the
       identical route the light does rather than an approximation of it. */
    const fams = {
      wave: Array.from(root.querySelectorAll<SVGPathElement>('.egn-wave-flow')),
      left: Array.from(root.querySelectorAll<SVGPathElement>('.egn-left-flow')),
    };

    root.querySelectorAll<SVGCircleElement>('.egn-dot').forEach((dot) => {
      const p = PARTICLES[Number(dot.dataset.dot)];
      if (!p) return;
      const family = fams[p.fam];
      const route = family[p.i % family.length];
      if (!route) return;

      const { translateX, translateY } = svg.createMotionPath(route);
      runs.push(
        animate(dot, {
          translateX,
          translateY,
          duration: p.dur,
          delay: p.delay,
          ease: 'linear',
          loop: true,
        })
      );

      /* Zero at both ends of the loop, so the wrap is never seen. The long
         middle hold is what keeps it from reading as a blink. */
      runs.push(
        animate(dot, {
          opacity: [
            { to: 0, duration: 0 },
            { to: p.o, duration: p.dur * 0.16 },
            { to: p.o, duration: p.dur * 0.58 },
            { to: 0, duration: p.dur * 0.26 },
          ],
          delay: p.delay,
          ease: 'inOutSine',
          loop: true,
        })
      );

      /* A few breathe. On `r`, not scale: scale is a transform component and
         would have to share the transform the motion path is writing. */
      if (p.pulse) {
        runs.push(
          animate(dot, {
            r: [p.r, p.r * 1.5, p.r],
            duration: 4200,
            delay: p.delay,
            ease: 'inOutSine',
            loop: true,
          })
        );
      }
    });

    runsRef.current = runs;
    /* Reverted on UNMOUNT, so nothing is left stamped inline — distinct from
       the off-screen pause above, which has to preserve the frame. */
    return () => {
      runsRef.current = [];
      runs.forEach((r) => r.revert());
    };
  }, [reduceMotion]);

  return (
    <svg
      ref={ref}
      className="egn-bg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <defs>
        {BANDS.map((b, i) => (
          <linearGradient key={i} id={`egn-band-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="0">
            <stop offset="0%" stopColor={b.hue} stopOpacity="0" />
            <stop offset="18%" stopColor={b.hue} stopOpacity="0.9" />
            <stop offset="62%" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="88%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </linearGradient>
        ))}

        {/* The left field's own palette: violet at the edge, cooling as it
            converges. */}
        <linearGradient id="egn-left-grad" gradientUnits="userSpaceOnUse" x1={LEFT.x0} y1="0" x2={LEFT.x1} y2="0">
          <stop offset="0%" stopColor="#4c1d95" stopOpacity="0" />
          <stop offset="16%" stopColor="#7c3aed" stopOpacity="1" />
          <stop offset="52%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>

        {/* Holds the field in the left gutter. Gone before it reaches the
            middle of the headline, which is what keeps the copy clean without
            leaning on opacity alone. */}
        <linearGradient id="egn-left-fade" gradientUnits="userSpaceOnUse" x1={LEFT.x0} y1="0" x2={LEFT.x1} y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="14%" stopColor="#fff" stopOpacity="1" />
          <stop offset="38%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="72%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="egn-left-mask" maskUnits="userSpaceOnUse">
          <rect x={LEFT.x0} y="0" width={LEFT.x1 - LEFT.x0} height={H} fill="url(#egn-left-fade)" />
        </mask>

        {/* Keeps the bottom bands off the copy: gone by the top of the
            canvas, and thinning where the engineering visual sits. */}
        <linearGradient id="egn-fade-y" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="0" y2={H}>
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="34%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="egn-mask" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={W} height={H} fill="url(#egn-fade-y)" />
        </mask>

        {/* Holds the bands in the lower LEFT: they curve up toward the centre
            and are gone before the right half, which is where the engineering
            visual will sit. A second mask rather than a second gradient stop,
            because one mask cannot fade on two axes at once — nested masks
            multiply, which is exactly the product wanted here. */}
        <linearGradient id="egn-fade-x" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.92" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="78%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="egn-mask-x" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={W} height={H} fill="url(#egn-fade-x)" />
        </mask>
      </defs>

      {/* ── The left field ─────────────────────────────────────────────── */}
      <g className="egn-left" mask="url(#egn-left-mask)" stroke="url(#egn-left-grad)" strokeLinecap="round">
        {Array.from({ length: LEFT.lines }, (_, i) => {
          const t = i / (LEFT.lines - 1);
          // Brightest through the middle of the fan, so it has a lit core.
          const core = 1 - Math.abs(t * 2 - 1);
          return (
            <path
              key={i}
              d={leftPath(t)}
              strokeWidth={(0.4 + core * 0.5).toFixed(2)}
              strokeOpacity={(0.1 + Math.pow(core, 1.5) * 0.34).toFixed(3)}
            />
          );
        })}

        {LEFT.flow.map((t, i) => (
          <path
            key={`f${t}`}
            className="egn-left-flow"
            data-dur={10500 + i * 2300}
            d={leftPath(t)}
            pathLength={1}
            strokeWidth="1.1"
          />
        ))}

        <g className="egn-dots" stroke="none">
          {PARTICLES.map((p, i) => (p.fam === 'left' ? <Dot key={i} p={p} id={i} /> : null))}
        </g>
      </g>

      <g className="egn-bands" mask="url(#egn-mask)">
        <g mask="url(#egn-mask-x)">
        {BANDS.map((b, i) => (
          <g key={i} stroke={`url(#egn-band-${i})`} strokeLinecap="round">
            {Array.from({ length: b.strands }, (_, j) => {
              const t = (j / (b.strands - 1)) * 2 - 1;
              /* Brightness falls away from the core of the band, which gives
                 the surface a lit edge instead of a flat wireframe look. */
              const core = 1 - Math.abs(t);
              return (
                <path
                  key={j}
                  d={strand(b, t)}
                  strokeWidth={(b.w * (0.5 + core)).toFixed(2)}
                  strokeOpacity={(b.o * (0.16 + Math.pow(core, 1.6) * 0.84)).toFixed(3)}
                />
              );
            })}

            {/* The travelling light. Two strands per band rather than one:
                a single lit line reads as a wire, two at different depths and
                speeds read as flow ACROSS a surface. The second is held
                dimmer so the band is no brighter overall than before. */}
            <path
              className="egn-wave-flow"
              data-dur={b.dur}
              d={strand(b, 0)}
              pathLength={1}
              strokeWidth={(b.w * 2.2).toFixed(2)}
            />
            <path
              className="egn-wave-flow is-second"
              data-dur={Math.round(b.dur * 1.38)}
              d={strand(b, -0.52)}
              pathLength={1}
              strokeWidth={(b.w * 1.5).toFixed(2)}
            />
          </g>
        ))}

        <g className="egn-dots" stroke="none">
          {PARTICLES.map((p, i) => (p.fam === 'wave' ? <Dot key={i} p={p} id={i} /> : null))}
        </g>
        </g>
      </g>
    </svg>
  );
};

export default HeroBackground;
