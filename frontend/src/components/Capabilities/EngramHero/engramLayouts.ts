/**
 * The two coordinate systems the enGRAM hero renders in.
 *
 * ── Why two, not one scaled ─────────────────────────────────────────────
 * The desktop canvas is 1660x950 and very wide. Rendering it at phone width
 * puts `--u` near 0.2 — a 14px label at 3px. So narrow viewports get a
 * genuinely different canvas (380x720, a vertical column) with its own
 * placements and its own connection topology, while the approved desktop
 * composition stays untouched.
 *
 * ── Why the compact one is also simpler ─────────────────────────────────
 * It carries three sheets rather than five, six capability nodes rather than
 * ten, and roughly half the flow dots. That is the density reduction small
 * screens need, expressed as layout rather than as a pile of media queries.
 * The conceptual chain is preserved exactly:
 *
 *     engineering records → knowledge core → connected knowledge
 *
 * read top to bottom instead of left to right.
 *
 * Everything a renderer needs is on the layout object, including the path
 * builders — so viewBox, geometry and connectors can never disagree,
 * whichever variant is mounted.
 */
import {
  C,
  CAP_CHORDS,
  CORE,
  CORE_FLOOR,
  HUB,
  MASTER,
  RIBBONS,
  RIBBON_DOTS,
  RIPPLES,
  SLOTS,
  STAGE,
  TERRAIN,
  TIMING,
  convergeLanes,
  heroCapNodes,
  heroPanels,
  junctions,
  makeTerrainPoint,
  ribbonPath,
  terrainLanes,
} from './engramHeroData';
import type { CapGlyph, HeroCapNode, HeroPanel, TerrainSpec } from './engramHeroData';

export interface FlowLane {
  d: string;
  dur: number;
  phase: number;
  tint: string;
  r: number;
}

export interface EngramLayout {
  variant: 'desktop' | 'compact';
  stage: { w: number; h: number };
  panels: HeroPanel[];
  ribbons: typeof RIBBONS;
  ribbonPath: (r: (typeof RIBBONS)[number]) => string;
  ribbonDots: number;
  core: { cx: number; rx: number; ry: number; topY: number; discs: number; step: number };
  discY: (i: number) => number;
  coreFloor: number;
  ripples: { rx: number; ry: number; o: number }[];
  hub: { cx: number; cy: number; r: number };
  nodes: HeroCapNode[];
  chords: [CapGlyph, CapGlyph][];
  junctions: typeof junctions;
  terrain: TerrainSpec;
  terrainPoint: ReturnType<typeof makeTerrainPoint>;
  lanes: FlowLane[];
  convergeLanes: FlowLane[];
  terrainDots: number;
  convergeDots: number;
  /** The link from the core's top face to the brain node. Built from both
   *  endpoints, so it always terminates ON the hub rather than stopping in
   *  mid-air — and it works whether the hub sits above the core (desktop) or
   *  below it (compact). */
  coreToHub: string;
}

/** A gentle S from the core's top face to the hub's rim. */
function linkCoreToHub(
  core: { cx: number; topY: number },
  hub: { cx: number; cy: number; r: number }
): string {
  const up = hub.cy < core.topY;
  const endY = up ? hub.cy + hub.r + 4 : hub.cy - hub.r - 4;
  const span = Math.abs(endY - core.topY);
  const c1 = { x: core.cx, y: core.topY + (up ? -span * 0.55 : span * 0.55) };
  const c2 = { x: hub.cx - (hub.cx - core.cx) * 0.25, y: endY + (up ? span * 0.34 : -span * 0.34) };
  return `M${core.cx} ${core.topY}C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(
    1
  )} ${c2.y.toFixed(1)} ${hub.cx} ${endY.toFixed(1)}`;
}

/* ── Desktop — exactly the approved composition ─────────────────────── */
export const desktopLayout: EngramLayout = {
  variant: 'desktop',
  stage: STAGE,
  panels: heroPanels,
  ribbons: RIBBONS,
  ribbonPath,
  ribbonDots: RIBBON_DOTS,
  core: CORE,
  discY: (i) => CORE.topY + i * CORE.step,
  coreFloor: CORE_FLOOR,
  ripples: RIPPLES,
  hub: HUB,
  nodes: heroCapNodes,
  chords: CAP_CHORDS,
  junctions,
  terrain: TERRAIN,
  terrainPoint: makeTerrainPoint(TERRAIN),
  lanes: terrainLanes,
  convergeLanes,
  terrainDots: 6,
  convergeDots: 3,
  coreToHub: linkCoreToHub(CORE, HUB),
};

/* ── Compact — a vertical column for tablet and phone ───────────────── */

const CW = 380;
const CX = 190;

const C_PANELS: HeroPanel[] = [
  { id: 'index',  x: 96,  y: 4,  w: 210, h: 116, depth: 0.5,  accent: C.blue,   float: 2.2, phase: -1.2, slot: 0 },
  { id: 'table',  x: 72,  y: 40, w: 224, h: 128, depth: 0.72, accent: C.cyan,   float: 3.0, phase: -5.4, slot: 1 },
  { id: 'pid',    x: 46,  y: 84, w: 268, h: 156, depth: 1,    accent: C.sky,    float: 4.2, phase: -9.1, slot: 2 },
];

const C_CORE = { cx: CX, rx: 66, ry: 17, topY: 300, discs: 5, step: 18 } as const;
const C_DISC_Y = (i: number) => C_CORE.topY + i * C_CORE.step;
const C_FLOOR = C_DISC_Y(C_CORE.discs - 1) + 22;

const C_RIPPLES = [1.34, 1.9, 2.5, 3.1].map((f, i) => ({
  rx: C_CORE.rx * f,
  ry: C_CORE.ry * f * 1.16,
  o: 0.55 - i * 0.1,
}));

/* Ribbons drop vertically from the front sheet into the core's top face —
   the same ingestion, rotated to suit a column. */
const C_RIBBONS = Array.from({ length: 5 }, (_, i) => {
  const t = i / 4;
  const fromX = 92 + t * 196;
  // Converged on the top face's centre, same as desktop.
  const toX = CX + (t - 0.5) * 20;
  return {
    from: { x: fromX, y: 244 },
    to: { x: toX, y: C_CORE.topY - 2 },
    color: [C.cyan, C.sky, C.blue, C.indigo, C.violet][i],
    w: 1.3 + (i % 3) * 0.5,
  };
});

const C_RIBBON_PATH = (r: (typeof C_RIBBONS)[number]) => {
  const midY = (r.from.y + r.to.y) / 2;
  return `M${r.from.x.toFixed(1)} ${r.from.y.toFixed(1)}C${r.from.x.toFixed(1)} ${midY.toFixed(
    1
  )} ${r.to.x.toFixed(1)} ${midY.toFixed(1)} ${r.to.x.toFixed(1)} ${r.to.y.toFixed(1)}`;
};

/* Six nodes on a ring beneath the core, so the chain still reads
   records → core → connected knowledge, top to bottom. */
const C_HUB = { cx: CX, cy: 520, r: 38 } as const;
const C_NODE_IDS: CapGlyph[] = ['graph', 'draw', 'valve', 'monitor', 'document', 'link'];
const C_NODES: HeroCapNode[] = C_NODE_IDS.map((id, i) => {
  const src = heroCapNodes.find((n) => n.id === id)!;
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { ...src, x: C_HUB.cx + 104 * Math.cos(a), y: C_HUB.cy + 104 * Math.sin(a), r: 25 };
});

const C_CHORDS: [CapGlyph, CapGlyph][] = [
  ['graph', 'draw'],
  ['draw', 'valve'],
  ['valve', 'monitor'],
  ['monitor', 'document'],
  ['document', 'link'],
  ['link', 'graph'],
];

const C_JUNCTIONS = C_NODES.map((n, i) => {
  const t = 0.46 + ((i * 7) % 4) * 0.06;
  return {
    x: C_HUB.cx + (n.x - C_HUB.cx) * t,
    y: C_HUB.cy + (n.y - C_HUB.cy) * t,
    r: 2 + ((i * 3) % 2) * 0.5,
    color: n.color,
  };
});

/* Extents open outside the 380px canvas for the same reason as desktop: a
   surface that only reaches the edge halfway down leaves a gap beside it. */
const C_TERRAIN: TerrainSpec = {
  rows: 14, cols: 58, topY: 596, botY: 900,
  x0: -120, x0v: 200, x1: 500, x1v: 220,
  dampFrom: 40, dampSpan: 300, amp: 26,
};
const C_TERRAIN_POINT = makeTerrainPoint(C_TERRAIN);

const c_toPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

/* Half the lanes, still alternating direction so the field reads as a flow
   rather than a conveyor. */
const C_LANES: FlowLane[] = Array.from({ length: 5 }, (_, k) => {
  const v0 = 0.2 + (k / 4) * 0.66;
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    pts.push(C_TERRAIN_POINT(-0.16 + t * 1.32, v0));
  }
  if (k % 2 === 1) pts.reverse();
  return {
    d: c_toPath(pts),
    dur: TIMING.terrain * (0.8 + (k % 3) * 0.16),
    phase: -k * 3.1,
    tint: k % 3 === 2 ? '#066f89' : '#2156cb',
    r: 0.85 + (k % 2) * 0.3,
  };
});

export const compactLayout: EngramLayout = {
  variant: 'compact',
  stage: { w: CW, h: 720 },
  panels: C_PANELS,
  ribbons: C_RIBBONS as unknown as typeof RIBBONS,
  ribbonPath: C_RIBBON_PATH as unknown as (r: (typeof RIBBONS)[number]) => string,
  ribbonDots: 2,
  core: C_CORE,
  discY: C_DISC_Y,
  coreFloor: C_FLOOR,
  ripples: C_RIPPLES,
  hub: C_HUB,
  nodes: C_NODES,
  chords: C_CHORDS,
  junctions: C_JUNCTIONS,
  terrain: C_TERRAIN,
  terrainPoint: C_TERRAIN_POINT,
  lanes: C_LANES,
  // No converging lanes on compact: at this scale they crowd the core more
  // than they explain it.
  convergeLanes: [],
  terrainDots: 4,
  convergeDots: 0,
  coreToHub: linkCoreToHub(C_CORE, C_HUB),
};

/** Slots still map onto whatever panels the variant has. */
export const layoutSlots = (L: EngramLayout) => Math.max(1, Math.min(SLOTS, L.panels.length));
export const layoutMaster = MASTER;
