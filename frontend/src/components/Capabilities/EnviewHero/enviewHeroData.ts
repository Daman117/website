/**
 * Everything the enVIEW hero draws, in ONE fixed design canvas.
 *
 * ── The unit system ─────────────────────────────────────────────────────
 * Same contract as the enGRAM hero: the composition is authored on a canvas
 * of STAGE.w x STAGE.h, `--u` is exactly one canvas pixel, and every size in
 * the artwork is `calc(N * var(--u))`. SVG viewBoxes use the same numbers, so
 * a glow lands on a panel edge precisely rather than approximately — no
 * measuring, no ResizeObserver, no JS layout.
 *
 * The reading copy is deliberately NOT in `--u`. Artwork should scale with
 * the stage; body text should not.
 *
 * ── Why the dashboard is data, not markup ───────────────────────────────
 * The panels are a real SCADA overview — alarms, metrics, health, trends —
 * and the numbers are what make it read as an operating plant rather than a
 * generic SaaS chart. Keeping them here means the layout components stay
 * about layout, and a later animation pass can drive the same values.
 */

/** The design canvas. Everything below is in canvas pixels. */
export const STAGE = { w: 1520, h: 800 } as const;

/** How far the room and the wave are drawn OUTSIDE the canvas on each side.
 *  Both layers are `overflow: visible`: an SVG clips to its VIEWPORT, not its
 *  viewBox, so geometry drawn out here fills the section gutters while the
 *  layers themselves stay on the stage box and keep their register. */
export const BLEED = 760;

/** Palette. Blue is enVIEW's product accent; violet is the ambient light in
 *  the room; the status colours are ISA-ish rather than decorative. */
export const C = {
  blue: '#2563eb',
  sky: '#38bdf8',
  cyan: '#22d3ee',
  violet: '#8b5cf6',
  purple: '#a855f7',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  magenta: '#d946ef',
} as const;

/* ══ DASHBOARD ═══════════════════════════════════════════════════════════ */

/** The dashboard's own box on the canvas. */
export const DASH = { x: 556, y: 44, w: 936, h: 660 } as const;

export type NavId =
  | 'overview'
  | 'assets'
  | 'alarms'
  | 'trends'
  | 'analytics'
  | 'reports'
  | 'settings';

export const navItems: { id: NavId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'assets', label: 'Assets' },
  { id: 'alarms', label: 'Alarms' },
  { id: 'trends', label: 'Trends' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
];

export const plantStatus = {
  state: 'Normal',
  note: 'All systems operational',
  availability: 98,
} as const;

export const alarmCounts = [
  { n: 2, label: 'Critical', color: C.red },
  { n: 5, label: 'Warnings', color: C.amber },
  { n: 12, label: 'Others', color: C.sky },
] as const;

export const keyMetrics = [
  { label: 'Production Rate', value: '12,540', unit: 'bbl/d' },
  { label: 'Energy Usage', value: '1,245', unit: 'kW' },
  { label: 'Water Usage', value: '320', unit: 'm³/h' },
  { label: 'Operating Efficiency', value: '92.6', unit: '%' },
] as const;

export const recentAlarms = [
  { sev: 'crit' as const, name: 'High Pressure', unit: 'Unit 200', at: '09:41 AM' },
  { sev: 'warn' as const, name: 'Low Flow', unit: 'Unit 100', at: '09:39 AM' },
  { sev: 'warn' as const, name: 'Temp Deviation', unit: 'Unit 300', at: '09:37 AM' },
];

export const systemHealth = [
  { label: 'Safety Instrumented System', state: 'Healthy' },
  { label: 'Control System', state: 'Healthy' },
  { label: 'Power System', state: 'Healthy' },
  { label: 'Communication Network', state: 'Healthy' },
];

/* ══ LIVE TRENDS ═════════════════════════════════════════════════════════
   A seeded generator rather than hand-written points, and rather than
   Math.random: the series must be identical on every render and between
   server and client, or the chart would redraw differently each time.

   Each series is a slow drift plus a fast jitter. That is what a real
   process tag looks like at an eight-hour window — a flat line reads as a
   simulation, and pure noise reads as a broken sensor. */

const lcg = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

/** Chart drawing box, in its own viewBox units. `pad` is vertical only: the
 *  trace runs edge to edge horizontally because it SCROLLS, and a horizontal
 *  inset would show the join. */
export const TREND = { w: 300, h: 118, pad: 4 } as const;

const SAMPLES = 74;

/**
 * One tag's history, as a CYCLIC series.
 *
 * Cyclic is the whole trick behind the live trend. The chart draws two copies
 * of the window end to end and slides by exactly one window width; because
 * values[SAMPLES] === values[0], the wrap is invisible and the trace appears
 * to receive new data forever. That needs two things:
 *
 *   · the drift uses INTEGER frequencies over the period, so the sines close;
 *   · the jitter is a fixed noise array indexed modulo SAMPLES, rather than a
 *     fresh draw per sample, so it closes too.
 *
 * Seeded rather than Math.random, so the chart is identical on every render.
 * Drift plus jitter, because a flat line reads as a simulation and pure noise
 * reads as a broken sensor.
 */
function series(seed: number, base: number, drift: number, jitter: number) {
  const rnd = lcg(seed);
  const noise = Array.from({ length: SAMPLES }, () => rnd() - 0.5);
  return Array.from({ length: SAMPLES }, (_, i) => {
    const t = i / SAMPLES;
    const slow =
      Math.sin(2 * Math.PI * 2 * t + seed) * drift +
      Math.sin(2 * Math.PI * 3 * t + seed * 0.7) * drift * 0.6;
    return base + slow + noise[i] * jitter;
  });
}

/** Values are a 0-100 engineering scale, matching the chart's own axis. */
export const trends = [
  { id: 'pressure', label: 'Pressure (bar)', color: C.magenta, values: series(7, 76, 6, 7) },
  { id: 'temperature', label: 'Temperature (°C)', color: C.sky, values: series(23, 50, 5, 6) },
  { id: 'flow', label: 'Flow (m³/h)', color: C.green, values: series(51, 26, 4.5, 5) },
];

export const trendHours = ['01:00', '03:00', '05:00', '07:00', '09:00'];
export const trendAxis = [100, 75, 50, 25, 0];

/**
 * Points -> a polyline in TREND space.
 *
 * One window, held still. The trace does not scroll: a strip that slides left
 * reads as paper moving under a pen, and what should read as alive here is
 * the SIGNAL. It stays where it was composed and pulses instead.
 *
 * Y is inverted: the axis reads 100 at the top, and SVG y grows downward.
 */
export function trendPath(values: number[]): string {
  const { w, h, pad } = TREND;
  const iw = w - pad * 2;
  const ih = h - pad * 2;
  return values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * iw;
      const y = pad + (1 - Math.min(100, Math.max(0, v)) / 100) * ih;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join('');
}

/** The trace's last sample, for the live-value marker at the leading edge —
 *  the dot a real trend screen puts on the current reading. */
export function trendHead(values: number[]) {
  const { w, h, pad } = TREND;
  const v = values[values.length - 1];
  return {
    x: w - pad,
    y: pad + (1 - Math.min(100, Math.max(0, v)) / 100) * (h - pad * 2),
  };
}

/* ══ THE DIGITAL WAVE ════════════════════════════════════════════════════
   The left half of the composition: a broad ribbon of flowing data.

   Built as a family of curves sharing one spine rather than as separate
   hand-drawn paths. Each strand is the spine offset vertically by a fraction
   of the band's thickness, which is what makes them read as ONE surface
   twisting through space instead of a bundle of unrelated lines. */

export const WAVE = {
  /** Where the band enters and leaves the canvas. It enters from well outside
   *  the left gutter: a wave that starts inside the frame reads as a graphic,
   *  not as flow. */
  x0: -640,
  x1: 780,
  /** Spine height at the left edge, at the trough, and at the right end. */
  yIn: 288,
  yLow: 540,
  yOut: 448,
  /** Half-thickness of the band at its widest. */
  spread: 132,
  strands: 26,
} as const;

/** The crest, in absolute canvas x. The control points below are absolute for
 *  the same reason: derive them from `x0` and pushing the entry point off the
 *  canvas drags the whole crest left with it. The shape is authored where it
 *  is seen, and only the entry moves. */
const CREST_X = 415;

/**
 * One strand of the wave.
 *
 * `k` runs -1..1 across the band. The strand is a cubic whose control points
 * are pushed away from the spine by `k`, and the push is scaled by a
 * thickness profile that is fat in the middle and pinched at both ends —
 * that pinch is what makes the ribbon look like it twists rather than
 * fanning out forever.
 */
export function wavePath(k: number): string {
  const { x0, x1, yIn, yLow, yOut, spread } = WAVE;
  const s = spread * k;
  return (
    `M${x0} ${(yIn + s * 0.12).toFixed(1)}` +
    `C108 ${(yIn + 44 + s * 0.35).toFixed(1)} 300 ${(yLow + s * 1.05).toFixed(1)} ` +
    `${CREST_X} ${(yLow - 26 + s * 0.86).toFixed(1)}` +
    `C549 ${(yLow - 60 + s * 0.62).toFixed(1)} 684 ${(yOut + 30 + s * 0.22).toFixed(1)} ` +
    `${x1} ${(yOut + s * 0.1).toFixed(1)}`
  );
}

/** Where the crest falls once the entry has been pushed off-canvas. */
const CREST_T = (CREST_X - WAVE.x0) / (WAVE.x1 - WAVE.x0);

/** A point ON a strand, used to seed particles so they sit in the flow
 *  rather than being scattered over a rectangle. Cheap approximation of the
 *  cubic: good enough for dust. */
export function wavePoint(k: number, t: number) {
  const { x0, x1, yIn, yLow, yOut, spread } = WAVE;
  const s = spread * k;
  const x = x0 + (x1 - x0) * t;
  const crest = yLow - 26;
  // Two segments meeting at the crest, matching the path's own waypoints.
  const y =
    t < CREST_T
      ? yIn + (crest - yIn) * Math.pow(t / CREST_T, 1.5) + s * (0.12 + 0.74 * (t / CREST_T))
      : crest +
        (yOut - crest) * Math.pow((t - CREST_T) / (1 - CREST_T), 0.8) +
        s * (0.86 - 0.76 * ((t - CREST_T) / (1 - CREST_T)));
  return { x, y };
}

/** Dust in and around the band. Deterministic, for the same reason the
 *  trends are. */
export const waveParticles = (() => {
  const rnd = lcg(90210);
  return Array.from({ length: 96 }, () => {
    const t = 0.04 + rnd() * 0.94;
    // Biased outside the band, so the dust reads as thrown off by the flow.
    const k = (rnd() - 0.5) * 3.4;
    const p = wavePoint(Math.max(-1.6, Math.min(1.6, k)), t);
    return {
      x: p.x + (rnd() - 0.5) * 40,
      y: p.y + (rnd() - 0.5) * 40,
      r: 0.7 + rnd() * 1.9,
      o: 0.18 + rnd() * 0.62,
      warm: rnd() > 0.62,
    };
  }).filter((p) => p.x > WAVE.x0 - 40 && p.x < STAGE.w * 0.62);
})();

/* ══ CONTROL ROOM ════════════════════════════════════════════════════════
   Kept to a handful of primitives. The room has to sit behind the dashboard
   without competing with it, so it is built from long thin light strips and
   flat planes rather than from anything with detail of its own. */

/** Window mullions on the right wall, as fractions of the wall's width. */
export const MULLIONS = [0.16, 0.34, 0.52, 0.7, 0.88];

/** Distant plant lights beyond the glass. */
export const CITY = (() => {
  const rnd = lcg(4242);
  return Array.from({ length: 54 }, () => ({
    u: rnd(),
    v: rnd(),
    r: 0.6 + rnd() * 1.5,
    o: 0.25 + rnd() * 0.55,
    warm: rnd() > 0.45,
  }));
})();
