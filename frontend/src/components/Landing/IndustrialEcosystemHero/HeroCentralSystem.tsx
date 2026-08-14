/**
 * The focal point: a digital process plant held inside a glass cylinder,
 * standing on the enxco core hub and its layered platform.
 *
 * Everything here is real SVG geometry driven by heroData, not artwork —
 * each tower, ring, disc and rim is an addressable element, which is the
 * whole point of building the hero this way instead of shipping the
 * reference as a picture.
 *
 * Restraint is deliberate. The structures are line drawings with a flat
 * translucent fill, lit by two soft gradients; there is no bloom filter, no
 * per-tower glow and no attempt at photoreal 3D. It should read as a
 * technical schematic that happens to have depth.
 */
import React from 'react';
import { seatY } from './heroData';
import type { HeroLayout } from './heroData';
import { HubMark } from './HeroIcons';

const HeroCentralSystem: React.FC<{ layout: HeroLayout }> = ({ layout }) => {
  const { cylinder, hub: HUB, platform: PLATFORM, plant, floorSpread, stage: STAGE } = layout;
  const { cx, rx, ry, topY, baseY } = cylinder;
  const floorY = (x: number) => seatY(cylinder, floorSpread, x);

  /* ── Turntable footprint ──────────────────────────────────────────────
     The authored plant is a skyline: units spread left-to-right across the
     front. To revolve, they need to sit on a DISC instead, so each unit is
     re-placed in polar coordinates while keeping its authored width, height
     and kind — the silhouette variety is preserved, only the footprint
     changes.

     Sunflower placement: the golden angle (137.508 deg) spreads units evenly
     around the pad with no visible rings or spokes, and sqrt(i/N) keeps the
     area density uniform rather than crowding the centre. */
  const N = plant.length;
  const rMax = rx * 0.84;
  const squash = ry / rx;
  const units = plant.map((st, i) => {
    const h = floorY(st.x) - st.top; // authored height, kept exactly
    const orbit = rMax * Math.sqrt((i + 0.5) / N);
    const theta = (i * 137.508) % 360;
    return { st, h, orbit, theta };
  });

  /* Floor rings on the cylinder's base plane — concentric ellipses keep the
     cylinder's own rx:ry ratio so they read as one flat surface. */
  const FLOOR_RINGS = [1, 0.76, 0.52, 0.29].map((f) => ({ rx: rx * f, ry: ry * f }));

  const FLOOR_RADIALS = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return { x: cx + rx * Math.cos(a), y: baseY + ry * Math.sin(a) };
  });

  /* Vertical light streaks inside the cylinder — the visual trace of source
     documents descending into the plant. Spaced, not scattered. */
  const streakCount = layout.variant === 'desktop' ? 15 : 9;
  const STREAK_XS = Array.from(
    { length: streakCount },
    (_, i) => cx - rx * 0.88 + (i * (rx * 1.76)) / (streakCount - 1)
  );

  /* Shallow downward spray beneath the platform. */
  const RAYS = Array.from({ length: 13 }, (_, i) => {
    const t = (i / 12) * 2 - 1;
    return {
      x2: cx + t * (PLATFORM.lower.rx * 1.01),
      y2: PLATFORM.emitter.y + PLATFORM.lower.ry * 0.76 + PLATFORM.lower.ry * 0.62 * (1 - t * t),
    };
  });

  return (
  <svg
    className="ieh-layer ieh-layer-core"
    viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="ieh-cyl-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
        <stop offset="60%" stopColor="#2563eb" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id="ieh-tower" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.34" />
        <stop offset="100%" stopColor="#0b2260" stopOpacity="0.16" />
      </linearGradient>
      <linearGradient id="ieh-streak" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
        <stop offset="30%" stopColor="#7dd3fc" stopOpacity="0.26" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ieh-hub-body" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#05070f" />
        <stop offset="28%" stopColor="#11172b" />
        <stop offset="72%" stopColor="#0c1120" />
        <stop offset="100%" stopColor="#04060d" />
      </linearGradient>
      <linearGradient id="ieh-disc-body" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#05070f" />
        <stop offset="45%" stopColor="#0d1428" />
        <stop offset="100%" stopColor="#05070f" />
      </linearGradient>
      <radialGradient id="ieh-underglow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ieh-hub-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c026d3" stopOpacity="0.42" />
        <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* ── Cylinder floor plane ───────────────────────────────────────
        Drawn before the structures: it is the surface they stand on, so it
        must sit behind them rather than slicing across their bases. */}
    <ellipse cx={cx} cy={baseY} rx={rx} ry={ry} fill="#0a1a3c" fillOpacity="0.55" />
    <ellipse cx={cx} cy={baseY} rx={rx} ry={ry} fill="none" stroke="#22d3ee" strokeOpacity="0.75" strokeWidth="1.6" />
    <ellipse
      cx={cx}
      cy={baseY + 3}
      rx={rx - 6}
      ry={ry - 3}
      fill="none"
      stroke="#38bdf8"
      strokeOpacity="0.3"
      strokeWidth="1"
    />
    <g stroke="#38bdf8" fill="none" strokeWidth="0.8" opacity="0.24">
      {FLOOR_RADIALS.map((p, i) => (
        <path key={i} d={`M${cx} ${baseY}L${p.x.toFixed(1)} ${p.y.toFixed(1)}`} />
      ))}
      {FLOOR_RINGS.map((r, i) => (
        <ellipse key={i} cx={cx} cy={baseY} rx={r.rx} ry={r.ry.toFixed(1)} />
      ))}
    </g>

    {/* ── Descending data streaks ──────────────────────────────────── */}
    <g stroke="url(#ieh-streak)" strokeWidth="1.1">
      {STREAK_XS.map((x) => (
        <path key={x} d={`M${x} ${topY - 8}L${x} ${baseY + 6}`} />
      ))}
    </g>

    {/* ── Plant structures ─────────────────────────────────────────── */}
    <g transform={`translate(${cx} ${baseY})`}>
      {units.map(({ st, h, orbit, theta }) => {
        const left = -st.w / 2;
        const half = st.w / 2;
        const base = 0;
        const top = -h;
        // --rx/--ry are this unit's orbit, pre-squashed to the floor ellipse;
        // the negative delay is its starting angle on the pad.
        const orbitStyle = {
          '--rx': `${orbit.toFixed(1)}px`,
          '--ry': `${(orbit * squash).toFixed(2)}px`,
          '--pd': `${(-(theta / 360) * 80).toFixed(2)}s`,
        } as React.CSSProperties;

        /* Horizontal drum: a lying cylinder on two short legs. */
        if (st.kind === 'drum') {
          const h = base - top;
          return (
            <g key={`${0}-d`}>
              <rect
                x={left}
                y={top}
                width={st.w}
                height={h}
                rx={h / 2}
                fill="url(#ieh-tower)"
                stroke="#60a5fa"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
              <ellipse
                cx={left + h / 2}
                cy={top + h / 2}
                rx={h / 2.6}
                ry={h / 2.2}
                fill="none"
                stroke="#7dd3fc"
                strokeOpacity="0.45"
                strokeWidth="0.9"
              />
              <g stroke="#7dd3fc" strokeOpacity="0.35" strokeWidth="0.9">
                <path d={`M${left + st.w * 0.28} ${base}L${left + st.w * 0.28} ${base + 6}`} />
                <path d={`M${left + st.w * 0.72} ${base}L${left + st.w * 0.72} ${base + 6}`} />
              </g>
            </g>
          );
        }

        /* Spherical storage tank on legs. */
        if (st.kind === 'sphere') {
          const r = st.w / 2;
          const cy = top + r;
          return (
            <g key={`${0}-s`}>
              <circle
                cx={0}
                cy={cy}
                r={r}
                fill="url(#ieh-tower)"
                stroke="#60a5fa"
                strokeOpacity="0.55"
                strokeWidth="1"
              />
              <ellipse
                cx={0}
                cy={cy}
                rx={r}
                ry={r * 0.34}
                fill="none"
                stroke="#7dd3fc"
                strokeOpacity="0.3"
                strokeWidth="0.8"
              />
              <g stroke="#7dd3fc" strokeOpacity="0.35" strokeWidth="0.9">
                <path d={`M${st.x - r * 0.6} ${cy + r * 0.8}L${st.x - r * 0.72} ${base + 5}`} />
                <path d={`M${st.x + r * 0.6} ${cy + r * 0.8}L${st.x + r * 0.72} ${base + 5}`} />
              </g>
            </g>
          );
        }

        /* Vertical units. A stack tapers toward its cap, which is what stops
           the skyline reading as a row of identical tubes. */
        const capW = st.kind === 'stack' ? st.w * 0.55 : st.w;
        const capRy = Math.max(1.4, capW / 5);
        const corner = st.kind === 'vessel' ? st.w / 3 : 1.2;
        const bandGap = Math.max(9, 18 * (rx / 245));
        const bands: number[] = [];
        for (let y = top + bandGap * 0.9; y < base - 8; y += bandGap) bands.push(y);
        const mast = Math.max(9, 24 * (rx / 245));
        const body =
          st.kind === 'stack'
            ? `M${st.x - capW / 2} ${top}L${st.x + capW / 2} ${top}L${left + st.w} ${base}L${left} ${base}Z`
            : null;

        return (
          <g key={theta} className="ieh-plant-unit" style={orbitStyle}>
            {st.skid && (
              <rect
                x={left - half * 0.42}
                y={base - 3}
                width={st.w * 1.42}
                height={6}
                rx={1.5}
                fill="#0f2a5e"
                fillOpacity="0.5"
                stroke="#38bdf8"
                strokeOpacity="0.35"
                strokeWidth="0.8"
              />
            )}
            {body ? (
              <path d={body} fill="url(#ieh-tower)" stroke="#60a5fa" strokeOpacity="0.5" strokeWidth="1" />
            ) : (
              <rect
                x={left}
                y={top}
                width={st.w}
                height={base - top}
                rx={corner}
                fill="url(#ieh-tower)"
                stroke="#60a5fa"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
            )}
            <ellipse
              cx={0}
              cy={top}
              rx={capW / 2}
              ry={capRy}
              fill="#122d6b"
              fillOpacity="0.5"
              stroke="#7dd3fc"
              strokeOpacity="0.55"
              strokeWidth="1"
            />
            <g stroke="#7dd3fc" strokeOpacity="0.42" strokeWidth="0.9">
              {bands.map((y) => (
                <path key={y} d={`M${left + 1.2} ${y}L${left + st.w - 1.2} ${y}`} />
              ))}
            </g>
            {st.mast && (
              <g stroke="#7dd3fc" strokeOpacity="0.6" strokeWidth="0.9" fill="none">
                <path d={`M${0} ${top - capRy}L${0} ${top - mast}`} />
                <circle cx={0} cy={top - mast - 3} r="2" fill="#7dd3fc" fillOpacity="0.65" stroke="none" />
              </g>
            )}
          </g>
        );
      })}
    </g>

    {/* ── Base pipe runs tying the units together ──────────────────── */}
    <g stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1" fill="none">
      <path d={`M${cx - rx * 0.82} ${baseY + ry * 0.36}L${cx + rx * 0.82} ${baseY + ry * 0.36}`} />
      <path d={`M${cx - rx * 0.69} ${baseY + ry * 0.61}L${cx + rx * 0.69} ${baseY + ry * 0.61}`} />
    </g>

    {/* ── Glass cylinder over the plant ────────────────────────────── */}
    <path
      d={`M${cx - rx} ${topY}L${cx - rx} ${baseY}A${rx} ${ry} 0 0 0 ${cx + rx} ${baseY}L${cx + rx} ${topY}Z`}
      fill="url(#ieh-cyl-body)"
    />
    <g fill="none" stroke="#38bdf8" strokeWidth="1.2">
      <path d={`M${cx - rx} ${topY}L${cx - rx} ${baseY}`} strokeOpacity="0.4" />
      <path d={`M${cx + rx} ${topY}L${cx + rx} ${baseY}`} strokeOpacity="0.4" />
      <ellipse cx={cx} cy={topY} rx={rx} ry={ry} strokeOpacity="0.45" />
    </g>

    {/* Leading edge of the base disc, redrawn over the structure feet so the
        vessel still reads as one enclosed volume. */}
    <path
      d={`M${cx - rx} ${baseY}A${rx} ${ry} 0 0 0 ${cx + rx} ${baseY}`}
      fill="none"
      stroke="#22d3ee"
      strokeOpacity="0.7"
      strokeWidth="1.6"
      className="ieh-core-rim"
    />

    {/* ── Downward spray to the connected systems ──────────────────── */}
    <ellipse
      cx={cx}
      cy={PLATFORM.emitter.y + PLATFORM.lower.ry * 0.62}
      rx={PLATFORM.lower.rx * 1.2}
      ry={PLATFORM.lower.ry * 1.05}
      fill="url(#ieh-underglow)"
    />
    <g stroke="#38bdf8" strokeOpacity="0.32" strokeWidth="1" strokeDasharray="1.5 5" strokeLinecap="round">
      {RAYS.map((r, i) => (
        <path key={i} d={`M${cx} ${PLATFORM.emitter.y - 4}L${r.x2.toFixed(1)} ${r.y2.toFixed(1)}`} />
      ))}
    </g>

    {/* ── Layered platform ─────────────────────────────────────────── */}
    {/* lower, larger disc */}
    <path
      d={`M${cx - PLATFORM.lower.rx} ${PLATFORM.lower.cy}L${cx - PLATFORM.lower.rx} ${
        PLATFORM.lower.cy + PLATFORM.lower.wall
      }A${PLATFORM.lower.rx} ${PLATFORM.lower.ry} 0 0 0 ${cx + PLATFORM.lower.rx} ${
        PLATFORM.lower.cy + PLATFORM.lower.wall
      }L${cx + PLATFORM.lower.rx} ${PLATFORM.lower.cy}Z`}
      fill="url(#ieh-disc-body)"
    />
    <ellipse
      cx={cx}
      cy={PLATFORM.lower.cy}
      rx={PLATFORM.lower.rx}
      ry={PLATFORM.lower.ry}
      fill="#080d1c"
      stroke="#1d4ed8"
      strokeOpacity="0.55"
      strokeWidth="1.2"
    />
    {/* bright leading rim on the lower disc's front edge */}
    <path
      d={`M${cx - PLATFORM.lower.rx} ${PLATFORM.lower.cy + PLATFORM.lower.wall}A${PLATFORM.lower.rx} ${
        PLATFORM.lower.ry
      } 0 0 0 ${cx + PLATFORM.lower.rx} ${PLATFORM.lower.cy + PLATFORM.lower.wall}`}
      fill="none"
      stroke="#3b82f6"
      strokeOpacity="0.9"
      strokeWidth="2.6"
    />
    <path
      d={`M${cx - PLATFORM.lower.rx} ${PLATFORM.lower.cy + PLATFORM.lower.wall}A${PLATFORM.lower.rx} ${
        PLATFORM.lower.ry
      } 0 0 0 ${cx + PLATFORM.lower.rx} ${PLATFORM.lower.cy + PLATFORM.lower.wall}`}
      fill="none"
      stroke="#60a5fa"
      strokeOpacity="0.28"
      strokeWidth="7"
    />

    <ellipse
      cx={cx}
      cy={PLATFORM.lower.cy + PLATFORM.lower.wall * 0.5}
      rx={PLATFORM.lower.rx * 1.16}
      ry={PLATFORM.lower.ry * 1.16}
      fill="none"
      stroke="#1e40af"
      strokeOpacity="0.4"
      strokeWidth="1"
      strokeDasharray="6 10"
    />

    {/* upper, smaller disc */}
    <path
      d={`M${cx - PLATFORM.upper.rx} ${PLATFORM.upper.cy}L${cx - PLATFORM.upper.rx} ${
        PLATFORM.upper.cy + PLATFORM.upper.wall
      }A${PLATFORM.upper.rx} ${PLATFORM.upper.ry} 0 0 0 ${cx + PLATFORM.upper.rx} ${
        PLATFORM.upper.cy + PLATFORM.upper.wall
      }L${cx + PLATFORM.upper.rx} ${PLATFORM.upper.cy}Z`}
      fill="url(#ieh-disc-body)"
    />
    <ellipse
      cx={cx}
      cy={PLATFORM.upper.cy}
      rx={PLATFORM.upper.rx}
      ry={PLATFORM.upper.ry}
      fill="#0a1020"
      stroke="#2563eb"
      strokeOpacity="0.5"
      strokeWidth="1.1"
    />
    {/* magenta ring on the upper disc's face, encircling the hub — after the
        disc, or the disc's fill hides it entirely */}
    <ellipse
      cx={cx}
      cy={PLATFORM.ring.cy}
      rx={PLATFORM.ring.rx}
      ry={PLATFORM.ring.ry}
      fill="none"
      stroke="#c026d3"
      strokeOpacity="0.85"
      strokeWidth="2"
      className="ieh-core-ring"
    />
    <ellipse
      cx={cx}
      cy={PLATFORM.ring.cy}
      rx={PLATFORM.ring.rx}
      ry={PLATFORM.ring.ry}
      fill="none"
      stroke="#e879f9"
      strokeOpacity="0.22"
      strokeWidth="6"
      className="ieh-core-ring-halo"
    />

    {/* ── Core hub ─────────────────────────────────────────────────── */}
    <ellipse
      cx={cx}
      cy={HUB.topY}
      rx={HUB.rx + 34}
      ry={HUB.ry + 12}
      fill="url(#ieh-hub-halo)"
      className="ieh-hub-halo"
    />
    <path
      d={`M${cx - HUB.rx} ${HUB.topY}L${cx - HUB.rx} ${HUB.baseY}A${HUB.rx} ${HUB.ry} 0 0 0 ${cx + HUB.rx} ${
        HUB.baseY
      }L${cx + HUB.rx} ${HUB.topY}Z`}
      fill="url(#ieh-hub-body)"
      stroke="#1e293b"
      strokeWidth="1"
    />
    <ellipse
      cx={cx}
      cy={HUB.topY}
      rx={HUB.rx}
      ry={HUB.ry}
      fill="#0b1224"
      stroke="#38bdf8"
      strokeOpacity="0.55"
      strokeWidth="1.2"
    />
    <ellipse
      cx={cx}
      cy={HUB.topY}
      rx={HUB.rx * 0.84}
      ry={HUB.ry * 0.72}
      fill="none"
      stroke="#c026d3"
      strokeOpacity="0.6"
      strokeWidth="1.3"
      className="ieh-hub-ring"
    />
    {/* Cyan crown just inside the magenta ring — the reference reads warmer at
        the hub's centre and cooler at its lip. */}
    <ellipse
      cx={cx}
      cy={HUB.topY}
      rx={HUB.rx * 0.52}
      ry={HUB.ry * 0.44}
      fill="none"
      stroke="#67e8f9"
      strokeOpacity="0.4"
      strokeWidth="0.9"
    />
      <HubMark x={cx} y={HUB.topY + HUB.rx * 0.55} scale={(1.18 * HUB.rx) / 83} />
    </svg>
  );
};

export default HeroCentralSystem;
