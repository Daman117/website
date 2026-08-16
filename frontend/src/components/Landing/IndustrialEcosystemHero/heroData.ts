/**
 * Geometry for the homepage hero composition.
 *
 * ── The coordinate system ────────────────────────────────────────────────
 * Everything is authored against one fixed design canvas per layout and is
 * drawn inside a single <svg> with that viewBox, so the whole composition
 * scales with the stage and nothing needs measuring at runtime.
 *
 * ── Why two layouts ──────────────────────────────────────────────────────
 * The desktop canvas is 1660 wide because the stage spans the full hero and
 * the copy overlays its left third. Below 1280px the stage is capped near
 * 420px, so that canvas would render 17px labels at ~4px. The compact canvas
 * is a genuinely different arrangement (inputs in a row across the top, the
 * output tucked to the right) rather than the desktop one shrunk.
 *
 * ── No animation ─────────────────────────────────────────────────────────
 * The composition is static by design: it renders in its final state on the
 * first paint. There is no entrance sequence and no idle loop.
 */

/** One floating data platform, drawn as an isometric rhombus. */
export interface HeroLayer {
  cy: number;
  rx: number;
  ry: number;
  /** Stroke colour — a violet→cyan ramp down the stack. */
  stroke: string;
}

export type HeroGlyph = 'docs' | 'ops' | 'scada' | 'brain';

export interface HeroNode {
  id: string;
  /** One or two label lines. */
  label: string[];
  x: number;
  y: number;
  r: number;
  glyph: HeroGlyph;
  /** Connector between this node and the layer stack. */
  path: string;
  /** Layer-side terminus of that connector, where the endpoint dot sits. */
  dot: [number, number];
  /** First label baseline, relative to the node centre. Negative = above. */
  labelDy: number;
}

export interface HeroLayout {
  variant: 'desktop' | 'compact';
  stage: { w: number; h: number };
  cx: number;
  layers: HeroLayer[];
  /** The vertical light column tying the layers to the plant. */
  stream: { half: number; top: number; bottom: number; count: number };
  /** Deck centre, and the factor the shared plot plan is re-plotted by. */
  plant: { cy: number; scale: number };
  inputs: HeroNode[];
  output: HeroNode;
  label: { size: number; line: number };
}

/* ── The plant ──────────────────────────────────────────────────────────
   A real plot plan, not a skyline. Every unit is placed by its position on
   the ground — (u, v) in deck coordinates — and the renderer projects that
   through one axonometric transform (see ISO in HeroComposition). Two things
   follow that a hand-drawn silhouette cannot give:

     · units sit ON a disc with genuine front-to-back depth, so the plant
       reads as a facility seen from above-and-to-the-side rather than as a
       row of tubes standing on a line;
     · the whole thing is contained by construction — anything inside the
       deck radius projects inside the podium ellipse, at any scale.

   `u` runs back-right, `v` runs front-left, both in deck units. Painter
   ordering is derived (u + v ascending), so the table can be written by plot
   area instead of by draw order. */
export type PlantKind =
  | 'column'   // distillation column: skirt, trays, access platforms, domed head
  | 'tank'     // atmospheric storage tank: wide, short, cone roof
  | 'sphere'   // pressurised LPG storage on its leg cage
  | 'drum'     // horizontal vessel on saddles
  | 'heater'   // fired heater / furnace, with its own stacks
  | 'cooler'   // air-cooled exchanger bank, fans on top
  | 'flare'    // flare stack
  | 'lattice'  // open braced structure
  | 'box'      // control building / skid package
  | 'rack';    // pipe rack on trestle bents

export interface PlantUnit {
  u: number;
  v: number;
  /** Ground radius for round units; half-length along u for boxes and drums. */
  r: number;
  /** Height above grade. */
  h: number;
  kind: PlantKind;
  /** Boxes, heaters, coolers, lattices: half-depth along v. Defaults to `r`. */
  b?: number;
  /** Racks: the far end of a run along u. Holds `v` constant. */
  u2?: number;
  /** Racks: the far end of a run along v instead. Holds `u` constant. */
  v2?: number;
}

/** Radius of the round podium the whole assembly stands on. */
export const DECK_R = 170;
/** Half-width of the SQUARE deck laid over it, which the plot plan sits on. */
export const DECK_HALF = 112;

/* ── The plot plan ───────────────────────────────────────────────────────
   Laid out in ZONES, the way a refinery actually is, because that is what
   makes it read as a plant rather than as a cluster of cylinders:

     left     tank farm — big flat storage tanks, then the LPG spheres
     centre   the process train — distillation columns packed close
     right    fired heaters, air-cooler banks, the structure and the flare
     front    horizontal drums on saddles, and the buildings
     across   two pipe racks tying the zones together

   Equipment is what carries the read, not height variation: a tank is wide
   and short with a cone roof, a column is slender with access platforms up
   its side, a heater has stacks. Give everything the same silhouette and no
   amount of density will look like process plant. */
export const PLANT: PlantUnit[] = [
  /* Pipe racks. Two main runs across the plot and two cross-runs tying the
     process train to the tank farm and the cold end — without the crosses the
     equipment reads as unplumbed. Drawn among the rows by depth, not over. */
  { u: -100, u2: 100, v: -58, r: 0, h: 34, kind: 'rack' },
  { u: -100, u2: 100, v: 22, r: 0, h: 30, kind: 'rack' },
  { u: -66, v: -58, v2: 96, r: 0, h: 26, kind: 'rack' },
  { u: 62, v: -58, v2: 40, r: 0, h: 26, kind: 'rack' },

  /* ── Tank farm, left ── */
  { u: -80, v: -76, r: 25, h: 52, kind: 'tank' },
  { u: -82, v: -18, r: 23, h: 46, kind: 'tank' },
  { u: -84, v: 38, r: 21, h: 42, kind: 'tank' },
  { u: -86, v: 92, r: 19, h: 38, kind: 'tank' },

  /* ── Process train, centre. The tallest column sits mid-plot. ── */
  { u: -56, v: -78, r: 7, h: 145, kind: 'column' },
  { u: -30, v: -80, r: 8, h: 175, kind: 'column' },
  { u: -8, v: -82, r: 10, h: 205, kind: 'column' },
  { u: 14, v: -78, r: 7, h: 160, kind: 'column' },
  { u: -56, v: -38, r: 8, h: 132, kind: 'column' },
  { u: -34, v: -40, r: 9, h: 185, kind: 'column' },
  { u: -10, v: -42, r: 11, h: 220, kind: 'column' },
  { u: 14, v: -38, r: 8, h: 170, kind: 'column' },
  { u: -54, v: 4, r: 7, h: 120, kind: 'column' },
  { u: -30, v: 0, r: 9, h: 150, kind: 'column' },
  { u: -6, v: -2, r: 8, h: 178, kind: 'column' },
  { u: 18, v: 2, r: 10, h: 140, kind: 'column' },
  { u: 8, v: 32, r: 9, h: 128, kind: 'column' },

  /* ── Hot end and cold end, right ── */
  { u: 84, v: -95, r: 12, h: 130, kind: 'lattice', b: 12 },
  { u: 104, v: -92, r: 5, h: 248, kind: 'flare' },
  { u: 46, v: -60, r: 18, h: 55, kind: 'heater', b: 13 },
  { u: 48, v: -18, r: 17, h: 50, kind: 'heater', b: 12 },
  { u: 80, v: -55, r: 16, h: 40, kind: 'cooler', b: 11 },
  { u: 82, v: -12, r: 16, h: 38, kind: 'cooler', b: 11 },
  { u: 38, v: 32, r: 8, h: 115, kind: 'column' },

  /* ── Front: LPG spheres, drums on saddles, buildings ── */
  { u: -78, v: 100, r: 15, h: 0, kind: 'sphere' },
  { u: -42, v: 96, r: 14, h: 0, kind: 'sphere' },
  { u: -8, v: 60, r: 20, h: 0, kind: 'drum' },
  { u: 34, v: 62, r: 18, h: 0, kind: 'drum' },
  { u: 20, v: 96, r: 19, h: 0, kind: 'drum' },
  { u: 66, v: 55, r: 15, h: 34, kind: 'box', b: 11 },
  { u: 92, v: 42, r: 13, h: 40, kind: 'box', b: 10 },
  { u: 64, v: 94, r: 14, h: 28, kind: 'box', b: 10 },
];

/* A steel ramp, cooling by one step down the stack. Not three unrelated
   hues: the layers are one system seen at three depths. */
const LAYER_STROKES = ['#3b5ba8', '#2b4585', '#1e3a6e'];

/* ── Desktop (1280px and up) ─────────────────────────────────────────────
   The stage spans the whole hero and .ieh-copy overlays its left 38%, i.e.
   the first ~630 canvas units. Nothing in the composition reaches left of
   x=688, so the artwork can never run under the headline. */

export const desktopLayout: HeroLayout = {
  variant: 'desktop',
  stage: { w: 1660, h: 880 },
  cx: 1120,
  /* Three platforms of the SAME size, evenly spaced. They used to grow going
     down, which is geometrically centred but reads as a staircase — the edges
     fan outward instead of stacking.

     SIZE IS SET AGAINST THE PODIUM, not chosen freely. In the reference the
     plates are about half the podium's width; at 0.72 they dominated the plant
     they are supposed to be floating above. rx 155 against the outer ring's
     283 puts the ratio back to 0.55.

     ry is 0.25 of rx rather than the deck's own 0.32 iso ratio: flatter plates
     leave a clean gap between them, where the true ratio makes them
     interpenetrate and the stack turns to mush. */
  layers: [
    { cy: 190, rx: 155, ry: 39, stroke: LAYER_STROKES[0] },
    { cy: 286, rx: 155, ry: 39, stroke: LAYER_STROKES[1] },
    { cy: 382, rx: 155, ry: 39, stroke: LAYER_STROKES[2] },
  ],
  stream: { half: 34, top: 218, bottom: 624, count: 17 },
  plant: { cy: 700, scale: 1 },
  inputs: [
    {
      id: 'docs',
      label: ['Engineering', 'Documents'],
      x: 740,
      y: 280,
      r: 38,
      glyph: 'docs',
      path: 'M778 280H875L965 190',
      dot: [965, 190],
      labelDy: 68,
    },
    {
      id: 'ops',
      label: ['Operational', 'Data'],
      x: 740,
      y: 430,
      r: 38,
      glyph: 'ops',
      path: 'M778 430H821L965 286',
      dot: [965, 286],
      labelDy: 68,
    },
    {
      id: 'scada',
      label: ['Live SCADA'],
      x: 740,
      y: 580,
      r: 38,
      glyph: 'scada',
      path: 'M778 580H800L965 382',
      dot: [965, 382],
      labelDy: 68,
    },
  ],
  output: {
    id: 'intelligence',
    label: ['Plant', 'Intelligence'],
    x: 1490,
    y: 452,
    r: 46,
    glyph: 'brain',
    path: 'M1275 382L1345 452H1444',
    dot: [1275, 382],
    labelDy: 76,
  },
  label: { size: 17, line: 23 },
};

/* ── Compact (below 1280px) ──────────────────────────────────────────────
   Same story, reflowed into a portrait column: inputs across the top with
   their labels ABOVE the icons — the connectors drop out of the icon
   bottoms, so a label below would sit on the line. */

export const compactLayout: HeroLayout = {
  variant: 'compact',
  stage: { w: 360, h: 460 },
  cx: 150,
  layers: [
    { cy: 130, rx: 62, ry: 16, stroke: LAYER_STROKES[0] },
    { cy: 168, rx: 62, ry: 16, stroke: LAYER_STROKES[1] },
    { cy: 206, rx: 62, ry: 16, stroke: LAYER_STROKES[2] },
  ],
  stream: { half: 14, top: 146, bottom: 348, count: 11 },
  plant: { cy: 392, scale: 0.375 },
  inputs: [
    {
      id: 'docs',
      label: ['Engineering', 'Documents'],
      x: 44,
      y: 64,
      r: 20,
      glyph: 'docs',
      path: 'M44 84V106L110 124',
      dot: [110, 124],
      labelDy: -50,
    },
    {
      id: 'ops',
      label: ['Operational', 'Data'],
      x: 150,
      y: 64,
      r: 20,
      glyph: 'ops',
      path: 'M150 84V114',
      dot: [150, 114],
      labelDy: -50,
    },
    {
      id: 'scada',
      label: ['Live SCADA'],
      x: 256,
      y: 64,
      r: 20,
      glyph: 'scada',
      path: 'M256 84V106L190 124',
      dot: [190, 124],
      labelDy: -50,
    },
  ],
  output: {
    id: 'intelligence',
    label: ['Plant', 'Intelligence'],
    x: 300,
    y: 200,
    r: 24,
    glyph: 'brain',
    path: 'M212 168L244 200H276',
    dot: [212, 168],
    labelDy: 44,
  },
  label: { size: 12.5, line: 16 },
};
