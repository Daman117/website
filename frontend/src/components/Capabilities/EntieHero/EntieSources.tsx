/**
 * The enTIE source column — what enTIE connects to, on the left of the core.
 *
 * Four tiles: engineering documents, structured data, process information,
 * and the plant itself. Line-art icons only, no text, no cards — the same
 * thin technical language as the core beside them.
 *
 * ── Why this is its own SVG ─────────────────────────────────────────────
 * It is a LAYER: same viewBox as EntieCore, stacked on the same box by CSS,
 * so the two stay in perfect register without either knowing about the
 * other. That is how the enVIEW and enGRAM heroes compose their layers, and
 * it is what lets the core be built, reviewed and animated on its own.
 *
 * The tiles sit on NODE_ROWS — the core's own attachment rows — so the
 * connectors added next are short level runs rather than diagonals.
 *
 * ── Structure, for the animation step ───────────────────────────────────
 * Nothing is flattened. Each tile is a group with its own id, its own type
 * class and `data-source`, holding three independently targetable children:
 *
 *   .entie-source-outline   the tile
 *   .entie-source-icon      the glyph
 *   .entie-source-node      the connection point on its right edge
 *
 * No animation, no state.
 */
import React from 'react';
import { CANVAS, NODE_ROWS, SOURCE_HALF, SOURCE_LINK_X, SOURCE_X } from './entieHeroData';
import type { SourceKey } from './entieHeroData';

/**
 * The four sources, in the order they stack. Icons are 24×24 stroked
 * outlines placed by their centre — kept as plain `d` strings rather than
 * components because they carry no behaviour, and one array is easier to
 * re-order than four one-line components.
 */
const SOURCES: ReadonlyArray<{ type: SourceKey; label: string; d: string }> = [
  {
    type: 'document',
    label: 'engineering documents',
    d: 'M7 3h7l4 4v14H7z M14 3v4h4 M9.5 12h5 M9.5 15.5h5',
  },
  {
    type: 'data',
    label: 'structured data',
    d: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  },
  {
    // A dial, not a machine: at 24px a conveyor collapses into a smudge,
    // and a gauge is the one process glyph that survives being this small.
    type: 'process',
    label: 'process information',
    d: 'M4.5 17a7.5 7.5 0 1 1 15 0 M5.5 17h13 M12 12.8l4.4-4 M12 17a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8',
  },
  {
    type: 'facility',
    label: 'plant and facility',
    d: 'M4 20.5V7h8v13.5 M12 20.5V11h8v9.5 M6.8 10.5h2.4 M6.8 14.5h2.4 M15.2 14.5h2.4 M15.2 17.8h2.4',
  },
];

const EntieSources: React.FC = () => (
  <svg
    className="entie-visual entie-layer-sources"
    viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
    preserveAspectRatio="xMidYMid meet"
    role="presentation"
    focusable="false"
  >
    <g className="entie-sources">
      {SOURCES.map((s, i) => {
        const y = NODE_ROWS[i];
        return (
          <g
            key={s.type}
            id={`eth-source-${s.type}`}
            className={`entie-source entie-source-${s.type}`}
            data-animation="source"
            data-source={s.type}
            data-index={i}
          >
            <rect
              className="entie-source-outline"
              x={SOURCE_X - SOURCE_HALF}
              y={y - SOURCE_HALF}
              width={SOURCE_HALF * 2}
              height={SOURCE_HALF * 2}
              rx="13"
            />
            <path
              className="entie-source-icon"
              d={s.d}
              transform={`translate(${SOURCE_X - 12} ${y - 12})`}
            />
            {/* Where the connector will attach. Drawn now so the next step
                only has to join two known points. */}
            <circle
              className="entie-source-node"
              data-animation="node"
              data-index={i}
              cx={SOURCE_LINK_X}
              cy={y}
              r="4"
            />
          </g>
        );
      })}
    </g>
  </svg>
);

export default EntieSources;
