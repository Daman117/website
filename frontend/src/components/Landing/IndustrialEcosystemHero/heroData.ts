/**
 * Hero-specific presentation data for the industrial ecosystem hero.
 *
 * ── The coordinate system ────────────────────────────────────────────────
 * Every element in this hero — SVG geometry and HTML cards alike — is
 * authored against ONE fixed design canvas: STAGE.w x STAGE.h "design
 * pixels", taken straight off the reference composition.
 *
 *   · The SVG layers use it directly as their `viewBox`.
 *   · The HTML cards convert it with the `--u` custom property set in
 *     industrial-hero.css, where `--u` is exactly one design pixel:
 *         --u: calc(100cqw / 1660)
 *     so `calc(232 * var(--u))` is 232 design px at any stage width.
 *
 * That means SVG and HTML share one geometry — connection paths land on
 * card edges exactly, at every viewport, with no measuring and no
 * ResizeObserver.
 *
 * ── Why the data lives here and not in data/v2.ts ────────────────────────
 * The ids below match the existing product route ids ('engram', 'enview', …)
 * so a card can become a <Link> later without a lookup table. The taglines
 * and accent colours are HERO PRESENTATION, not product truth — the shared
 * `archCaps` palette in data/v2.ts is tuned for light backgrounds and would
 * be unreadable here, so it is deliberately left alone rather than bent to
 * fit this one composition.
 */

/** The design canvas every coordinate in this file is expressed in. */
export const STAGE = { w: 1660, h: 880 } as const;

/**
 * Design-canvas px → CSS length. `--u` is one design pixel (see
 * industrial-hero.css), so `du(232)` is 232 canvas px at any stage width —
 * this is what keeps the HTML cards locked to the SVG geometry.
 */
export const du = (n: number) => `calc(${n} * var(--u))`;

/** Centre of the composition — plant, hub and platform all share it. */
export const CORE_X = 1005;

/* ── Central system geometry ─────────────────────────────────────────────
   Exported because HeroConnections anchors onto the same shapes that
   HeroCentralSystem draws; a single source stops the two drifting apart. */
export const CYLINDER = { cx: CORE_X, rx: 245, ry: 33, topY: 243, baseY: 447 } as const;
export const HUB = { cx: CORE_X, rx: 83, ry: 18, topY: 443, baseY: 537 } as const;
export const PLATFORM = {
  /* The two discs need a clear size gap. When their radii are close they
     merge into one black slab instead of reading as a layered platform. */
  upper: { cx: CORE_X, cy: 546, rx: 196, ry: 33, wall: 18 },
  lower: { cx: CORE_X, cy: 596, rx: 250, ry: 42, wall: 24 },
  /** Magenta ring encircling the hub, ON the upper disc's top face — so it
   *  must be drawn after that disc, not before, or the disc paints over it. */
  ring: { cx: CORE_X, cy: 546, rx: 148, ry: 25 },
  /** Where the downward fan to the external systems originates. */
  emitter: { x: CORE_X, y: 628 },
} as const;

/** y on the *near* edge of the cylinder's top rim for a given x. Source
 *  lines land on the real ellipse rather than a guessed horizontal, and on
 *  the near arc specifically so they read as descending into the opening
 *  rather than stopping short behind it. */
export function cylinderRimY(x: number): number {
  const t = (x - CYLINDER.cx) / CYLINDER.rx;
  return CYLINDER.topY + CYLINDER.ry * Math.sqrt(Math.max(0, 1 - t * t));
}

/** y where a structure of centre-x `x` meets the cylinder floor ellipse. */
export function floorY(x: number): number {
  const t = (x - CYLINDER.cx) / CYLINDER.rx;
  return CYLINDER.baseY + 27 * Math.sqrt(Math.max(0, 1 - t * t));
}

/* ── Source documents (top row) ──────────────────────────────────────── */

export type SourceGlyph =
  | 'pid'
  | 'datasheet'
  | 'procedure'
  | 'model3d'
  | 'report'
  | 'scada';

export interface HeroSource {
  id: string;
  label: string;
  glyph: SourceGlyph;
  /** Card centre-x on the design canvas. */
  cx: number;
  /** x where this source's line enters the cylinder rim. */
  entryX: number;
}

export const SOURCE_CARD = { w: 74, h: 72, y: 105, labelY: 74 } as const;

export const heroSources: HeroSource[] = [
  { id: 'pids',       label: 'P&IDs',      glyph: 'pid',       cx: 752,  entryX: 838 },
  { id: 'datasheets', label: 'Datasheets', glyph: 'datasheet', cx: 858,  entryX: 905 },
  { id: 'procedures', label: 'Procedures', glyph: 'procedure', cx: 964,  entryX: 972 },
  { id: 'models',     label: '3D Models',  glyph: 'model3d',   cx: 1071, entryX: 1038 },
  { id: 'reports',    label: 'Reports',    glyph: 'report',    cx: 1177, entryX: 1105 },
  { id: 'scada',      label: 'Live SCADA', glyph: 'scada',     cx: 1283, entryX: 1172 },
];

/* ── Products (right column) ─────────────────────────────────────────── */

export type ProductGlyph =
  | 'engram'
  | 'enstudio'
  | 'engenie'
  | 'enview'
  | 'enable'
  | 'entie';

export interface HeroProduct {
  /** Matches the /products/:id route id. */
  id: ProductGlyph;
  name: string;
  /** Two presentation lines, exactly as laid out in the reference. */
  lines: [string, string];
  /**
   * Accent as a space-separated RGB triplet, not a hex string: CSS needs
   * `rgb(var(--accent-rgb) / 0.42)` for the tinted borders and fills, and
   * SVG gets `rgb(...)` from the same value — one field, both consumers.
   */
  accentRgb: string;
  /** Card top-y on the design canvas. */
  y: number;
  /** Point on the central system this product's line leaves from. */
  anchor: { x: number; y: number };
  /**
   * Optional per-product elbow x. enGRAM needs a later bend than the rest:
   * with the shared elbow its diagonal clips the bottom-right corner of the
   * "Live SCADA" source card on its way up.
   */
  elbowX?: number;
}

export const PRODUCT_CARD = { x: 1394, w: 232, h: 100, elbowX: 1324 } as const;

export const heroProducts: HeroProduct[] = [
  {
    id: 'engram',
    name: 'enGRAM',
    lines: ['Plant Knowledge', 'from Engineering Records'],
    accentRgb: '226 77 196',
    y: 105,
    anchor: { x: 1243, y: 262 },
    elbowX: 1362,
  },
  {
    id: 'enstudio',
    name: 'enSTUDIO',
    lines: ['Drawing Intelligence', 'to Plant Configuration'],
    accentRgb: '124 140 248',
    y: 212,
    anchor: { x: 1246, y: 300 },
  },
  {
    id: 'engenie',
    name: 'enGENIE',
    lines: ['From Process Conditions', 'to Issue-Ready Spec'],
    accentRgb: '34 211 238',
    y: 320,
    anchor: { x: 1246, y: 372 },
  },
  {
    id: 'enview',
    name: 'enVIEW',
    lines: ['Modern SCADA', 'for Industrial Operations'],
    accentRgb: '127 209 59',
    y: 427,
    anchor: { x: 1088, y: 462 },
  },
  {
    id: 'enable',
    name: 'enABLE',
    lines: ['Process Engineering', 'Simulation & Analysis'],
    accentRgb: '245 180 23',
    y: 535,
    anchor: { x: 1196, y: 558 },
  },
  {
    id: 'entie',
    name: 'enTIE',
    lines: ['One Connected Layer', 'for Every System'],
    accentRgb: '240 65 122',
    y: 643,
    anchor: { x: 1150, y: 615 },
  },
];

/** `rgb()` string for a product accent, at an optional alpha. */
export const accent = (p: HeroProduct, a = 1) =>
  a === 1 ? `rgb(${p.accentRgb})` : `rgb(${p.accentRgb} / ${a})`;

/** Vertical centre of a product card — the height its connector runs into. */
export const productCardCy = (p: HeroProduct) => p.y + PRODUCT_CARD.h / 2;

/* ── Connected systems (bottom row) ──────────────────────────────────── */

export type SystemGlyph = 'dcs' | 'historian' | 'mes' | 'erp' | 'other';

export interface HeroSystem {
  id: SystemGlyph;
  label: string;
  cx: number;
}

export const SYSTEM_CARD = { w: 88, h: 103, y: 680, nodeY: 668 } as const;

export const heroSystems: HeroSystem[] = [
  { id: 'dcs',       label: 'DCS',           cx: 784 },
  { id: 'historian', label: 'Historian',     cx: 893 },
  { id: 'mes',       label: 'MES',           cx: 1003 },
  { id: 'erp',       label: 'ERP',           cx: 1112 },
  { id: 'other',     label: 'Other Systems', cx: 1222 },
];

/* ── Animation timing ─────────────────────────────────────────────────
   One shared clock for the whole hero.

   Every looping element runs the SAME `loop` duration and differs only by
   its `animation-delay`, so the sequence stays in phase forever with no
   JS scheduler, no rAF, and no React state. The keyframes are "windowed":
   each one holds its resting value across most of the cycle and only does
   something inside a short slice, exactly like the existing `iconFlash`
   keyframe in index.css.

   Two hard rules follow from that, and both matter:

   1. Every loop keyframe's 0% AND 100% must equal the element's resting
      style. That makes the cycle seamless (no hard reset) and — because
      index.css's global prefers-reduced-motion rule collapses animations
      to 0.001ms and one iteration — it also means a reduced-motion user
      lands on exactly the approved static composition.

   2. `enterEnd + <largest phase> + <travel>` must stay under `loop`, or a
      late node would wrap past the cycle boundary and desync from CSS.
      Currently 4.2 + 13.8 + 1.4 = 19.4s against a 20s loop. */
export const TIMING = {
  /** Full narrative period: sources → core → products → systems → rest. */
  loop: 20,
  /** Entrance is settled by here; the loop's first cycle starts. */
  enterEnd: 4.2,
  source: { start: 0, step: 0.5 },
  core: { start: 4.4 },
  product: { start: 6.4, step: 0.72 },
  system: { start: 11.4, step: 0.6 },
} as const;

/** Loop offset, in seconds, for the i-th member of each group. */
export const phaseOf = {
  source: (i: number) => TIMING.source.start + i * TIMING.source.step,
  product: (i: number) => TIMING.product.start + i * TIMING.product.step,
  system: (i: number) => TIMING.system.start + i * TIMING.system.step,
};

/* ── Connection path geometry ─────────────────────────────────────────
   Exported as builders because two consumers need the identical string:
   the visible <path>, and the <animateMotion path="…"> that walks a node
   along it. Deriving both from one function is what guarantees a node
   tracks its line exactly rather than approximately. */

/** Where a source card's line leaves the card — just below its bottom edge. */
export const SOURCE_EXIT_Y = SOURCE_CARD.y + SOURCE_CARD.h + 6;

export function sourcePath(s: HeroSource): string {
  const ey = cylinderRimY(s.entryX);
  const lift = (ey - SOURCE_EXIT_Y) * 0.45;
  return `M${s.cx} ${SOURCE_EXIT_Y}C${s.cx} ${(SOURCE_EXIT_Y + lift).toFixed(1)} ${s.entryX} ${(
    ey - lift
  ).toFixed(1)} ${s.entryX} ${ey.toFixed(1)}`;
}

export function productPath(p: HeroProduct): string {
  const cy = productCardCy(p);
  return `M${p.anchor.x} ${p.anchor.y}L${p.elbowX ?? PRODUCT_CARD.elbowX} ${cy}L${PRODUCT_CARD.x} ${cy}`;
}

export function systemPath(s: HeroSystem): string {
  return `M${PLATFORM.emitter.x} ${PLATFORM.emitter.y}L${s.cx} ${SYSTEM_CARD.nodeY}`;
}

/**
 * A closed ellipse as a two-arc path, optionally starting at `startDeg`.
 * Used to orbit nodes around the platform ring: a CSS `rotate()` on an
 * ellipse would swing its points onto a circle and off the ring, so the
 * orbit has to follow the ellipse itself. The start angle is what spaces
 * multiple orbiters apart, avoiding a negative SMIL `begin`.
 */
export function ellipsePath(cx: number, cy: number, rx: number, ry: number, startDeg = 0): string {
  const a = (startDeg * Math.PI) / 180;
  const sx = cx + rx * Math.cos(a);
  const sy = cy + ry * Math.sin(a);
  const mx = cx - rx * Math.cos(a);
  const my = cy - ry * Math.sin(a);
  return `M${sx.toFixed(2)} ${sy.toFixed(2)}A${rx} ${ry} 0 1 1 ${mx.toFixed(2)} ${my.toFixed(
    2
  )}A${rx} ${ry} 0 1 1 ${sx.toFixed(2)} ${sy.toFixed(2)}`;
}

/* ── Interaction ──────────────────────────────────────────────────────
   One `active` id lives on the hero root and is threaded down. Source,
   product and system ids are all distinct, so a single flat namespace is
   enough — plus 'core' for the central system itself.

   State changes ONLY on pointerenter / pointerleave / focus / blur. It is
   never written during animation, so the CSS/SMIL loop is untouched by it. */
export const CORE_ID = 'core';

export interface HeroInteraction {
  active: string | null;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
}

/* ── Plant structures inside the cylinder ────────────────────────────── */

export interface PlantStructure {
  /** centre-x */
  x: number;
  /** width */
  w: number;
  /** top-y */
  top: number;
  kind: 'column' | 'vessel';
  /** thin mast + tip above the cap, as on the reference's tall towers */
  mast?: boolean;
}

/* Tall and narrow, packed close: the reference reads as a refinery skyline
   filling the vessel, and a sparser set of wider boxes reads as a bar chart
   instead. Tops run from just under the cylinder's rim down to mid-height. */
export const plantStructures: PlantStructure[] = [
  { x: 798,  w: 16, top: 374, kind: 'column' },
  { x: 820,  w: 22, top: 340, kind: 'column' },
  { x: 844,  w: 14, top: 300, kind: 'column', mast: true },
  { x: 866,  w: 26, top: 352, kind: 'vessel' },
  { x: 892,  w: 16, top: 286, kind: 'column' },
  { x: 912,  w: 20, top: 320, kind: 'column' },
  { x: 934,  w: 14, top: 262, kind: 'column', mast: true },
  { x: 956,  w: 28, top: 346, kind: 'vessel' },
  { x: 982,  w: 16, top: 274, kind: 'column' },
  { x: 1002, w: 14, top: 248, kind: 'column', mast: true },
  { x: 1020, w: 22, top: 308, kind: 'column' },
  { x: 1044, w: 16, top: 278, kind: 'column' },
  { x: 1066, w: 30, top: 350, kind: 'vessel' },
  { x: 1094, w: 14, top: 268, kind: 'column', mast: true },
  { x: 1112, w: 20, top: 312, kind: 'column' },
  { x: 1136, w: 26, top: 344, kind: 'vessel' },
  { x: 1162, w: 14, top: 292, kind: 'column' },
  { x: 1182, w: 20, top: 332, kind: 'column' },
  { x: 1206, w: 16, top: 368, kind: 'column' },
];

/* ══ LAYOUTS ═════════════════════════════════════════════════════════════
   Two coordinate systems, not one scaled one.

   The desktop canvas is 1660x880 and very wide. Rendering it at phone width
   would put `--u` around 0.2, i.e. 16px labels at 3px — the reason Stage P
   exists at all. So narrow viewports get a genuinely different canvas
   (340x916, a tall column) with its own card placements and its own
   connection topology, while the desktop composition stays untouched.

   Everything a renderer needs is on the layout object, including the path
   builders — so the SVG viewBox, the HTML card positions and the connector
   geometry can never disagree, whichever layout is mounted. One JS mount
   gate picks between them; nothing measures the DOM.

   The compact connection topology is deliberately NOT the desktop one
   re-plotted. On a narrow column a six-way fan becomes spaghetti, so the
   products hang off a single vertical trunk that leaves the core, feeds each
   product in turn, and carries on down into the connected systems. Same
   story — sources → intelligence → products → systems — told in the shape
   that fits. */

export interface CylinderGeom {
  cx: number;
  rx: number;
  ry: number;
  topY: number;
  baseY: number;
}

export interface HeroLayout {
  variant: 'desktop' | 'compact';
  stage: { w: number; h: number };
  cylinder: CylinderGeom;
  hub: { cx: number; rx: number; ry: number; topY: number; baseY: number };
  platform: {
    upper: { cx: number; cy: number; rx: number; ry: number; wall: number };
    lower: { cx: number; cy: number; rx: number; ry: number; wall: number };
    ring: { cx: number; cy: number; rx: number; ry: number };
    emitter: { x: number; y: number };
  };
  plant: PlantStructure[];
  /** Vertical bulge of the cylinder floor ellipse, for seating structures. */
  floorSpread: number;
  sourceCard: { w: number; h: number; y: number; exitY: number };
  /** Label sits above the card on desktop, inside it on compact. */
  sourceLabelInside: boolean;
  sources: Array<HeroSource & { y: number }>;
  productCard: { x: number; w: number; h: number };
  products: Array<HeroProduct & { anchorPt: { x: number; y: number } }>;
  systemCard: { w: number; h: number; y: number; nodeY: number };
  systems: Array<HeroSystem & { y: number }>;
  /** Violet terrain only earns its space on the wide canvas. */
  mesh: boolean;
  paths: {
    source: (s: HeroSource & { y: number }) => string;
    product: (p: HeroProduct & { anchorPt: { x: number; y: number } }, i: number) => string;
    system: (s: HeroSystem & { y: number }, i: number) => string;
  };
  /** Ring orbit tracks, pre-built so HeroConnections stays layout-agnostic. */
  orbits: [string, string];
}

/** Near edge of a cylinder's top rim at x — inbound lines land on the real
 *  ellipse rather than a guessed horizontal. */
export const rimY = (c: CylinderGeom, x: number) => {
  const t = (x - c.cx) / c.rx;
  return c.topY + c.ry * Math.sqrt(Math.max(0, 1 - t * t));
};

/** y where a structure of centre-x `x` meets the cylinder floor ellipse. */
export const seatY = (c: CylinderGeom, spread: number, x: number) => {
  const t = (x - c.cx) / c.rx;
  return c.baseY + spread * Math.sqrt(Math.max(0, 1 - t * t));
};

/** Re-plot the authored skyline into another cylinder, so the compact plant
 *  is the same building set rather than a second hand-drawn one. */
function scalePlant(src: PlantStructure[], from: CylinderGeom, to: CylinderGeom, keepEvery = 1) {
  const sx = to.rx / from.rx;
  const sy = (to.baseY - to.topY) / (from.baseY - from.topY);
  return src
    .filter((_, i) => i % keepEvery === 0)
    .map((s) => ({
      ...s,
      x: +(to.cx + (s.x - from.cx) * sx).toFixed(1),
      w: +Math.max(5, s.w * sx).toFixed(1),
      top: +(to.baseY - (from.baseY - s.top) * sy).toFixed(1),
    }));
}

/* ── Desktop ─────────────────────────────────────────────────────────── */

const DESKTOP_SOURCES = heroSources.map((s) => ({ ...s, y: SOURCE_CARD.y }));
const DESKTOP_PRODUCTS = heroProducts.map((p) => ({ ...p, anchorPt: p.anchor }));
const DESKTOP_SYSTEMS = heroSystems.map((s) => ({ ...s, y: SYSTEM_CARD.y }));

export const desktopLayout: HeroLayout = {
  variant: 'desktop',
  stage: { w: STAGE.w, h: STAGE.h },
  cylinder: CYLINDER,
  hub: HUB,
  platform: {
    upper: PLATFORM.upper,
    lower: PLATFORM.lower,
    ring: PLATFORM.ring,
    emitter: PLATFORM.emitter,
  },
  plant: plantStructures,
  floorSpread: 27,
  sourceCard: { w: SOURCE_CARD.w, h: SOURCE_CARD.h, y: SOURCE_CARD.y, exitY: SOURCE_EXIT_Y },
  sourceLabelInside: false,
  sources: DESKTOP_SOURCES,
  productCard: { x: PRODUCT_CARD.x, w: PRODUCT_CARD.w, h: PRODUCT_CARD.h },
  products: DESKTOP_PRODUCTS,
  systemCard: { w: SYSTEM_CARD.w, h: SYSTEM_CARD.h, y: SYSTEM_CARD.y, nodeY: SYSTEM_CARD.nodeY },
  systems: DESKTOP_SYSTEMS,
  mesh: true,
  paths: {
    source: (s) => sourcePath(s),
    product: (p) => productPath(p),
    system: (s) => systemPath(s),
  },
  orbits: [
    ellipsePath(PLATFORM.ring.cx, PLATFORM.ring.cy, PLATFORM.ring.rx, PLATFORM.ring.ry, 20),
    ellipsePath(PLATFORM.ring.cx, PLATFORM.ring.cy, PLATFORM.ring.rx - 22, PLATFORM.ring.ry - 4, 205),
  ],
};

/* ── Compact (below 1280px) ──────────────────────────────────────────── */

const C_STAGE = { w: 340, h: 916 };
const C_CX = 170;
const C_CYL: CylinderGeom = { cx: C_CX, rx: 126, ry: 20, topY: 176, baseY: 268 };
const C_HUB = { cx: C_CX, rx: 44, ry: 10, topY: 264, baseY: 310 };
const C_PLATFORM = {
  upper: { cx: C_CX, cy: 316, rx: 104, ry: 18, wall: 10 },
  lower: { cx: C_CX, cy: 342, rx: 132, ry: 23, wall: 13 },
  ring: { cx: C_CX, cy: 316, rx: 78, ry: 13 },
  emitter: { x: C_CX, y: 358 },
};

/* Sources: 3 x 2 grid above the core, label inside to save vertical space. */
const C_SOURCE_CARD = { w: 104, h: 62, y: 0, exitY: 0 };
const C_SOURCE_X = [56, 170, 284];
const C_SOURCES = heroSources.map((s, i) => ({
  ...s,
  cx: C_SOURCE_X[i % 3],
  y: i < 3 ? 0 : 70,
  // Inner columns feed the rim closer to centre; outer ones stay wide.
  entryX: C_CX + (C_SOURCE_X[i % 3] - C_CX) * 0.62,
}));

/* Products: full-width rows hanging off a vertical trunk on the left. */
const C_TRUNK_X = 14;
const C_PRODUCT_CARD = { x: 30, w: 306, h: 62 };
const C_PRODUCT_Y0 = 396;
const C_PRODUCT_STEP = 70;
const C_PRODUCTS = heroProducts.map((p, i) => ({
  ...p,
  y: C_PRODUCT_Y0 + i * C_PRODUCT_STEP,
  anchorPt: { x: C_TRUNK_X, y: C_PRODUCT_Y0 + i * C_PRODUCT_STEP + C_PRODUCT_CARD.h / 2 },
}));

const C_TRUNK_END = C_PRODUCT_Y0 + 5 * C_PRODUCT_STEP + C_PRODUCT_CARD.h / 2;
const C_SYSTEM_CARD = { w: 62, h: 54, y: 850, nodeY: 838 };
const C_SYSTEM_X = [36, 103, 170, 237, 304];
const C_SYSTEMS = heroSystems.map((s, i) => ({ ...s, cx: C_SYSTEM_X[i], y: C_SYSTEM_CARD.y }));

export const compactLayout: HeroLayout = {
  variant: 'compact',
  stage: C_STAGE,
  cylinder: C_CYL,
  hub: C_HUB,
  platform: C_PLATFORM,
  plant: scalePlant(plantStructures, CYLINDER, C_CYL, 2),
  floorSpread: 15,
  sourceCard: { ...C_SOURCE_CARD, exitY: 0 },
  sourceLabelInside: true,
  sources: C_SOURCES,
  productCard: C_PRODUCT_CARD,
  products: C_PRODUCTS,
  systemCard: C_SYSTEM_CARD,
  systems: C_SYSTEMS,
  mesh: false,
  paths: {
    // Each source drops from its own card bottom into the vessel rim.
    source: (s) => {
      const y0 = s.y + C_SOURCE_CARD.h + 5;
      const ey = rimY(C_CYL, s.entryX);
      const lift = Math.max(12, (ey - y0) * 0.45);
      return `M${s.cx} ${y0}C${s.cx} ${(y0 + lift).toFixed(1)} ${s.entryX} ${(ey - lift).toFixed(1)} ${
        s.entryX
      } ${ey.toFixed(1)}`;
    },
    /* One trunk out of the core, down the left margin, with a short stub into
       each product row — a bus bar rather than a six-way fan.

       Each product draws only the SEGMENT above its own row, not the whole
       trunk. Drawing the full trunk six times stacks six coloured paths and
       the bus ends up painted whatever colour was drawn last; segmenting it
       makes the trunk hand colour off as it descends, and means hovering a
       product highlights only its own leg. */
    product: (p, i) => {
      const cy = p.anchorPt.y;
      if (i === 0) {
        return `M${C_PLATFORM.emitter.x} ${C_PLATFORM.emitter.y}C${C_PLATFORM.emitter.x} ${
          C_PLATFORM.emitter.y + 20
        } ${C_TRUNK_X} ${C_PLATFORM.emitter.y + 12} ${C_TRUNK_X} ${C_PRODUCT_Y0 + 8}L${C_TRUNK_X} ${cy}L${
          C_PRODUCT_CARD.x
        } ${cy}`;
      }
      const prevCy = cy - C_PRODUCT_STEP;
      return `M${C_TRUNK_X} ${prevCy}L${C_TRUNK_X} ${cy}L${C_PRODUCT_CARD.x} ${cy}`;
    },
    // The trunk continues past the last product and fans into the systems.
    system: (s) => `M${C_TRUNK_X} ${C_TRUNK_END}L${C_TRUNK_X} ${C_SYSTEM_CARD.nodeY - 26}L${s.cx} ${
      C_SYSTEM_CARD.nodeY
    }`,
  },
  orbits: [
    ellipsePath(C_PLATFORM.ring.cx, C_PLATFORM.ring.cy, C_PLATFORM.ring.rx, C_PLATFORM.ring.ry, 20),
    ellipsePath(C_PLATFORM.ring.cx, C_PLATFORM.ring.cy, C_PLATFORM.ring.rx - 14, C_PLATFORM.ring.ry - 3, 205),
  ],
};
