/**
 * The knowledge core: a stack of discs with a light column and ground
 * ripples.
 *
 * Stacked discs rather than a smooth cylinder — the reference reads as
 * records accumulating in layers, which is exactly the enGRAM story. The
 * brightest elements are the top face and the beam rising from it, so the
 * eye lands on where knowledge arrives.
 *
 * Painted bottom disc first, so each layer overlaps the one beneath it.
 *
 * Motion here is CSS only, so it is covered by the global
 * prefers-reduced-motion rule and by the off-screen pause with no extra
 * wiring. Every keyframe's 0% and 100% is the resting style, so nothing
 * flashes and it settles exactly on the approved static state.
 *
 * Two things run at once: a slow ambient breath, and a RESPONSE that fires
 * once per master slot as data arrives. They are deliberately put on
 * different properties — breath on `opacity`, response on `stroke-opacity`
 * and the floor glow — because two animations on the same property would
 * simply fight, with the later declaration winning.
 */
import React from 'react';
import { CORE_ACTIVE, RIPPLE_PERIOD } from './engramHeroData';
import type { EngramLayout } from './engramLayouts';
import type { HeroInteraction } from './engramHeroData';

const HeroKnowledgeCore: React.FC<HeroInteraction & { L: EngramLayout }> = ({
  L,
  active,
  onActivate,
  onDeactivate,
}) => {
  const CORE = L.core;
  const { cx, rx, ry, discs } = CORE;
  const CORE_FLOOR = L.coreFloor;
  const RIPPLES = L.ripples;
  const discY = L.discY;

  return (
  <svg
    className={`egh-layer egh-layer-core${active === CORE_ACTIVE ? ' is-active' : ''}`}
    viewBox={`0 0 ${L.stage.w} ${L.stage.h}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="egh-disc-wall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f3f5f8" />
        <stop offset="30%" stopColor="#f5f7fc" />
        <stop offset="72%" stopColor="#f6f8fc" />
        <stop offset="100%" stopColor="#f3f5f8" />
      </linearGradient>
      <radialGradient id="egh-topface" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0d3793" stopOpacity="0.5" />
        <stop offset="45%" stopColor="#077e9b" stopOpacity="0.24" />
        <stop offset="100%" stopColor="#2a66eb" stopOpacity="0.1" />
      </radialGradient>
      {/* The column: bright at the disc, dissolving upward */}
      {/* Runs along the link's own bounding box: bright where it leaves the
          core, thinning across the gap, brightening again as it reaches the
          brain — so both ends read as connected rather than fading out. */}
      <linearGradient id="egh-beam" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#0d3793" stopOpacity="0.5" />
        <stop offset="42%" stopColor="#134ecf" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#2156c9" stopOpacity="0.4" />
      </linearGradient>
      <radialGradient id="egh-beam-base" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0d3793" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#077e9b" stopOpacity="0" />
      </radialGradient>
    </defs>

    <g className="egh-in-platform">
    {/* ── Floor ripples ─────────────────────────────────────────────── */}
    {/* Energy leaving the database. Every ring is DRAWN at the innermost
        radius and scaled outward, which is what lets one ring travel through
        the next one's position instead of each pulsing in place. Staggered
        by a full step, so a ring always occupies every position and the wrap
        happens at opacity 0 — no visible reset.

        `--rest` restores the authored concentric radii for reduced motion,
        where the animation is collapsed and the rings would otherwise all
        sit on top of each other. */}
    <g fill="none">
      {RIPPLES.map((r, i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={CORE_FLOOR}
          className="egh-ripple"
          style={
            {
              '--o': RIPPLES[0].o,
              '--k': (RIPPLES[RIPPLES.length - 1].rx / RIPPLES[0].rx) * 1.2,
              '--rest': r.rx / RIPPLES[0].rx,
              '--d': `${(-i * (RIPPLE_PERIOD / RIPPLES.length)).toFixed(2)}s`,
            } as React.CSSProperties
          }
          rx={RIPPLES[0].rx.toFixed(1)}
          ry={RIPPLES[0].ry.toFixed(1)}
          stroke={i % 2 ? '#1249c1' : '#077e9b'}
          strokeOpacity={RIPPLES[0].o}
          strokeWidth={1.6}
        />
      ))}
    </g>

    {/* ── Disc stack, bottom first ──────────────────────────────────── */}
    {Array.from({ length: discs }, (_, k) => discs - 1 - k).map((i) => {
      const y = discY(i);
      const wall = CORE.step;
      return (
        <g key={i}>
          <path
            d={`M${cx - rx} ${y}L${cx - rx} ${y + wall}A${rx} ${ry} 0 0 0 ${cx + rx} ${y + wall}L${cx + rx} ${y}Z`}
            fill="url(#egh-disc-wall)"
          />
          {/* leading edge — the lit rim of each layer */}
          <path
            d={`M${cx - rx} ${y + wall}A${rx} ${ry} 0 0 0 ${cx + rx} ${y + wall}`}
            fill="none"
            className="egh-disc-rim"
            stroke="#077e9b"
            strokeOpacity={0.3 + (discs - i) * 0.07}
            strokeWidth="1.4"
          />
          <ellipse
            cx={cx}
            cy={y}
            rx={rx}
            ry={ry}
            fill="#f6f8fc"
            stroke="#134ecf"
            strokeOpacity="0.42"
            strokeWidth="1"
          />
        </g>
      );
    })}

    </g>

    <g className="egh-in-light">
    {/* ── Lit top face ──────────────────────────────────────────────── */}
    <ellipse
      className="egh-core-face"
      cx={cx}
      cy={CORE.topY}
      rx={rx}
      ry={ry}
      fill="url(#egh-topface)"
      stroke="#066f89"
      strokeOpacity="0.7"
      strokeWidth="1.4"
    />
    <g fill="none" stroke="#0f3ea5" strokeOpacity="0.22" strokeWidth="0.6">
      {[0.72, 0.5, 0.28].map((f) => (
        <ellipse key={f} cx={cx} cy={CORE.topY} rx={rx * f} ry={ry * f} />
      ))}
    </g>

    {/* ── The link to the brain ─────────────────────────────────────
        Previously a tapered column that stopped in mid-air above the disc.
        It is now a real connector built from BOTH endpoints (see
        linkCoreToHub), so it always terminates on the hub — and it works
        whether the brain sits above the core, as on desktop, or below it in
        the compact column. Two strokes: a soft halo and a bright core, the
        same two elements the old beam used. */}
    <ellipse className="egh-beam-base" cx={cx} cy={CORE.topY} rx="34" ry="9" fill="url(#egh-beam-base)" />
    <path
      className="egh-beam"
      d={L.coreToHub}
      fill="none"
      stroke="url(#egh-beam)"
      strokeWidth="9"
      strokeLinecap="round"
    />
    <path
      className="egh-core-spine"
      d={L.coreToHub}
      fill="none"
      stroke="#0d3793"
      strokeOpacity="0.5"
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    </g>

    {/* Transparent hit area over the stack. Not a visual object — the SVG
        layers are pointer-events:none, so the core needs an explicit
        target of its own. */}
    <rect
      className="egh-core-hit"
      x={cx - rx - 10}
      y={CORE.topY - ry - 8}
      width={rx * 2 + 20}
      height={CORE_FLOOR - CORE.topY + ry + 20}
      fill="transparent"
      onPointerEnter={(e) => {
        if (e.pointerType !== 'touch') onActivate(CORE_ACTIVE);
      }}
      onPointerLeave={onDeactivate}
    />
  </svg>
  );
};

export default HeroKnowledgeCore;
