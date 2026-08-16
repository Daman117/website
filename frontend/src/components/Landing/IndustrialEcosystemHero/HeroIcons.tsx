/**
 * Glyphs for the hero's input and output nodes, plus the enxco mark.
 *
 * Each glyph is authored in a 32x32 box and returns a <g>, not an <svg>: the
 * composition is one SVG, so a nested <svg> would bring its own viewport and
 * could not be placed with a plain transform.
 *
 * They are deliberately not lucide icons — the reference draws a *document*
 * carrying its own content and a live *screen* rather than generic shapes,
 * and that detail is what stops the hero reading as a stock AI graphic. It
 * also keeps components/Icon.tsx, a map shared across the whole site,
 * untouched.
 */
import React from 'react';
import type { HeroGlyph } from './heroData';

/** Page outline with a folded corner. */
const Page = () => (
  <>
    <path d="M8 3.5h9.6L24 9.9V27a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 7 27V5a1.5 1.5 0 0 1 1-1.5Z" />
    <path d="M17.4 3.6v6.4H24" />
  </>
);

const GLYPHS: Record<HeroGlyph, React.FC> = {
  // Engineering documents — a spec sheet with its header block
  docs: () => (
    <>
      <Page />
      <path d="M10.6 14.2h4.2M10.6 18h10.2M10.6 21.5h10.2M10.6 25h6.6" />
      <circle cx="19.4" cy="14.2" r="1.7" />
    </>
  ),
  // Operational data — a measured trend
  ops: () => (
    <>
      <circle cx="16" cy="16" r="12.5" />
      <path d="M8.6 20.4l4.6-5.2 3.2 2.8 5.4-6.4" />
      <path d="M18.4 11.6h3.8v3.8" />
    </>
  ),
  // Live SCADA — a screen, not a page: this source is live, not filed
  scada: () => (
    <>
      <rect x="3.5" y="6" width="25" height="16.6" rx="2" />
      <path d="M12.4 27.6h7.2M16 22.8v4.8" />
      <path d="M8 17.6l3.8-4.4 3 2.6 4-5 2.6 3.2" />
    </>
  ),
  // Plant intelligence — the enGRAM brain, the site's existing symbol for it
  brain: () => (
    <>
      <path d="M16 8.4v16.4" />
      <path d="M16 8.4c-1.2-2-4.3-2.3-5.7-.5-2-.2-3.6 1.2-3.6 3 0 .7.2 1.4.6 1.9-1 .6-1.7 1.7-1.7 3 0 1.3.7 2.5 1.8 3.1-.1.4-.2.8-.2 1.2 0 1.9 1.6 3.4 3.5 3.4.9 1.3 2.5 2 4 1.6" />
      <path d="M16 8.4c1.2-2 4.3-2.3 5.7-.5 2-.2 3.6 1.2 3.6 3 0 .7-.2 1.4-.6 1.9 1 .6 1.7 1.7 1.7 3 0 1.3-.7 2.5-1.8 3.1.1.4.2.8.2 1.2 0 1.9-1.6 3.4-3.5 3.4-.9 1.3-2.5 2-4 1.6" />
      <path d="M12.1 12.6c1.3.3 2.6 1 3.9 1.8M19.9 17.4c-1.3.3-2.6 1-3.9 1.8" />
    </>
  ),
};

/** Draws `glyph` centred on (x, y) at `size` canvas units across. */
export const HeroGlyphMark: React.FC<{
  glyph: HeroGlyph;
  x: number;
  y: number;
  size: number;
  color: string;
}> = ({ glyph, x, y, size, color }) => {
  const k = size / 32;
  const Cmp = GLYPHS[glyph];
  return (
    <g
      transform={`translate(${(x - size / 2).toFixed(2)} ${(y - size / 2).toFixed(2)}) scale(${k.toFixed(4)})`}
      fill="none"
      stroke={color}
      strokeWidth={1.6 / k}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Cmp />
    </g>
  );
};

/**
 * The enxco hexagonal circuit, on the face of the topmost data layer.
 *
 * The same mark as components/Logo.tsx, drawn here rather than imported: Logo
 * renders a standalone <svg>, which would bring its own coordinate system into
 * this one. The geometry below is that component's, expressed as a group
 * centred on the origin — the caller states the radius it should render at and
 * the mark works the scale out itself.
 */
export const HubMark: React.FC<{
  x: number;
  y: number;
  r: number;
  /** Frame colour. Takes the host platform's stroke so the mark belongs to it
   *  rather than sitting on top as a darker foreign object. */
  tone?: string;
  opacity?: number;
}> = ({ x, y, r, tone = '#5b2eff', opacity = 1 }) => {
  /** The mark's authored radius. `r` is what it should render at. */
  const R = 27;
  const scale = r / R;
  const V = Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return { x: R * Math.cos(a), y: R * Math.sin(a) };
  });

  /** Pulled back from both corners, so the node sits in the gap. */
  const edge = (a: { x: number; y: number }, b: { x: number; y: number }, trim = 5) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = (dx / len) * trim;
    const uy = (dy / len) * trim;
    return `M${(a.x + ux).toFixed(2)} ${(a.y + uy).toFixed(2)}L${(b.x - ux).toFixed(2)} ${(
      b.y - uy
    ).toFixed(2)}`;
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale.toFixed(4)})`} opacity={opacity}>
      {/* The ring: six segments, not a hexagon. The gaps are the design — it
          reads as a circuit because the traces stop short of the nodes. */}
      <g stroke={tone} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {V.map((v, i) => (
          <path key={i} d={edge(v, V[(i + 1) % 6])} />
        ))}
      </g>
      <g fill={tone} stroke="none">
        {V.map((v, i) => (
          <circle key={i} cx={v.x.toFixed(2)} cy={v.y.toFixed(2)} r="2.2" />
        ))}
      </g>

      {/* The inner signal trace, held back — it is what is inside the
          enclosure, not part of it. */}
      <g stroke="#0891b2" strokeOpacity="0.85" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M-7.5 -16.5v6.5l-6 5.5v9l7 5.5" />
        <path d="M-4.5 -5.5l6-5v-6" />
        <path d="M4.5 -7.5l4.5-3" />
      </g>
      <g fill="#0891b2" fillOpacity="0.85" stroke="none">
        <circle cx="-7.5" cy="-17.5" r="1.9" />
        <circle cx="1.5" cy="-18" r="1.8" />
        <circle cx="-6.5" cy="10" r="2" />
        <circle cx="9.5" cy="-11" r="1.9" />
        <circle cx="4.5" cy="-7.5" r="2" />
      </g>

      <g stroke={tone} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M8 -15.5l3.5 3" />
        <path d="M8.5 2.5v5.5l-4 3" />
      </g>
      <g fill={tone} stroke="none">
        <circle cx="7.5" cy="-16" r="1.9" />
        <circle cx="8.5" cy="1.5" r="1.8" />
      </g>
    </g>
  );
};
