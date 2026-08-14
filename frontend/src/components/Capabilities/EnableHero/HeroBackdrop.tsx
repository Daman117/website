/**
 * The enABLE hero's background: a wave entering from the left, and a
 * perspective grid across the lower portion.
 *
 * Drawn rather than approximated with CSS gradients, because the reference's
 * background has STRUCTURE — a ribbon with strands you can count, a grid that
 * recedes to a vanishing point — and a radial gradient can only ever be a
 * smudge in roughly the right place.
 *
 * ── The wave ────────────────────────────────────────────────────────────
 * One surface, not a bundle: every strand is the same spine offset by a
 * fraction of the band's thickness, so the family reads as a ribbon twisting
 * through space. It enters off-canvas on the left and dissolves before it
 * reaches the second stage — the gradient mask does that, so the band never
 * competes with the rings and cards it sits behind.
 *
 * Deliberately dimmer than the enVIEW hero's wave. There the wave is the
 * subject; here it is atmosphere behind a pipeline that has to stay legible.
 *
 * ── The grid ────────────────────────────────────────────────────────────
 * A floor receding to a vanishing point: rows whose spacing grows toward the
 * viewer, and verticals that fan from a point above the horizon. Both come
 * from one projection, so the two families actually agree — drawn
 * independently they would read as a net rather than as a plane.
 *
 * Colour is blue and violet only. The ACTION stage owns amber in this
 * section, and an ambient warm glow behind everything would take that meaning
 * away from it.
 */
import React, { useRef } from 'react';
import { useBackdropMotion } from './useBackdropMotion';

const W = 1520;
const H = 920;

/* ── The wave ──────────────────────────────────────────────────────────
   Control points are absolute, so the entry can sit off-canvas without
   dragging the crest left with it. */
const STRANDS = 22;
const SPREAD = 96;

const strand = (k: number) => {
  const s = SPREAD * k;
  return (
    `M-360 ${(300 + s * 0.15).toFixed(1)}` +
    `C40 ${(352 + s * 0.4).toFixed(1)} 190 ${(560 + s * 1.05).toFixed(1)} ` +
    `330 ${(534 + s * 0.9).toFixed(1)}` +
    `C450 ${(512 + s * 0.66).toFixed(1)} 560 ${(474 + s * 0.3).toFixed(1)} ` +
    `700 ${(452 + s * 0.12).toFixed(1)}`
  );
};

/* ── The grid ──────────────────────────────────────────────────────────
   One projection for both families: `row` places a horizontal at depth v,
   and the verticals fan from the same vanishing point, so the plane is
   consistent rather than two overlaid rulings. */
const HORIZON = 612;
const VP = { x: W * 0.42, y: HORIZON - 120 };
const ROWS = 20;
const COLS = 34;

const rowY = (v: number) => HORIZON + Math.pow(v, 2.1) * (H + 150 - HORIZON);

/** Where a vertical crosses a given row. Straight from the vanishing point,
 *  which is what makes the two families meet correctly. */
const colX = (u: number, v: number) => {
  const far = W * 0.5 + (u - 0.5) * W * 0.34;
  const near = W * 0.5 + (u - 0.5) * W * 3.4;
  const t = rowY(v);
  const f = (t - VP.y) / (rowY(1) - VP.y);
  return far + (near - far) * f;
};

/* ── The row treadmill ─────────────────────────────────────────────────
   Forward motion on a perspective grid is each row taking over the position
   of the row in front of it. Over one loop every row does exactly that, so
   the configuration at the end is identical to the one at the start — which
   is what makes the wrap invisible without the grid ever being translated as
   a whole.

   Rows are drawn from k = -1 so there is always one arriving out of the
   horizon as the nearest one leaves the frame; without it a gap would open at
   the top on every cycle. Row -1 sits above the horizon line and is masked to
   nothing, so it costs a path and shows nothing. */
const ROW_KS = Array.from({ length: ROWS + 2 }, (_, i) => i - 1);

const rowGeom = (k: number): { y: number; hw: number } => {
  if (k < 0) {
    const a = rowGeom(0);
    const b = rowGeom(1);
    // Mirrored through row 0, which puts it just above the horizon.
    return { y: 2 * a.y - b.y, hw: Math.max(6, 2 * a.hw - b.hw) };
  }
  if (k > ROWS) {
    const a = rowGeom(ROWS);
    const b = rowGeom(ROWS - 1);
    return { y: 2 * a.y - b.y, hw: a.hw * (a.hw / b.hw) };
  }
  const v = k / ROWS;
  return { y: rowY(v), hw: (colX(1, v) - colX(0, v)) / 2 };
};

/* Deterministic dust, so the field is identical on every render. */
const dust = (() => {
  let s = 20260814;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return Array.from({ length: 78 }, () => {
    const v = 0.06 + rnd() * 0.94;
    const u = rnd();
    return {
      x: colX(u, v),
      y: rowY(v) - rnd() * 8,
      r: 0.75 + rnd() * 1.6,
      o: 0.26 + rnd() * 0.5,
      warm: rnd() > 0.6,
    };
  });
})();

interface Props {
  reduceMotion: boolean;
}

const HeroBackdrop: React.FC<Props> = ({ reduceMotion }) => {
  const ref = useRef<SVGSVGElement>(null);
  useBackdropMotion(ref, reduceMotion);

  return (
  <svg
    ref={ref}
    className="eab-bg"
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* Violet at the entry, blue as it passes under the pipeline. No warm
          stop anywhere: amber belongs to the ACTION stage alone. */}
      <linearGradient id="eab-wave-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.1" />
        <stop offset="26%" stopColor="#7c3aed" stopOpacity="0.85" />
        <stop offset="58%" stopColor="#6366f1" stopOpacity="0.9" />
        <stop offset="82%" stopColor="#38bdf8" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
      </linearGradient>

      <linearGradient id="eab-wave-glow" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6d28d9" stopOpacity="0" />
        <stop offset="34%" stopColor="#7c3aed" stopOpacity="0.4" />
        <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
      </linearGradient>

      <filter id="eab-wave-blur" x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="24" />
      </filter>

      {/* Dissolves well before the second stage, so the band is atmosphere
          rather than something competing with the rings. */}
      <linearGradient id="eab-wave-fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff" stopOpacity="0" />
        <stop offset="22%" stopColor="#fff" stopOpacity="1" />
        <stop offset="62%" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="eab-wave-mask" maskUnits="userSpaceOnUse">
        <rect x="-500" y="0" width={W + 500} height={H} fill="url(#eab-wave-fade)" />
      </mask>

      {/* userSpaceOnUse, NOT the default objectBoundingBox. A grid row is a
          perfectly horizontal line, so its bounding box has zero height — and
          a gradient in bounding-box units is not rendered at all on a
          zero-area box. That is why only the verticals were showing: they are
          diagonal, so their box has area. Stated in canvas coordinates, the
          same gradient serves both families. */}
      <linearGradient
        id="eab-grid-line"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1={HORIZON}
        x2="0"
        y2={H}
      >
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
        <stop offset="26%" stopColor="#818cf8" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.56" />
      </linearGradient>

      {/* Fades the grid out at the horizon and at both edges, so the plane
          has no visible boundary. */}
      <radialGradient id="eab-grid-fade" cx="42%" cy="86%" r="86%">
        <stop offset="0%" stopColor="#fff" stopOpacity="1" />
        <stop offset="60%" stopColor="#fff" stopOpacity="0.82" />
        <stop offset="88%" stopColor="#fff" stopOpacity="0.34" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <mask id="eab-grid-mask" maskUnits="userSpaceOnUse">
        <rect x="0" y={HORIZON - 40} width={W} height={H - HORIZON + 40} fill="url(#eab-grid-fade)" />
      </mask>
    </defs>

    {/* ── The grid, under everything ───────────────────────────────────── */}
    <g mask="url(#eab-grid-mask)" fill="none" stroke="url(#eab-grid-line)">
      {ROW_KS.map((k) => {
        const cur = rowGeom(k);
        const next = rowGeom(k + 1);
        return (
          <path
            key={`r${k}`}
            className={`eab-grid-row${k < 0 ? ' is-entering' : ''}${
              k === ROWS ? ' is-leaving' : ''
            }`}
            /* Where this row has to end up, and how much wider it gets on the
               way. The hook reads both rather than knowing the projection. */
            style={
              {
                '--ty': (next.y - cur.y).toFixed(2),
                '--sx': (next.hw / cur.hw).toFixed(4),
              } as React.CSSProperties
            }
            d={`M${(W / 2 - cur.hw).toFixed(1)} ${cur.y.toFixed(1)}L${(W / 2 + cur.hw).toFixed(
              1
            )} ${cur.y.toFixed(1)}`}
            strokeWidth="0.6"
          />
        );
      })}
      {Array.from({ length: COLS + 1 }, (_, c) => {
        const u = c / COLS;
        return (
          <path
            key={`c${c}`}
            d={`M${colX(u, 0).toFixed(1)} ${rowY(0).toFixed(1)}L${colX(u, 1).toFixed(
              1
            )} ${rowY(1).toFixed(1)}`}
            strokeWidth="0.5"
            strokeOpacity="0.44"
          />
        );
      })}

      <g stroke="none">
        {dust.map((p, i) => (
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

    {/* ── The wave, entering from the left ─────────────────────────────── */}
    <g mask="url(#eab-wave-mask)">
      <g filter="url(#eab-wave-blur)" fill="none" stroke="url(#eab-wave-glow)" strokeLinecap="round">
        {[-0.45, 0.1, 0.55].map((k) => (
          <path key={k} d={strand(k)} strokeWidth="46" strokeOpacity="0.42" />
        ))}
      </g>

      {/* Brightness falls away from the core of the band, which is what gives
          the ribbon a lit edge instead of reading as a flat wireframe. */}
      <g fill="none" stroke="url(#eab-wave-grad)" strokeLinecap="round">
        {Array.from({ length: STRANDS }, (_, i) => {
          const k = (i / (STRANDS - 1)) * 2 - 1;
          const core = 1 - Math.abs(k);
          return (
            <path
              key={i}
              d={strand(k)}
              strokeWidth={(0.5 + core * 1).toFixed(2)}
              strokeOpacity={(0.14 + Math.pow(core, 1.6) * 0.62).toFixed(3)}
            />
          );
        })}
      </g>

      {/* A bright segment travelling each of a few strands — the same
          technique the enVIEW wave uses, at a fraction of the brightness. */}
      <g fill="none" stroke="url(#eab-wave-grad)" strokeLinecap="round">
        {[-0.62, -0.4, -0.12, 0.16, 0.46, 0.68].map((k, i) => (
          <path
            key={k}
            className="eab-bg-flow"
            style={
              {
                '--dur': `${(11 + i * 2.4).toFixed(1)}s`,
                '--d': `${(-i * 2.6).toFixed(1)}s`,
              } as React.CSSProperties
            }
            d={strand(k)}
            pathLength="1"
            strokeWidth="1.4"
          />
        ))}
      </g>
      {/* Packets riding the band toward the analysis side. SMIL, because
          they have to follow the strand rather than approximate it — and it
          is skipped outright under reduced motion, which the global CSS rule
          cannot reach. */}
      {!reduceMotion && (
        <g className="eab-bg-dots">
          {[-0.52, -0.24, 0.04, 0.32, 0.6].map((k, i) => {
            const d = strand(k);
            const dur = 7.5 + (i % 3) * 2.2;
            return Array.from({ length: 2 }, (_, j) => (
              <circle key={`${i}-${j}`} r={1.3 + ((i + j) % 3) * 0.5}>
                <animateMotion
                  dur={`${dur.toFixed(2)}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                  path={d}
                  begin={`${(-(j / 2) * dur - i * 1.1).toFixed(2)}s`}
                />
              </circle>
            ));
          })}
        </g>
      )}
    </g>
  </svg>
  );
};

export default HeroBackdrop;
