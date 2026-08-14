/**
 * The four stage marks, and the small glyphs inside the panels.
 *
 * Drawn here rather than pulled from lucide because each stage mark is a
 * COMPOUND idea — a document that contains a tree, a monitor that contains a
 * trend — and the icon set has one shape per concept, not two. The same
 * reason EngramHero draws its own.
 *
 * Every mark is on a 48x48 box, `fill="none"`, and strokes with
 * `currentColor`. That is what lets the stage colour be set once on the
 * column (`--c`) and inherited all the way down: nothing here names a colour.
 *
 * The panel glyphs ARE lucide where lucide has the right shape, because
 * re-drawing a play triangle or a check circle would be pure duplication.
 *
 * Exports are DISPATCHING components rather than lookup maps — `<StageIcon
 * id>` instead of `STAGE_ICON[id]` — matching EngramHero/HeroIcons. A mixed
 * file of components and constants breaks React Fast Refresh, and the lint
 * rule that enforces it is right: a map export would cost a full reload on
 * every edit to this file. */
import React from 'react';
import type { SourceKind, StageId } from './enableHeroData';

const S: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

/** INGEST — a document with a structure tree inside it: records arriving
 *  already organised, which is the promise of the stage. */
const Ingest = () => (
  <S>
    <path d="M13 6h14l8 8v28a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    <path d="M27 6v8h8" strokeOpacity="0.6" />
    <rect x="15.5" y="21" width="7" height="5" rx="1" />
    <rect x="26" y="28.5" width="7" height="5" rx="1" />
    <rect x="26" y="36" width="7" height="5" rx="1" />
    <path d="M19 26v9.5h7M19 31h7" strokeOpacity="0.75" />
  </S>
);

/** ANALYZE — a small network. Nodes and edges, because what the stage
 *  produces is relationships, not a single answer. */
const Analyze = () => (
  <S>
    <path
      d="M14 15 24 11M14 15l10 9M14 15 12 27M24 11l10 4M24 24l10-9M24 24 12 27M24 24l10 13M34 15l-2 12M12 27l12 10M32 27l2 10M24 37l8 0M12 27l2 10M20 37h4"
      strokeOpacity="0.5"
      strokeWidth="1.2"
    />
    {[
      [14, 15],
      [24, 11],
      [34, 15],
      [24, 24],
      [12, 27],
      [32, 27],
      [14, 37],
      [24, 37],
      [34, 37],
    ].map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" />
    ))}
  </S>
);

/** INSIGHT — a monitor with a rising trend. The verdict, on a screen. */
const Insight = () => (
  <S>
    <rect x="7" y="10" width="34" height="24" rx="2.5" />
    <path d="M20 40h8M24 34v6" strokeOpacity="0.7" />
    <path d="M13 27.5l6-6.5 5 4.5 9-9.5" />
    <path d="M28 16h5.5v5.5" />
  </S>
);

/** ACTION — a target. A decision being aimed, not merely taken. */
const Action = () => (
  <S>
    <circle cx="24" cy="24" r="15" />
    <circle cx="24" cy="24" r="7.5" strokeOpacity="0.8" />
    <circle cx="24" cy="24" r="1.8" fill="currentColor" stroke="none" />
    <path d="M24 4v6M24 38v6M4 24h6M38 24h6" strokeOpacity="0.85" />
  </S>
);

export const StageIcon: React.FC<{ id: StageId }> = ({ id }) => {
  switch (id) {
    case 'ingest':
      return <Ingest />;
    case 'analyze':
      return <Analyze />;
    case 'insight':
      return <Insight />;
    default:
      return <Action />;
  }
};

/* ── Source glyphs ────────────────────────────────────────────────────
   Four documents that read as four DIFFERENT documents at 26px: a drawing
   with a vessel on it, a grid, ruled text, a trend. Distinct silhouettes
   matter more than detail at this size. */

const Doc: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    viewBox="0 0 28 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 1.5h14l6 6v23a1.5 1.5 0 0 1-1.5 1.5h-18A1.5 1.5 0 0 1 3 30.5V3a1.5 1.5 0 0 1 1-1.5Z" />
    <path d="M18 1.5V8h6" strokeOpacity="0.55" />
    {children}
  </svg>
);

const SOURCE: Record<SourceKind, React.FC> = {
  'P&ID': () => (
    <Doc>
      <rect x="7" y="15" width="6" height="9" rx="3" strokeOpacity="0.85" />
      <path d="M13 19.5h4M20 16v7" strokeOpacity="0.7" />
      <path d="M17 17l3 2.5-3 2.5Z" strokeOpacity="0.85" />
      <path d="M7 27h13" strokeOpacity="0.4" />
    </Doc>
  ),
  Datasheets: () => (
    <Doc>
      <rect x="7" y="14" width="14" height="13" rx="1" strokeOpacity="0.85" />
      <path d="M7 18.3h14M7 22.7h14M11.7 14v13M16.3 14v13" strokeOpacity="0.5" />
    </Doc>
  ),
  Specs: () => (
    <Doc>
      <path d="M7 15h11M7 19h14M7 23h14M7 27h8" strokeOpacity="0.75" />
    </Doc>
  ),
  'Hist Data': () => (
    <Doc>
      <path d="M7 26l4-5 3.5 3L21 15" />
      <path d="M17 15h4v4" strokeOpacity="0.7" />
    </Doc>
  ),
};

export const SourceIcon: React.FC<{ kind: SourceKind }> = ({ kind }) => {
  const Glyph = SOURCE[kind];
  return <Glyph />;
};

/** DIGITAL MODEL — a P&ID reduced to what still reads at panel size: two
 *  vessels, three control valves, a pump and the routed lines between them.
 *  Deliberately schematic; it should say "process drawing" at a glance, not
 *  survive being read. */
export const ModelSchematic: React.FC = () => (
  <svg
    className="eab-model-svg"
    viewBox="0 0 240 132"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.1"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {/* vessels */}
    <rect x="20" y="18" width="26" height="52" rx="13" />
    <path d="M20 30h26M20 58h26" strokeOpacity="0.4" />
    <rect x="150" y="52" width="30" height="46" rx="15" />
    <path d="M150 66h30" strokeOpacity="0.4" />

    {/* pump */}
    <circle cx="88" cy="88" r="13" />
    <path d="M88 75v26M75 88h26" strokeOpacity="0.45" />

    {/* control valves — the bowtie every P&ID uses */}
    {[
      [72, 30],
      [128, 30],
      [128, 88],
    ].map(([x, y]) => (
      <g key={`${x}-${y}`}>
        <path d={`M${x - 8} ${y - 6}L${x} ${y}L${x - 8} ${y + 6}Z`} />
        <path d={`M${x + 8} ${y - 6}L${x} ${y}L${x + 8} ${y + 6}Z`} />
        <path d={`M${x} ${y}v-8`} strokeOpacity="0.6" />
        <path d={`M${x - 5} ${y - 12}h10`} strokeOpacity="0.6" />
      </g>
    ))}

    {/* routed process lines */}
    <path d="M46 30h18M80 30h40M136 30h29v22" strokeOpacity="0.85" />
    <path d="M46 58h16v30h13M101 88h19M136 88h14" strokeOpacity="0.85" />
    <path d="M215 75h-35" strokeOpacity="0.6" />
    <path d="M215 30v45" strokeOpacity="0.6" />
    <path d="M188 30h27" strokeOpacity="0.6" />

    {/* instrument bubbles */}
    {[
      [72, 12],
      [128, 12],
      [188, 30],
    ].map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" strokeOpacity="0.7" />
    ))}
  </svg>
);
