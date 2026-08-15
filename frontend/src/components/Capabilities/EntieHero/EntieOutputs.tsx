/**
 * The enTIE output column — what comes back out, on the right of the core.
 *
 * Four tiles: visual output, structured data, connected systems, and
 * intelligence. Line-art icons only, no text, no cards, and a tile smaller
 * than the core beside it — the core stays the strongest thing in the frame.
 *
 * ── Why this is its own SVG ─────────────────────────────────────────────
 * It is a LAYER, exactly like EntieSources: same viewBox as EntieCore,
 * stacked on the same box by CSS, so all three stay in register without any
 * of them knowing about the others. Neither the core nor the sources were
 * touched to add this.
 *
 * The tiles are a mirror of the source column about the canvas centre — same
 * NODE_ROWS, same tile, same clearance. That symmetry is what makes the
 * composition read as one flow through a middle rather than as two unrelated
 * groups, and it keeps the connectors added next symmetrical too.
 *
 * ── Structure, for the animation step ───────────────────────────────────
 * Nothing is flattened. Each tile is a group with its own id, type class and
 * `data-output`, holding three independently targetable children:
 *
 *   .entie-output-outline   the tile
 *   .entie-output-icon      the glyph
 *   .entie-output-node      the connection point on its LEFT edge
 *
 * No animation, no state.
 */
import React from 'react';
import { CANVAS, NODE_ROWS, OUTPUT_HALF, OUTPUT_LINK_X, OUTPUT_X } from './entieHeroData';
import type { OutputKey } from './entieHeroData';

/**
 * The four outputs, in the order they stack. Icons are 24×24 stroked
 * outlines placed by their centre, same as the source column's.
 */
const OUTPUTS: ReadonlyArray<{ type: OutputKey; label: string; d: string }> = [
  {
    type: 'visual',
    label: 'engineering and visual output',
    d: 'M3 4.5h18v11.5H3z M9 20.5h6 M12 16v4.5 M6.5 12.5l3.5-3.5 3 2.5 4.5-4.5',
  },
  {
    type: 'data',
    label: 'structured data output',
    d: 'M3.5 4h17v16h-17z M3.5 9.5h17 M3.5 15h17 M9.5 9.5v10.5',
  },
  {
    // Centre node with three satellites. A four-satellite version is the
    // more literal graph, but at tile size the extra spokes close up.
    type: 'network',
    label: 'connected system output',
    d: 'M12 9.9a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2 M12 9.9V6.8 M13.8 13.2l3.2 2.3 M10.2 13.2l-3.2 2.3 M10.2 5a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0 M15.6 17.2a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0 M4.8 17.2a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0',
  },
  {
    // A processor, not a brain: brain outlines turn to mush at this size,
    // and a chip is the standard compute-and-intelligence glyph in technical
    // interfaces. Same call as the gauge in the source column.
    type: 'intelligence',
    label: 'intelligence output',
    d: 'M6 6h12v12H6z M9 9h6v6H9z M9.5 6V3.5 M14.5 6V3.5 M9.5 20.5V18 M14.5 20.5V18 M6 9.5H3.5 M6 14.5H3.5 M20.5 9.5H18 M20.5 14.5H18',
  },
];

const EntieOutputs: React.FC = () => (
  <svg
    className="entie-visual entie-layer-outputs"
    viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
    preserveAspectRatio="xMidYMid meet"
    role="presentation"
    focusable="false"
  >
    <g className="entie-outputs">
      {OUTPUTS.map((o, i) => {
        const y = NODE_ROWS[i];
        return (
          <g
            key={o.type}
            id={`eth-output-${o.type}`}
            className={`entie-output entie-output-${o.type}`}
            data-animation="output"
            data-output={o.type}
            data-index={i}
          >
            <rect
              className="entie-output-outline"
              x={OUTPUT_X - OUTPUT_HALF}
              y={y - OUTPUT_HALF}
              width={OUTPUT_HALF * 2}
              height={OUTPUT_HALF * 2}
              rx="13"
            />
            <path
              className="entie-output-icon"
              d={o.d}
              transform={`translate(${OUTPUT_X - 12} ${y - 12})`}
            />
            {/* Where the connector will arrive. Drawn now so the next step
                only has to join two known points. */}
            <circle
              className="entie-output-node"
              data-animation="node"
              data-index={i}
              cx={OUTPUT_LINK_X}
              cy={y}
              r="4"
            />
          </g>
        );
      })}
    </g>
  </svg>
);

export default EntieOutputs;
