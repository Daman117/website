/**
 * The capability nodes of the knowledge graph.
 *
 * Separate from HeroKnowledgeLayer purely for paint order: the spokes are
 * drawn there, and these sit on top so every link terminates *under* its
 * node rather than crossing the icon.
 *
 * Each node carries its own colour and the glyph inherits it through
 * `currentColor` — one value per node, no per-icon plumbing.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 * Only the outer halo breathes, never the ring or the glyph, so the node's
 * edge stays crisp and the hierarchy is untouched. Periods are co-prime-ish
 * and delays are staggered, so the ten never breathe in unison.
 */
import React from 'react';
import { nodeId } from './engramHeroData';
import type { EngramLayout } from './engramLayouts';
import type { HeroInteraction } from './engramHeroData';
import { CapIcon } from './HeroIcons';

const HeroNodes: React.FC<HeroInteraction & { L: EngramLayout }> = ({
  L,
  active,
  onActivate,
  onDeactivate,
}) => (
  <svg
    className="egh-layer egh-layer-nodes"
    viewBox={`0 0 ${L.stage.w} ${L.stage.h}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    {L.nodes.map((n, i) => (
      <g
        key={n.id}
        className={`egh-cap-node${active === nodeId(n.id) ? ' is-active' : ''}`}
        transform={`translate(${n.x} ${n.y})`}
        onPointerEnter={(e) => {
          if (e.pointerType !== 'touch') onActivate(nodeId(n.id));
        }}
        onPointerLeave={onDeactivate}
      >
        <circle
          className="egh-node-breath"
          style={
            {
              '--d': `${(i * -1.9).toFixed(1)}s`,
              '--dur': `${(8.5 + (i % 4) * 1.3).toFixed(1)}s`,
            } as React.CSSProperties
          }
          r={n.r + 9}
          fill={n.color}
          fillOpacity="0.07"
        />
        <circle
          className="egh-cap-ring"
          r={n.r}
          fill="#070c1e"
          fillOpacity="0.96"
          stroke={n.color}
          strokeOpacity="0.9"
          strokeWidth="1.5"
        />
        <g style={{ color: n.color }} transform={`scale(${(n.r / 39) * 1.15})`}>
          <CapIcon glyph={n.id} />
        </g>
      </g>
    ))}
  </svg>
);

export default HeroNodes;
