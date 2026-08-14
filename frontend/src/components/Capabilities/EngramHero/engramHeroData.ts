/**
 * Geometry and presentation data for the enGRAM hero.
 *
 * ── The coordinate system ────────────────────────────────────────────────
 * Every element — SVG geometry and HTML alike — is authored against ONE
 * fixed design canvas of STAGE.w x STAGE.h "canvas pixels".
 *
 *   · The SVG layers use it directly as their `viewBox`.
 *   · HTML converts it with the `--u` custom property set in
 *     engram-hero.css, where `--u` is exactly one canvas pixel.
 *
 * That is what lets a ribbon land on a sheet's edge exactly, at every
 * viewport, with no DOM measurement and no ResizeObserver.
 *
 * ── The composition ─────────────────────────────────────────────────────
 *   parallel document planes → ribbons → stacked knowledge core → graph
 * Read left to right. The canvas is 1660x950 to match the reference's
 * aspect; the upper-left stays dark, which is where the copy sits.
 */

export const STAGE = { w: 1660, h: 950 } as const;

/** Canvas px → CSS length, via the `--u` unit set on the stage. */
export const du = (n: number) => `calc(${n} * var(--u))`;

export const C = {
  amber: '#FDB022',
  amberSoft: '#fde68a',
  cyan: '#22d3ee',
  sky: '#38bdf8',
  blue: '#60a5fa',
  indigo: '#818cf8',
  violet: '#a78bfa',
  magenta: '#d946ef',
  green: '#34d399',
  rose: '#f472b6',
  white: '#e2e8f0',
} as const;

/* ── Document planes ───────────────────────────────────────────────────
   Flat sheets hanging in space, all sheared by the same angle so they read
   as PARALLEL planes rather than a fanned-out card deck. The front sheet is
   the large P&ID — the most recognisable engineering artefact — and the
   others sit behind it at falling opacity.

   SHEAR is shared: a single skewY on every panel is what makes them look
   like one stack seen from one viewpoint. Vary it per sheet and the illusion
   collapses. */
export const PANEL_SHEAR = -6; // degrees

export type PanelKind = 'pid' | 'table' | 'chart' | 'report' | 'index';

export interface HeroPanel {
  id: PanelKind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** back sheets sit further into the dark */
  depth: number;
  accent: string;
  /** Drift amplitude, in canvas px. Parallax: the front sheet travels
   *  furthest, the rear ones barely at all, which is what reads as depth
   *  rather than as five things wobbling. */
  float: number;
  /** Negative delay, so no two sheets crest together. */
  phase: number;
  /** Which slot of the master cycle this sheet is read in. */
  slot: number;
}

/** Back to front — paint order is the array order.
 *
 *  A monotone fan: every step forward moves down and RIGHT by a fixed amount,
 *  so the sheets behind peek out along the top-left edge of the front one and
 *  the front sheet is the one nearest the core it feeds.
 *
 *  The span is bounded on both sides: the front sheet's right edge (1088)
 *  clears the nearest capability node (`instrument`, left edge 1137), and the
 *  back sheet only tucks a little behind the copy column (~542 canvas px),
 *  where it is the dimmest and most occluded sheet anyway.
 *
 *  Ribbons follow automatically — they are built from PID's own right edge,
 *  not from a literal. */
export const heroPanels: HeroPanel[] = [
  { id: 'index',  x: 463, y: 132, w: 286, h: 208, depth: 0.6,  accent: C.blue,   float: 2.6, phase: -1.2, slot: 0 },
  { id: 'report', x: 511, y: 176, w: 288, h: 228, depth: 0.72, accent: C.sky,    float: 3.4, phase: -4.7, slot: 1 },
  { id: 'chart',  x: 559, y: 218, w: 240, h: 258, depth: 0.66, accent: C.indigo, float: 3.0, phase: -8.1, slot: 2 },
  { id: 'table',  x: 607, y: 258, w: 250, h: 276, depth: 0.82, accent: C.cyan,   float: 4.6, phase: -2.9, slot: 3 },
  { id: 'pid',    x: 655, y: 296, w: 388, h: 366, depth: 1,    accent: C.sky,    float: 6.4, phase: -6.3, slot: 4 },
];

/** The front sheet, whose right edge the ribbons leave from. */
export const PID = heroPanels[heroPanels.length - 1];

/* ── The knowledge core ────────────────────────────────────────────────
   A stack of discs, not a smooth cylinder: the reference reads as records
   accumulating in layers, which is exactly enGRAM's story. A light column
   rises from the top disc, and concentric ripples spread on the floor. */
export const CORE = {
  cx: 1298,
  rx: 104,
  ry: 26,
  /** top face of the top disc */
  topY: 548,
  /** number of stacked discs, and the gap between them */
  discs: 6,
  step: 27,
} as const;

/** y of the top face of disc i (0 = top). */
export const discY = (i: number) => CORE.topY + i * CORE.step;
/** floor plane the ripples sit on */
export const CORE_FLOOR = discY(CORE.discs - 1) + 34;

/** Ground ripples, widening outward from the core. */
export const RIPPLES = [1.34, 1.86, 2.42, 3.02, 3.66].map((f, i) => ({
  rx: CORE.rx * f,
  ry: CORE.ry * f * 1.16,
  o: 0.55 - i * 0.09,
}));

/* ── The knowledge graph ───────────────────────────────────────────────
   A brain hub with capability nodes scattered around it — deliberately not
   on a single ring, which would read as a clock face. Positions are authored
   to match the reference's spread across the upper right. */
export const HUB = { cx: 1396, cy: 306, r: 56 } as const;

export type CapGlyph =
  | 'draw'
  | 'valve'
  | 'monitor'
  | 'trend'
  | 'graph'
  | 'document'
  | 'link'
  | 'instrument'
  | 'vessel';

export interface HeroCapNode {
  id: CapGlyph;
  label: string;
  x: number;
  y: number;
  r: number;
  color: string;
}

export const heroCapNodes: HeroCapNode[] = [
  /* The graph node sits where a second brain used to. The hub already wears
     the brain mark, so two of them read as a duplicate rather than as two
     ideas. */
  { id: 'graph',      label: 'Knowledge Graph',       x: 1352, y: 116, r: 39, color: C.rose },
  { id: 'draw',       label: 'Drawing Intelligence',  x: 1552, y: 158, r: 39, color: C.blue },
  { id: 'valve',      label: 'Instrument Data',       x: 1574, y: 282, r: 39, color: C.cyan },
  { id: 'monitor',    label: 'Operator Views',        x: 1570, y: 392, r: 39, color: C.green },
  { id: 'trend',      label: 'Reports & Trends',      x: 1522, y: 488, r: 39, color: C.amber },
  { id: 'document',   label: 'Cited Answers',         x: 1252, y: 460, r: 35, color: C.white },
  { id: 'link',       label: 'Tag Linking',           x: 1180, y: 390, r: 35, color: C.violet },
  { id: 'instrument', label: 'Loop Context',          x: 1172, y: 292, r: 35, color: C.violet },
  { id: 'vessel',     label: 'Equipment Records',     x: 1222, y: 186, r: 35, color: C.violet },
];

/** Hub → node, plus a few node-to-node chords so it reads as a mesh. */
export const CAP_CHORDS: [CapGlyph, CapGlyph][] = [
  ['vessel', 'graph'],
  ['graph', 'draw'],
  ['draw', 'valve'],
  ['valve', 'monitor'],
  ['monitor', 'trend'],
  ['instrument', 'vessel'],
  ['link', 'instrument'],
  ['document', 'link'],
];

export const nodeById = (id: CapGlyph) => heroCapNodes.find((n) => n.id === id)!;

/** A link that stops short of both circles, so it terminates at the rim
 *  rather than crossing the icon. */
export function linkPath(
  a: { x: number; y: number; r: number },
  b: { x: number; y: number; r: number }
): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const p0 = { x: a.x + ux * (a.r + 4), y: a.y + uy * (a.r + 4) };
  const p1 = { x: b.x - ux * (b.r + 4), y: b.y - uy * (b.r + 4) };
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}L${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}

/** Junction dots scattered along the graph's links, as in the reference. */
export const junctions = heroCapNodes.flatMap((n, i) => {
  const t = 0.42 + ((i * 7) % 5) * 0.07;
  return [
    {
      x: HUB.cx + (n.x - HUB.cx) * t,
      y: HUB.cy + (n.y - HUB.cy) * t,
      r: 2.4 + ((i * 3) % 3) * 0.5,
      color: n.color,
    },
  ];
});

/* ── Ribbons ───────────────────────────────────────────────────────────
   The bundle carrying extracted knowledge from the front sheet into the
   core. They leave the P&ID's right edge at staggered heights and converge
   on the top disc, so the bundle narrows as it arrives. */
export const RIBBONS = Array.from({ length: 7 }, (_, i) => {
  const t = i / 6;
  const fromY = PID.y + 96 + t * 214;
  // Land ON the top face, tightly converged on its centre — not hovering
  // above it. A wide spread reads as lines passing near the core rather than
  // entering it.
  const toY = CORE.topY - 2 + (t - 0.5) * 5;
  return {
    from: { x: PID.x + PID.w - 8, y: fromY },
    to: { x: CORE.cx + (t - 0.5) * 26, y: toY },
    // Alternating tints give the bundle its cyan→violet spread.
    color: [C.cyan, C.sky, C.blue, C.indigo, C.violet, C.sky, C.cyan][i],
    w: 1.6 + (i % 3) * 0.7,
  };
});

export function ribbonPath(r: (typeof RIBBONS)[number]): string {
  const midX = (r.from.x + r.to.x) / 2;
  return `M${r.from.x.toFixed(1)} ${r.from.y.toFixed(1)}C${(midX + 42).toFixed(1)} ${r.from.y.toFixed(
    1
  )} ${(midX - 26).toFixed(1)} ${r.to.y.toFixed(1)} ${r.to.x.toFixed(1)} ${r.to.y.toFixed(1)}`;
}

/* ── Terrain ───────────────────────────────────────────────────────────
   One plane under the whole composition: a rolling violet wave on the left
   that flattens into a fine cyan grid beneath the core, which is how the
   reference ties the two halves together. */
export interface TerrainSpec {
  rows: number;
  cols: number;
  topY: number;
  botY: number;
  /** near/far x extents, and where the swell damps out */
  x0: number;
  x0v: number;
  x1: number;
  x1v: number;
  dampFrom: number;
  dampSpan: number;
  amp: number;
}

/** How far the surface is drawn OUTSIDE the canvas on each side. The terrain
 *  layer is `overflow: visible`, so this is what fills the section gutters
 *  and the strip below the stage — the layer itself stays exactly on the
 *  stage box, which is what keeps it in register with the core. */
export const TERRAIN_BLEED = 900;

/* The near/far extents both start OUTSIDE the canvas. They used to open at
   300..1180 on the horizon row and fan outward, which left a triangular gap
   on each side between the horizon and the rows wide enough to reach the
   edge — the surface only cleared the canvas about halfway down. The fan is
   still ~1.6x from horizon to front, so the perspective is unchanged. */
export const TERRAIN: TerrainSpec = {
  rows: 26, cols: 170, topY: 556, botY: 1180,
  x0: -400, x0v: 540, x1: 1900, x1v: 900,
  dampFrom: 180, dampSpan: 1020, amp: 74,
};

/** Built as a factory so the compact plane reuses the identical maths with
 *  its own extents, rather than a second hand-tuned formula. */
export const makeTerrainPoint = (T: TerrainSpec) => (u: number, v: number) => {
  const rowY = T.topY + Math.pow(v, 1.5) * (T.botY - T.topY);
  const x0 = T.x0 - v * T.x0v;
  const x1 = T.x1 + v * T.x1v;
  const x = x0 + u * (x1 - x0);
  // Amplitude dies away to the right, so the surface flattens under the core.
  const damp = Math.max(0, 1 - Math.pow(Math.max(0, (x - T.dampFrom) / T.dampSpan), 2.1));
  const amp = (10 + v * T.amp) * damp;
  const h = Math.sin(u * 5.6 + v * 2.9) * amp + Math.sin(u * 11.4 + 1.3) * amp * 0.34;
  return { x, y: rowY - h, h: amp > 0.5 ? h / (amp * 1.38) : 0, damp };
};

export const terrainPoint = makeTerrainPoint(TERRAIN);

/* ══ ANIMATION ═══════════════════════════════════════════════════════════
   CSS keyframes for the core's breath, SMIL animateMotion for anything that
   has to follow a path. No library: the brief is "travel along this curve,
   forever", which is exactly what animateMotion does, and the landing hero
   already proves the pattern in this codebase.

   Two rules carried over from that hero:

   1. Every looping CSS keyframe's 0% AND 100% is the element's resting
      style. That makes the loop seamless and — because index.css's global
      prefers-reduced-motion rule collapses animations to 0.001ms and one
      iteration — it lands a reduced-motion user on the approved static
      composition with no second stylesheet.

   2. SMIL is NOT covered by that rule, and not by animation-play-state
      either. So the SMIL layers are skipped entirely under reduced motion
      and paused directly when the hero scrolls out of view. */
export const TIMING = {
  /** One pass of a document stream, sheet to core. Slow enough to read. */
  ribbon: 5.6,
  /** How long one dot spends crossing a single spoke. */
  netTravel: 2.4,
  /** A pass across the terrain — the slowest thing in the hero. */
  terrain: 26,
} as const;

/* ── Orchestration ─────────────────────────────────────────────────────
   One master clock ties every layer into a single sequence:

     document scan → stream surge → core response → network propagation
     → quiet → next document

   MASTER is divided into SLOTS, one per document. Each participating element
   runs an animation whose duration is MASTER (or exactly one SLOT) and whose
   keyframe is windowed to its step in the chain; `animation-delay` places it
   in the right slot. Sharing one duration is what keeps the chain in phase
   forever with no scheduler — the same technique the landing hero uses.

   Deliberately NOT perfectly synchronised: per-element offsets inside a slot
   mean the ribbons and nodes fan out slightly rather than firing as a block,
   which is the difference between a system thinking and a progress bar. */
/** One full outward journey for a database ripple. */
export const RIPPLE_PERIOD = 11;
/** One slot of the document carousel — how long a card holds the front. */
export const CARD_STEP = 5;

/** When the entrance has finished building the composition. The carousel is
 *  held until then: sheets rotating while the graph is still arriving reads as
 *  two unrelated things happening at once rather than one system starting up.
 *  Must stay at or past the last entrance delay in engram-hero.css. */
export const ENTRANCE_END = 6.4;
/** How long a sheet takes to move between slots. Must match the duration of
 *  `eghStep` in engram-hero.css: the streams are hidden for exactly this long
 *  after each step, so a ribbon never hangs off a sheet still in transit. */
export const CARD_MOVE = 1.5;

export const MASTER = 30;
export const SLOTS = 5;
export const SLOT = MASTER / SLOTS; // 6s per document

/** Start of document k's slot, in seconds. */
export const slotAt = (k: number) => k * SLOT;

/** Dots per ribbon. Deliberately small: the point is a legible current,
 *  not a particle field. */
export const RIBBON_DOTS = 3;

/* ── Terrain flow field ────────────────────────────────────────────────
   Nine lanes crossing the full width of the hero, plus three that peel off
   and climb toward the core.

   Three things stop it reading as drifting wallpaper:

     · ALTERNATING DIRECTION. Odd lanes run right-to-left. animateMotion
       follows path direction, so a reverse lane is the same curve with its
       points reversed — one generator, not two.
     · DEPTH DRIFT. Lanes shift in v as they cross, so they cut diagonally
       across the plane instead of stacking up as parallel rails.
     · CONVERGENCE. Three lanes leave the surface and bend up to the core's
       floor, which is what physically connects the infrastructure layer to
       the thing standing on it.

   Every lane rides the real terrain surface (the same terrainPoint the mesh
   is built from), so the flow follows the visible landscape rather than
   floating over it. Lanes start outside both edges; a gradient mask handles
   the fade, which costs one element instead of an opacity tween per dot. */
const TERRAIN_STREAMS = 9;
const TERRAIN_CONVERGE = 3;

const toPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

export function terrainStreamPath(k: number): string {
  const v0 = 0.18 + (k / (TERRAIN_STREAMS - 1)) * 0.7;
  const back = k % 2 === 1;
  const drift = (((k * 5) % 3) - 1) * 0.11;
  const pts = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const u = -0.16 + t * 1.32;
    const v = Math.min(0.98, Math.max(0.04, v0 + drift * t));
    pts.push(terrainPoint(u, v));
  }
  if (back) pts.reverse();
  return toPath(pts);
}

/** A lane that runs along the surface, then climbs to the core's floor. */
export function terrainConvergePath(k: number): string {
  const v0 = 0.74 - k * 0.15;
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    pts.push(terrainPoint(-0.14 + t * 0.78, v0));
  }
  const last = pts[pts.length - 1];
  const tx = CORE.cx - 74 + k * 50;
  const ty = CORE_FLOOR + 8 - k * 9;
  // A three-point tail, so the turn toward the core is a curve rather than
  // a corner.
  pts.push({ x: last.x + (tx - last.x) * 0.4, y: last.y + (ty - last.y) * 0.16 });
  pts.push({ x: last.x + (tx - last.x) * 0.76, y: last.y + (ty - last.y) * 0.58 });
  pts.push({ x: tx, y: ty });
  return toPath(pts);
}

/** Per-lane speed and phase. Varying both is what keeps the field from ever
 *  being simultaneously empty, and from pulsing as one block. */
export const terrainLanes = Array.from({ length: TERRAIN_STREAMS }, (_, k) => ({
  d: terrainStreamPath(k),
  dur: TIMING.terrain * (0.78 + ((k * 3) % 5) * 0.14),
  phase: -k * 2.6,
  // Violet over the swell on the left, cooling to cyan toward the core.
  tint: k % 3 === 2 ? '#67e8f9' : '#c084fc',
  r: 0.9 + ((k * 2) % 3) * 0.4,
}));

export const convergeLanes = Array.from({ length: TERRAIN_CONVERGE }, (_, k) => ({
  d: terrainConvergePath(k),
  dur: TIMING.terrain * (0.62 + k * 0.1),
  phase: -k * 4.4,
  tint: '#bae6fd',
  r: 1.5 + (k % 2) * 0.4,
}));

/* ── Interaction ───────────────────────────────────────────────────────
   One `active` id lives on the hero root and is threaded down. Ids are
   namespaced because a document and a capability node could otherwise
   collide on a shared name.

   State changes ONLY on pointerenter / pointerleave, never during animation,
   so nothing here can disturb the CSS or SMIL clocks.

   None of these elements navigate anywhere, so none are made focusable: that
   would add a dozen dead stops to the tab order. Their highlight only
   emphasises relationships the resting composition already draws, so no
   information is hover-only and nothing is withheld from keyboard or touch
   users. */
export const CORE_ACTIVE = 'core';
export const docId = (id: string) => `doc:${id}`;
export const nodeId = (id: string) => `node:${id}`;

/** Which sheet a ribbon belongs to — they share a slot in the master cycle,
 *  so hovering a sheet can brighten exactly its own streams. */
export const ribbonDocId = (i: number): string => {
  const panel = heroPanels.find((p) => p.slot === i % SLOTS);
  return panel ? docId(panel.id) : '';
};

export interface HeroInteraction {
  active: string | null;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
}
