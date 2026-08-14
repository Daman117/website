/**
 * The control room the dashboard floats in.
 *
 * Built from primitives on purpose — long thin light strips, flat planes, a
 * glazed wall, a few silhouettes. The room has to give the composition depth
 * and a light source without competing with the panel that is the subject,
 * so nothing in here has detail of its own to look at.
 *
 * Three things do the work:
 *
 *   · a ceiling light strip and a floor strip, both raking away toward the
 *     right, which is what establishes the perspective;
 *   · a glazed wall on the right with plant lights beyond it, which is what
 *     makes the space read as a real control room rather than a void;
 *   · a floor sheen under the dashboard, which is what makes it read as
 *     standing in the room rather than pasted on top of it.
 *
 * The gradients in the section's own background carry the ambient violet and
 * blue. This layer only adds the geometry that background cannot express.
 */
import React from 'react';
import { BLEED as B, CITY, MULLIONS, STAGE } from './enviewHeroData';

/** The glazed wall's box on the canvas. */
/* Runs off the right edge, so the glazed wall reaches the viewport rather
   than stopping at the canvas. */
const GLASS = { x: 1216, y: -B, w: 304 + B, h: 640 + B };

const HeroEnvironment: React.FC = () => (
  <svg
    className="evh-layer evh-layer-room"
    viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* Light strips: brightest where they are nearest, dissolving into the
          room at both ends. */}
      <linearGradient id="evh-strip" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0" />
        <stop offset="26%" stopColor="#60a5fa" stopOpacity="0.7" />
        <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="evh-strip-cool" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#312e81" stopOpacity="0" />
        <stop offset="40%" stopColor="#818cf8" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.75" />
      </linearGradient>

      {/* The wall of glass: darkest at the top, opening to the plant below. */}
      <linearGradient id="evh-glass" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#0b1229" stopOpacity="0.9" />
        <stop offset="58%" stopColor="#101c3d" stopOpacity="0.62" />
        <stop offset="100%" stopColor="#16264f" stopOpacity="0.45" />
      </linearGradient>

      {/* Floor: a polished plane catching the ceiling light. */}
      <linearGradient id="evh-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e293b" stopOpacity="0.55" />
        <stop offset="42%" stopColor="#0f172a" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#020617" stopOpacity="0.7" />
      </linearGradient>

      <radialGradient id="evh-pool" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.34" />
        <stop offset="60%" stopColor="#4c1d95" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#020617" stopOpacity="0" />
      </radialGradient>

      <filter id="evh-room-blur" x="-40%" y="-200%" width="180%" height="500%">
        <feGaussianBlur stdDeviation="7" />
      </filter>

      {/* Beyond the glass is out of focus — it is 40 metres away. */}
      <filter id="evh-far-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>

      <clipPath id="evh-glass-clip">
        <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} />
      </clipPath>
    </defs>

    {/* ── Back wall and floor ───────────────────────────────────────────
        The horizon sits high, so most of the frame is floor. That is what
        gives the dashboard something to stand on. */}
    <rect x={-B} y="556" width={STAGE.w + B * 2} height={STAGE.h - 556 + B} fill="url(#evh-floor)" />
    <path
      d={`M${-B} 556H${STAGE.w + B}`}
      stroke="#1e3a8a"
      strokeOpacity="0.42"
      strokeWidth="1"
      fill="none"
    />

    {/* Floor tile joints, raking to a vanishing point off the right edge —
        the cheapest honest perspective cue there is. */}
    <g stroke="#334155" strokeOpacity="0.2" strokeWidth="0.8" fill="none">
      {[598, 646, 706, 780, 872, 986, 1128].map((y) => (
        <path key={y} d={`M${-B} ${y}H${STAGE.w + B}`} />
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const x = -B - 200 + i * 240;
        return <path key={i} d={`M${x + 500} 556L${x} ${STAGE.h + B}`} strokeOpacity="0.13" />;
      })}
    </g>

    {/* ── Ceiling light strips ──────────────────────────────────────────
        Two of them, raking the same way as the floor joints so the room
        reads as one space. Blurred: they are the light source, not fixtures. */}
    <g filter="url(#evh-room-blur)" fill="none" strokeLinecap="round">
      <path d={`M700 96L${STAGE.w + B} ${96 - (B + 100) * 0.079}`} stroke="url(#evh-strip)" strokeWidth="7" />
      <path d={`M1010 190L${STAGE.w + B} ${190 - (B + 90) * 0.05}`} stroke="url(#evh-strip-cool)" strokeWidth="4.5" />
    </g>
    <g fill="none" strokeLinecap="round">
      <path d={`M700 96L${STAGE.w + B} ${96 - (B + 100) * 0.079}`} stroke="#dbeafe" strokeOpacity="0.75" strokeWidth="1.6" />
      <path d={`M1010 190L${STAGE.w + B} ${190 - (B + 90) * 0.05}`} stroke="#bfdbfe" strokeOpacity="0.5" strokeWidth="1.1" />
    </g>

    {/* A recessed strip low on the left wall, which is what keeps the dark
        left half from going flat behind the wave. */}
    <g filter="url(#evh-room-blur)">
      <path d={`M${-B} 618L560 588`} stroke="url(#evh-strip-cool)" strokeWidth="5" fill="none" />
    </g>
    <path d={`M${-B} 618L560 588`} stroke="#93c5fd" strokeOpacity="0.4" strokeWidth="1.1" fill="none" />

    {/* ── The glazed wall ───────────────────────────────────────────────── */}
    <g clipPath="url(#evh-glass-clip)">
      <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} fill="url(#evh-glass)" />

      {/* Plant lights beyond the glass, out of focus. */}
      <g filter="url(#evh-far-blur)">
        {CITY.map((l, i) => {
          const x = GLASS.x + l.u * GLASS.w;
          const y = 470 + l.v * 190;
          return (
            <circle
              key={i}
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r={l.r.toFixed(2)}
              fill={l.warm ? '#fcd34d' : '#7dd3fc'}
              opacity={l.o.toFixed(2)}
            />
          );
        })}
        {/* Stack and column silhouettes on the skyline. */}
        <g fill="#060b1a" opacity="0.72">
          <rect x={GLASS.x + 26} y="504" width="18" height="120" />
          <rect x={GLASS.x + 74} y="530" width="34" height="94" />
          <rect x={GLASS.x + 132} y="486" width="12" height="138" />
          <rect x={GLASS.x + 168} y="546" width="46" height="78" />
          <rect x={GLASS.x + 232} y="516" width="20" height="108" />
        </g>
      </g>

      {/* Mullions */}
      <g stroke="#1e3a8a" strokeOpacity="0.5" strokeWidth="1.4" fill="none">
        {MULLIONS.map((f) => (
          <path key={f} d={`M${(GLASS.x + f * 304).toFixed(1)} ${GLASS.y}V${GLASS.y + GLASS.h}`} />
        ))}
        <path d={`M${GLASS.x} 280H${GLASS.x + GLASS.w}`} strokeOpacity="0.28" />
      </g>

      {/* A raking highlight down the glass, which is what makes it read as a
          surface rather than as a hole in the wall. */}
      <path
        d={`M${GLASS.x + 40} ${GLASS.y}L${GLASS.x + 190} ${GLASS.y + GLASS.h}h34L${GLASS.x + 74} ${GLASS.y}Z`}
        fill="#bfdbfe"
        opacity="0.05"
      />
    </g>

    {/* ── Operator consoles, far right ──────────────────────────────────
        Silhouettes only. They set the scale of the room; any more detail and
        they start competing with the dashboard. */}
    <g fill="#050a18" opacity="0.9">
      <path d="M1332 594h188v26h-188z" />
      <path d="M1356 568h150v26h-150z" />
      <path d="M1300 636h220v18h-220z" />
    </g>
    <g fill="#1d4ed8" opacity="0.5">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={1352 + i * 27} y={572} width="21" height="15" rx="1.5" />
      ))}
    </g>
    {/* Chair */}
    <g fill="#070d1e" opacity="0.92">
      <path d="M1258 598h44v58a10 10 0 0 1-10 10h-24a10 10 0 0 1-10-10z" />
      <path d="M1272 666h16v34h-16z" />
      <path d="M1250 700h60v8h-60z" />
    </g>

    {/* ── Floor pool under the dashboard ────────────────────────────────
        The dashboard's own base glow lives with the dashboard; this is the
        light it spills onto the floor, which is what seats it in the room. */}
    <ellipse cx="1024" cy="742" rx="470" ry="82" fill="url(#evh-pool)" />
  </svg>
);

export default HeroEnvironment;
