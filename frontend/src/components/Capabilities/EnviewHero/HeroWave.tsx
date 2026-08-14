/**
 * The digital wave across the left of the composition.
 *
 * One surface, not a bundle: every strand is the same spine offset by a
 * fraction of the band's thickness (see wavePath), so the family reads as a
 * ribbon twisting through space. Drawn in three passes —
 *
 *   1. a wide, heavily blurred copy of the band, which is the glow,
 *   2. the strands themselves, thin and mostly dim,
 *   3. a few bright strands near the core of the band,
 *
 * — because a single stroke width and opacity reads as a wireframe. The
 * brightness follows the strand's distance from the centre, which is what
 * gives the band a lit edge.
 *
 * Colour runs blue at the entry to violet at the crest and back to blue,
 * matching the room's ambient light rather than introducing a third hue.
 *
 * ── The flow ────────────────────────────────────────────────────────────
 * Two mechanisms, because they answer two different halves of the brief.
 *
 *   · A bright SEGMENT travels down each strand: a dash of 18% of the path
 *     with an 82% gap, offset from 1 to 0. `pathLength="1"` normalises every
 *     strand, so curves of different lengths advance in step and the only
 *     thing separating them is phase and speed. That is light moving along
 *     the surface, not the surface changing brightness.
 *
 *   · Real PARTICLES ride the strands on SMIL animateMotion — a dot actually
 *     traversing the curve, which is the one thing a dash cannot fake. Each
 *     strand carries several, dropped in mid-run by a negative `begin`, so
 *     the stream is already populated on the first frame and no two dots
 *     arrive together.
 *
 * Both enter and leave through the same gradient mask the band uses, so
 * particles fade up as they come in and dissolve before the dashboard rather
 * than winking out at a hard edge.
 *
 * SMIL is not covered by the global prefers-reduced-motion rule and not by
 * animation-play-state either, so the particle layer is skipped outright
 * rather than paused.
 */
import React from 'react';
import { useSvgPause } from '../EngramHero/useSvgPause';
import { BLEED as B, STAGE, WAVE, waveParticles, wavePath } from './enviewHeroData';

/** The strands that carry a travelling segment and the particle stream.
 *  A subset, not all 26: light on every strand at once reads as a flicker
 *  across the whole band rather than as movement through it. */
const FLOW_K = [-0.78, -0.56, -0.34, -0.14, 0.04, 0.22, 0.42, 0.62, 0.8];

interface Props {
  reduceMotion: boolean;
  /** False when the hero is off-screen: pauses the SMIL timeline. */
  active: boolean;
}

const HeroWave: React.FC<Props> = ({ reduceMotion, active }) => {
  const svgRef = useSvgPause(active);
  const strands = Array.from({ length: WAVE.strands }, (_, i) => {
    const k = (i / (WAVE.strands - 1)) * 2 - 1;
    return { k, i };
  });

  return (
    <svg
      ref={svgRef}
      className="evh-layer evh-layer-wave"
      viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Along the band: entry blue, crest violet, exit back to blue. */}
        <linearGradient id="evh-wave-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.15" />
          <stop offset="18%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="44%" stopColor="#818cf8" stopOpacity="1" />
          <stop offset="68%" stopColor="#7dd3fc" stopOpacity="1" />
          <stop offset="88%" stopColor="#2563eb" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="evh-wave-glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6d28d9" stopOpacity="0" />
          <stop offset="30%" stopColor="#7c3aed" stopOpacity="0.55" />
          <stop offset="62%" stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
        </linearGradient>

        <filter id="evh-wave-blur" x="-25%" y="-60%" width="150%" height="220%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="evh-wave-soft" x="-15%" y="-40%" width="130%" height="180%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>

        {/* The band fades out before it reaches the dashboard, so the two
            never fight for the same space. */}
        <linearGradient id="evh-wave-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="22%" stopColor="#fff" stopOpacity="1" />
          <stop offset="70%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="evh-wave-mask" maskUnits="userSpaceOnUse">
          <rect x={-B} y={-B} width={STAGE.w + B} height={STAGE.h + B * 2} fill="url(#evh-wave-fade)" />
        </mask>
      </defs>

      <g mask="url(#evh-wave-mask)">
        {/* 1. The glow — the band's own shape, blurred into light */}
        <g filter="url(#evh-wave-blur)" fill="none" stroke="url(#evh-wave-glow)" strokeLinecap="round">
          {[-0.5, 0, 0.5].map((k) => (
            <path key={k} d={wavePath(k)} strokeWidth="58" strokeOpacity="0.5" />
          ))}
        </g>

        {/* 2. The strands. Brightness and weight fall away from the core of
               the band, which is what gives the ribbon a lit edge instead of
               reading as a flat wireframe. */}
        <g fill="none" stroke="url(#evh-wave-grad)" strokeLinecap="round">
          {strands.map(({ k, i }) => {
            const core = 1 - Math.abs(k);
            return (
              <path
                key={i}
                d={wavePath(k)}
                strokeWidth={(0.5 + core * 1.15).toFixed(2)}
                strokeOpacity={(0.1 + Math.pow(core, 1.6) * 0.62).toFixed(3)}
              />
            );
          })}
        </g>

        {/* 3. A few bright strands through the core, softened just enough to
               read as light rather than as wire. */}
        <g
          fill="none"
          stroke="url(#evh-wave-grad)"
          strokeLinecap="round"
          filter="url(#evh-wave-soft)"
        >
          {[-0.16, -0.05, 0.06, 0.18].map((k) => (
            <path key={k} d={wavePath(k)} strokeWidth="1.5" strokeOpacity="0.85" />
          ))}
        </g>

        {/* Light travelling down the band. One bright segment per strand,
            each on its own clock, so the movement reads as a stream rather
            than as a pulse the whole band shares. */}
        <g fill="none" stroke="url(#evh-wave-grad)" strokeLinecap="round">
          {FLOW_K.map((k, i) => (
            <path
              key={k}
              className="evh-strand-flow"
              style={
                {
                  '--dur': `${(9.5 + (i % 4) * 2.1).toFixed(1)}s`,
                  '--d': `${(-i * 1.35).toFixed(2)}s`,
                } as React.CSSProperties
              }
              d={wavePath(k)}
              pathLength="1"
              strokeWidth={(1.05 + (1 - Math.abs(k)) * 1.25).toFixed(2)}
            />
          ))}
        </g>

        {/* Data points riding the flow. Real travel along the curve, which is
            the one thing the dash above cannot fake. */}
        {!reduceMotion && (
          <g stroke="none">
            {FLOW_K.map((k, i) => {
              const d = wavePath(k);
              const dur = 12.5 + (i % 5) * 2.8;
              return Array.from({ length: 4 }, (_, j) => (
                <circle
                  key={`${i}-${j}`}
                  r={(0.9 + ((i + j) % 3) * 0.6).toFixed(2)}
                  fill={(i + j) % 2 ? '#c4b5fd' : '#bae6fd'}
                  opacity={(0.55 + ((i * 2 + j) % 3) * 0.16).toFixed(2)}
                >
                  <animateMotion
                    dur={`${dur.toFixed(2)}s`}
                    repeatCount="indefinite"
                    calcMode="linear"
                    path={d}
                    // Negative begin drops each dot mid-run, so the stream is
                    // full on the first frame and never syncs up.
                    begin={`${(-(j / 4) * dur - i * 0.9).toFixed(2)}s`}
                  />
                </circle>
              ));
            })}
          </g>
        )}

        {/* Dust thrown off the flow. Seeded from points ON the strands, so it
            follows the band rather than filling a rectangle. */}
        <g stroke="none">
          {waveParticles.map((p, i) => (
            <circle
              key={i}
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r={p.r.toFixed(2)}
              fill={p.warm ? '#c4b5fd' : '#7dd3fc'}
              opacity={p.o.toFixed(2)}
            />
          ))}
        </g>
      </g>
    </svg>
  );
};

export default HeroWave;
