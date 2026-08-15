/**
 * Geometry for the enTIE hero composition.
 *
 * Separated from EntieCore for the same reason as engramHeroData and
 * enviewHeroData: the input and output columns land on this grid next, and
 * they need the core's edges and rows without importing a component (which
 * also costs fast refresh — a module that exports both a component and
 * constants cannot be hot-swapped).
 *
 * The composition is authored on ONE canvas. Every number below is in canvas
 * units, and the core sits at its centre so the empty thirds either side are
 * where the columns go.
 */

/** The design canvas every layer shares as its viewBox. */
export const CANVAS = { w: 700, h: 700 } as const;

/** The container's box. `chamfer` is the corner cut that makes it read as
 *  machined rather than as a rounded rectangle. */
export const CORE = {
  cx: 350,
  cy: 350,
  halfW: 62,
  halfH: 245,
  chamfer: 26,
} as const;

/** The container's edges, derived once so nothing re-does the arithmetic. */
export const CORE_EDGE = {
  left: CORE.cx - CORE.halfW,
  right: CORE.cx + CORE.halfW,
  top: CORE.cy - CORE.halfH,
  bottom: CORE.cy + CORE.halfH,
} as const;

/** Where a connector may attach: four rows a side, flanking the shield. */
export const NODE_ROWS = [180, 300, 420, 540] as const;

/* ── The source column ──────────────────────────────────────────────────
   Four tiles on the core's own rows, so a connector between them is a short
   run rather than a diagonal. Far enough left to leave a clear gap for those
   connectors, far enough right to stay inside the reserved visual box and
   well clear of the copy. */

/** Centre line of the source tiles. */
export const SOURCE_X = 96;
/** Half the tile — tiles are square. */
export const SOURCE_HALF = 30;
/** Where a connector will leave a source: just off the tile's right edge.
 *  Exported because the connector step has to start exactly here. */
export const SOURCE_LINK_X = SOURCE_X + SOURCE_HALF + 12;

/* ── The output column ──────────────────────────────────────────────────
   A mirror of the source column about the canvas centre: same rows, same
   tile, same clearance. Symmetry is what makes the composition read as one
   flow through a middle rather than as two unrelated groups. */

export const OUTPUT_X = CANVAS.w - SOURCE_X;
export const OUTPUT_HALF = SOURCE_HALF;
/** Where a connector will arrive: just off the tile's left edge. */
export const OUTPUT_LINK_X = OUTPUT_X - OUTPUT_HALF - 12;

/* ── Flow keys ──────────────────────────────────────────────────────────
   The identity of each lane, shared by the tile that owns it and the
   connector that serves it. Declared here rather than in either component so
   a rename cannot leave a connector's data-flow pointing at a tile that no
   longer exists — the two arrays are typed against these. */

export const SOURCE_KEYS = ['document', 'data', 'process', 'facility'] as const;
export const OUTPUT_KEYS = ['visual', 'data', 'network', 'intelligence'] as const;

export type SourceKey = (typeof SOURCE_KEYS)[number];
export type OutputKey = (typeof OUTPUT_KEYS)[number];

/* ── Connectors ─────────────────────────────────────────────────────────
   Both ends of every lane sit on the same row, so a straight line would be
   the literal answer and the wrong one: the brief asks for routed curves,
   and a perfectly horizontal path also has a zero-height bounding box, which
   makes any objectBoundingBox gradient on it refuse to paint.

   The answer to both is a shallow S: control points displaced in opposite
   directions, ends still level. It reads as deliberate routing rather than
   as a wire pulled taut, and every lane uses the same bow so the four read
   as one organised bus. */

/** Vertical displacement of the control points. Small on purpose. */
const BOW = 9;

/** Source tile → the core's left edge. */
export const sourceConnector = (y: number) =>
  `M${SOURCE_LINK_X} ${y} C ${SOURCE_LINK_X + 50} ${y - BOW}, ${CORE.cx - CORE.halfW - 50} ${y + BOW}, ${CORE.cx - CORE.halfW} ${y}`;

/** The core's right edge → output tile. */
export const outputConnector = (y: number) =>
  `M${CORE.cx + CORE.halfW} ${y} C ${CORE.cx + CORE.halfW + 50} ${y - BOW}, ${OUTPUT_LINK_X - 50} ${y + BOW}, ${OUTPUT_LINK_X} ${y}`;

/** A chamfered rectangle centred on the core — corners cut, not rounded. */
export const chamferedBox = (halfW: number, halfH: number, cut: number) => {
  const l = CORE.cx - halfW;
  const r = CORE.cx + halfW;
  const t = CORE.cy - halfH;
  const b = CORE.cy + halfH;
  return [
    [l + cut, t], [r - cut, t], [r, t + cut], [r, b - cut],
    [r - cut, b], [l + cut, b], [l, b - cut], [l, t + cut],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(' ');
};

/** The vertical lines inside the container. Uneven lengths and weights, so
 *  the interior reads as active rather than as ruling. */
export const SIGNALS = [
  { x: 322, y1: 150, y2: 548 },
  { x: 336, y1: 186, y2: 512 },
  { x: 364, y1: 168, y2: 530 },
  { x: 378, y1: 214, y2: 486 },
] as const;

/** Points sitting on those lines. Static here; they are what the animation
 *  step will run down the signals. */
export const SPARKS = [
  { x: 322, y: 246 },
  { x: 336, y: 402 },
  { x: 350, y: 190 },
  { x: 364, y: 468 },
  { x: 378, y: 322 },
] as const;
