/**
 * Every line in the composition, and nothing decorative.
 *
 * Three relationships, each drawn with its own line language so the diagram
 * is readable rather than merely busy:
 *
 *   sources  → core   descending S-curves landing on the cylinder's near rim
 *   core     → product an elbow: diagonal out of the core, then a level run
 *                      into the card, in that product's own accent colour
 *   core     → system  dotted radials falling from under the platform
 *
 * ── Animation ───────────────────────────────────────────────────────────
 * Two distinct motions, each meaning something different:
 *
 *   · the line PULSES  — "this link is active right now" (CSS, windowed to
 *     the element's slot in the shared loop)
 *   · a NODE TRAVELS   — "data is moving along it" (SMIL animateMotion on
 *     seven selected paths only, not all eighteen)
 *
 * Entrance draws the solid source/product paths with `stroke-dashoffset`
 * over a normalised `pathLength="1"`, so no path length is measured in JS
 * and one `dasharray: 1` covers every path whatever its real length.
 *
 * The dotted system lines deliberately do NOT use pathLength. Normalising
 * them would give every line the same dash *count* rather than the same dash
 * *size* — and these five differ hugely in length (the MES drop is ~40 units,
 * the DCS run ~225), so the short one would end up with micro-dots. They keep
 * real-unit dashes, enter with an opacity fade instead of a draw, and their
 * dots slide continuously: a standing integration, not a one-off transfer.
 */
import React, { useEffect, useRef } from 'react';
import { TIMING, accent, phaseOf } from './heroData';
import type { HeroLayout } from './heroData';

/** Which paths carry a travelling node. Deliberately sparse: the outer two
 *  sources, three products spanning the column, and two systems — enough to
 *  imply the whole flow without turning the hero into a particle field. */
const NODE_SOURCES = [0, 5];
const NODE_PRODUCTS = [0, 3, 5];
const NODE_SYSTEMS = [0, 3];

const TRAVEL = { source: 1.5, product: 1.9, system: 1.4 };

/**
 * A dot that walks one path once per loop cycle, then waits out the rest of
 * the cycle invisible at the far end.
 *
 * `keyPoints`/`keyTimes` over the full loop duration (rather than a short
 * `dur` with `repeatCount`) is what keeps SMIL locked to the same 20s clock
 * the CSS phases use — a short repeating `dur` would free-run and drift out
 * of step with the line pulse it is supposed to accompany.
 */
const FlowNode: React.FC<{ d: string; color: string; start: number; travel: number; r?: number }> = ({
  d,
  color,
  start,
  travel,
  r = 3,
}) => {
  const L = TIMING.loop;
  const t0 = (TIMING.enterEnd + start) / L;
  const t1 = t0 + travel / L;
  const fade = 0.22 / L;
  const f = (n: number) => n.toFixed(4);

  return (
    <circle r={r} fill={color} opacity="0">
      <animateMotion
        dur={`${L}s`}
        repeatCount="indefinite"
        calcMode="linear"
        path={d}
        keyPoints="0;0;1;1"
        keyTimes={`0;${f(t0)};${f(t1)};1`}
      />
      <animate
        attributeName="opacity"
        dur={`${L}s`}
        repeatCount="indefinite"
        calcMode="linear"
        values="0;0;1;1;0;0"
        keyTimes={`0;${f(t0)};${f(t0 + fade)};${f(t1 - fade)};${f(t1)};1`}
      />
    </circle>
  );
};

interface HeroConnectionsProps {
  /** False when the hero is scrolled out of view — SMIL keeps ticking
   *  otherwise, and `animation-play-state` (which pauses the CSS layers)
   *  has no effect on it. */
  active: boolean;
  layout: HeroLayout;
  /** Id of the hovered/focused card, so the matching link can be marked.
   *  Highlighting reuses these existing paths — no duplicate hover paths. */
  highlight: string | null;
  /** Reduced motion drops the travelling nodes entirely; the CSS pulses are
   *  already neutralised by the global rule in index.css. */
  reduceMotion: boolean;
}

const HeroConnections: React.FC<HeroConnectionsProps> = ({ active, layout, highlight, reduceMotion }) => {
  const hl = (id: string) => (highlight === id ? ' is-active' : '');
  const { paths, productCard, systemCard, sourceCard, orbits } = layout;
  const sourceExitY = (sy: number) => sy + sourceCard.h + (layout.variant === 'desktop' ? 6 : 5);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (active) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [active]);

  return (
    <svg
      ref={svgRef}
      className="ieh-layer ieh-layer-links"
      viewBox={`0 0 ${layout.stage.w} ${layout.stage.h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Inbound lines start crisp at the card and dissolve into the vessel */}
        <linearGradient id="ieh-link-down" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.85" />
          <stop offset="72%" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* ── Sources → core ───────────────────────────────────────────── */}
      <g fill="none" stroke="url(#ieh-link-down)" strokeWidth="1.3" strokeLinecap="round">
        {layout.sources.map((s, i) => (
          <path
            key={s.id}
            className={`ieh-link ieh-link-source${hl(s.id)}`}
            pathLength={1}
            d={paths.source(s)}
            style={{ '--phase': `${phaseOf.source(i)}s`, '--enter': `${1.5 + i * 0.08}s` } as React.CSSProperties}
          />
        ))}
      </g>
      <g fill="#38bdf8">
        {layout.sources.map((s, i) => (
          <circle
            key={s.id}
            className={`ieh-link-node${hl(s.id)}`}
            cx={s.cx}
            cy={sourceExitY(s.y)}
            r="3.2"
            style={{ '--phase': `${phaseOf.source(i)}s`, '--enter': `${1.9 + i * 0.08}s` } as React.CSSProperties}
          />
        ))}
      </g>

      {/* ── Core → products ──────────────────────────────────────────── */}
      {/* strokeOpacity here is the RESTING value and must stay in sync with
          the 0%/100% stops of iehLinkPulseProduct. Without it the reduced-
          motion path (animation finished, fill:none) falls back to opacity 1
          and these lines render brighter than the approved static design. */}
      <g
        fill="none"
        strokeOpacity="0.72"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {layout.products.map((p, i) => (
          <path
            key={p.id}
            className={`ieh-link ieh-link-product${hl(p.id)}`}
            pathLength={1}
            d={paths.product(p, i)}
            stroke={accent(p)}
            style={{ '--phase': `${phaseOf.product(i)}s`, '--enter': `${2.3 + i * 0.09}s` } as React.CSSProperties}
          />
        ))}
      </g>
      {layout.products.map((p, i) => {
        const cy = p.anchorPt.y;
        const style = {
          '--phase': `${phaseOf.product(i)}s`,
          '--enter': `${2.8 + i * 0.09}s`,
        } as React.CSSProperties;
        return (
          <g key={p.id}>
            {/* origin node on the central system */}
            <circle
              className={`ieh-link-node${hl(p.id)}`}
              cx={p.anchorPt.x}
              cy={p.anchorPt.y}
              r="2.6"
              fill={accent(p)}
              fillOpacity="0.85"
              style={style}
            />
            {/* halo that expands once when this product's link activates */}
            <circle
              className="ieh-node-halo"
              cx={productCard.x}
              cy={cy}
              r="4.2"
              fill="none"
              stroke={accent(p)}
              strokeWidth="1.4"
              style={style}
            />
            {/* endpoint node on the card's left border */}
            <circle
              className={`ieh-link-node${hl(p.id)}`}
              cx={productCard.x}
              cy={cy}
              r="4.2"
              fill={accent(p)}
              style={style}
            />
          </g>
        );
      })}

      {/* ── Core → connected systems ─────────────────────────────────── */}
      <g
        fill="none"
        stroke="#38bdf8"
        strokeOpacity="0.62"
        strokeWidth="1.3"
        strokeDasharray="2.5 6"
        strokeLinecap="round"
      >
        {layout.systems.map((s, i) => (
          <path
            key={s.id}
            className={`ieh-link-system${hl(s.id)}`}
            d={paths.system(s, i)}
            style={{ '--phase': `${phaseOf.system(i)}s`, '--enter': `${2.95 + i * 0.07}s` } as React.CSSProperties}
          />
        ))}
      </g>
      <g fill="#22d3ee">
        {layout.systems.map((s, i) => (
          <circle
            key={s.id}
            className={`ieh-link-node${hl(s.id)}`}
            cx={s.cx}
            cy={systemCard.nodeY}
            r="3.2"
            style={{ '--phase': `${phaseOf.system(i)}s`, '--enter': `${3.3 + i * 0.07}s` } as React.CSSProperties}
          />
        ))}
      </g>

      {/* ── Travelling data nodes ────────────────────────────────────── */}
      {!reduceMotion && (
        <g className="ieh-flow-nodes">
          {NODE_SOURCES.map((i) => (
            <FlowNode
              key={`s${i}`}
              d={paths.source(layout.sources[i])}
              color="#7dd3fc"
              start={phaseOf.source(i)}
              travel={TRAVEL.source}
              r={2.8}
            />
          ))}
          {NODE_PRODUCTS.map((i) => (
            <FlowNode
              key={`p${i}`}
              d={paths.product(layout.products[i], i)}
              color={accent(layout.products[i])}
              start={phaseOf.product(i)}
              travel={TRAVEL.product}
            />
          ))}
          {NODE_SYSTEMS.map((i) => (
            <FlowNode
              key={`y${i}`}
              d={paths.system(layout.systems[i], i)}
              color="#22d3ee"
              start={phaseOf.system(i)}
              travel={TRAVEL.system}
              r={2.6}
            />
          ))}
          {/* Two slow orbiters on the platform ring — the only rotation in
              the piece, and it follows the ellipse rather than spinning it. */}
          <circle r="2.4" fill="#e879f9" opacity="0.75">
            <animateMotion
              dur="34s"
              repeatCount="indefinite"
              calcMode="linear"
              path={orbits[0]}
            />
          </circle>
          <circle r="1.9" fill="#c084fc" opacity="0.55">
            <animateMotion
              dur="46s"
              repeatCount="indefinite"
              calcMode="linear"
              path={orbits[1]}
            />
          </circle>
        </g>
      )}
    </svg>
  );
};

export default HeroConnections;
