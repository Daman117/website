/**
 * Hand-drawn SVG glyphs for the ecosystem hero.
 *
 * These are deliberately NOT lucide icons. The reference draws each source
 * as a *document* carrying its own content (a flow sketch, a spec sheet, a
 * wireframe cube) and each product with a symbol specific to what it does —
 * an ISA valve for enGENIE, a brain for enGRAM. Generic lucide shapes lose
 * exactly the detail that stops this reading as a stock AI graphic, so the
 * glyphs are authored here instead. It also keeps components/Icon.tsx — a
 * shared map used across the whole site — untouched.
 *
 * Every glyph is a 32x32 stroke drawing inheriting `currentColor`, so the
 * card's accent colour drives it with no per-icon plumbing.
 */
import React from 'react';
import type { ProductGlyph, SourceGlyph, SystemGlyph } from './heroData';

type GlyphProps = { className?: string };

const Svg: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

/** Shared page outline with a folded corner — the base of every source glyph. */
const Page = () => (
  <>
    <path d="M8 3.5h9.6L24 9.9V27a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 7 27V5a1.5 1.5 0 0 1 1-1.5Z" />
    <path d="M17.4 3.6v6.4H24" />
  </>
);

/* ── Source documents ──────────────────────────────────────────────── */

const SOURCE_GLYPHS: Record<SourceGlyph, React.FC<GlyphProps>> = {
  // P&ID — a page carrying a small process flow sketch
  pid: ({ className }) => (
    <Svg className={className}>
      <Page />
      <circle cx="11.3" cy="15.4" r="1.5" />
      <circle cx="19.4" cy="13.2" r="1.5" />
      <circle cx="14.6" cy="22.6" r="1.5" />
      <circle cx="20.6" cy="21.4" r="1.5" />
      <path d="M12.8 15.1 17.9 13.5M11.9 16.8l2.2 4.4M16 22.4h3.1M19.6 14.7l.8 5.2" />
    </Svg>
  ),
  // Datasheet — header block plus specification rows
  datasheet: ({ className }) => (
    <Svg className={className}>
      <Page />
      <path d="M10.6 14.2h4.2M10.6 18h10.2M10.6 21.5h10.2M10.6 25h6.6" />
      <circle cx="19.4" cy="14.2" r="1.7" />
    </Svg>
  ),
  // Procedure — ordered steps, one of them struck through
  procedure: ({ className }) => (
    <Svg className={className}>
      <Page />
      <path d="M10.6 14.4h10.2M10.6 18h10.2M10.6 21.6h5.4" />
      <path d="M17.9 22.6l4.6 4.6M22.5 22.6l-4.6 4.6" />
    </Svg>
  ),
  // 3D model — a wireframe solid on the page
  model3d: ({ className }) => (
    <Svg className={className}>
      <Page />
      <path d="M15.5 11.6 21.6 15v6.8l-6.1 3.4-6.1-3.4V15Z" />
      <path d="M15.5 11.6v6.8M15.5 18.4 9.4 15M15.5 18.4 21.6 15M15.5 18.4v6.8" />
    </Svg>
  ),
  // Report — a trend plus summary bars
  report: ({ className }) => (
    <Svg className={className}>
      <Page />
      <path d="M10.6 20.4l3.2-3.6 2.8 2.4 4.4-5.2" />
      <path d="M11.6 26.4v-2.8M15.4 26.4v-4.6M19.2 26.4v-3.4M23 26.4v-5.8" />
    </Svg>
  ),
  // Live SCADA — a screen, not a page: this source is live, not filed
  scada: ({ className }) => (
    <Svg className={className}>
      <rect x="3.5" y="6" width="25" height="16.6" rx="2" />
      <path d="M12.4 27.6h7.2M16 22.8v4.8" />
      <path d="M8 17.6l3.8-4.4 3 2.6 4-5 2.6 3.2" />
    </Svg>
  ),
};

/* ── Products ──────────────────────────────────────────────────────── */

const PRODUCT_GLYPHS: Record<ProductGlyph, React.FC<GlyphProps>> = {
  // enGRAM — plant knowledge
  engram: ({ className }) => (
    <Svg className={className}>
      <path d="M16 8.4v16.4" />
      <path d="M16 8.4c-1.2-2-4.3-2.3-5.7-.5-2-.2-3.6 1.2-3.6 3 0 .7.2 1.4.6 1.9-1 .6-1.7 1.7-1.7 3 0 1.3.7 2.5 1.8 3.1-.1.4-.2.8-.2 1.2 0 1.9 1.6 3.4 3.5 3.4.9 1.3 2.5 2 4 1.6" />
      <path d="M16 8.4c1.2-2 4.3-2.3 5.7-.5 2-.2 3.6 1.2 3.6 3 0 .7-.2 1.4-.6 1.9 1 .6 1.7 1.7 1.7 3 0 1.3-.7 2.5-1.8 3.1.1.4.2.8.2 1.2 0 1.9-1.6 3.4-3.5 3.4-.9 1.3-2.5 2-4 1.6" />
      <path d="M12.1 12.6c1.3.3 2.6 1 3.9 1.8M19.9 17.4c-1.3.3-2.6 1-3.9 1.8" />
    </Svg>
  ),
  // enSTUDIO — drawing intelligence: pencil crossed with a ruler
  enstudio: ({ className }) => (
    <Svg className={className}>
      <path d="M5.6 26.4 7 21.2 21.4 6.8l4.8 4.8L11.8 26l-6.2.4Z" />
      <path d="M18.4 9.8l4.8 4.8" />
      <path d="M7 21.2l4.8 4.8" />
      <path d="M5.2 5.4h8.4v4.4" />
      <path d="M9.2 5.4v2.4M11.4 5.4v2.4" />
    </Svg>
  ),
  // enGENIE — instrument specification: an ISA control valve
  engenie: ({ className }) => (
    <Svg className={className}>
      <path d="M5.4 11.8 16 19.4 5.4 27Z" />
      <path d="M26.6 11.8 16 19.4 26.6 27Z" />
      <path d="M16 19.4v-7.6" />
      <rect x="9.8" y="5" width="12.4" height="6.8" rx="1.6" />
    </Svg>
  ),
  // enVIEW — modern SCADA: a live process screen
  enview: ({ className }) => (
    <Svg className={className}>
      <rect x="3.6" y="6.2" width="24.8" height="16.4" rx="2" />
      <path d="M12.2 27.4h7.6M16 22.6v4.8" />
      <path d="M7.6 17.8l4-4.6 3.2 2.8 4.2-5.2 2.8 3.4" />
      <path d="M23.4 10.6h1.4" />
    </Svg>
  ),
  // enABLE — simulation & analysis: measured results trending up
  enable: ({ className }) => (
    <Svg className={className}>
      <path d="M6 5.4v21.2h21.2" />
      <path d="M10.4 26.6v-6.2M15.6 26.6v-10.4M20.8 26.6v-4.4" />
      <path d="M9.4 15.6 13.8 11l4 3.4 6.6-6.6" />
      <path d="M20.6 7.8h3.8v3.8" />
    </Svg>
  ),
  // enTIE — one connected layer: hub and spokes
  entie: ({ className }) => (
    <Svg className={className}>
      <circle cx="16" cy="16" r="3.5" />
      <circle cx="16" cy="5.4" r="2.3" />
      <circle cx="26.1" cy="12.2" r="2.3" />
      <circle cx="22.3" cy="25.1" r="2.3" />
      <circle cx="9.7" cy="25.1" r="2.3" />
      <circle cx="5.9" cy="12.2" r="2.3" />
      <path d="M16 12.5V7.7M18.9 14.2l4.9-1.4M18.4 18.7l2.7 4.4M13.6 18.7l-2.7 4.4M13.1 14.2 8.2 12.8" />
    </Svg>
  ),
};

/* ── Connected systems ─────────────────────────────────────────────── */

const GEAR_TEETH = [0, 45, 90, 135, 180, 225, 270, 315];

const SYSTEM_GLYPHS: Record<SystemGlyph, React.FC<GlyphProps>> = {
  // DCS — controller racks
  dcs: ({ className }) => (
    <Svg className={className}>
      <rect x="4.5" y="5.5" width="23" height="6.4" rx="1.6" />
      <rect x="4.5" y="12.8" width="23" height="6.4" rx="1.6" />
      <rect x="4.5" y="20.1" width="23" height="6.4" rx="1.6" />
      <path d="M8.4 8.7h5.6M8.4 16h5.6M8.4 23.3h5.6" />
      <circle cx="22.6" cy="8.7" r="1.15" />
      <circle cx="22.6" cy="16" r="1.15" />
      <circle cx="22.6" cy="23.3" r="1.15" />
    </Svg>
  ),
  // Historian — time-series store
  historian: ({ className }) => (
    <Svg className={className}>
      <ellipse cx="16" cy="8.2" rx="9.6" ry="3.7" />
      <path d="M6.4 8.2v7.8c0 2 4.3 3.7 9.6 3.7s9.6-1.7 9.6-3.7V8.2" />
      <path d="M6.4 16v7.8c0 2 4.3 3.7 9.6 3.7s9.6-1.7 9.6-3.7V16" />
    </Svg>
  ),
  // MES — execution
  mes: ({ className }) => (
    <Svg className={className}>
      <circle cx="16" cy="16" r="4.6" />
      <circle cx="16" cy="16" r="9.2" />
      {GEAR_TEETH.map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <path
            key={deg}
            d={`M${(16 + 9.2 * Math.cos(r)).toFixed(2)} ${(16 + 9.2 * Math.sin(r)).toFixed(2)}L${(
              16 + 12.4 * Math.cos(r)
            ).toFixed(2)} ${(16 + 12.4 * Math.sin(r)).toFixed(2)}`}
            strokeWidth={2.2}
          />
        );
      })}
    </Svg>
  ),
  // ERP — asset and procurement reporting
  erp: ({ className }) => (
    <Svg className={className}>
      <rect x="4.4" y="5.4" width="23.2" height="21.2" rx="2.2" />
      <path d="M9.4 21.8v-4.6M14 21.8v-8.4M18.6 21.8v-5.8M23.2 21.8v-10.8" />
      <path d="M9.4 13.8 14 9.6l4.6 3.4 4.6-4.2" />
    </Svg>
  ),
  // Other systems — everything else on the floor
  other: ({ className }) => (
    <Svg className={className}>
      <rect x="4.8" y="4.8" width="10.2" height="10.2" rx="2" />
      <rect x="17" y="4.8" width="10.2" height="10.2" rx="2" />
      <rect x="4.8" y="17" width="10.2" height="10.2" rx="2" />
      <rect x="17" y="17" width="10.2" height="10.2" rx="2" />
    </Svg>
  ),
};

export const SourceIcon: React.FC<{ glyph: SourceGlyph; className?: string }> = ({ glyph, className }) => {
  const Cmp = SOURCE_GLYPHS[glyph];
  return <Cmp className={className} />;
};

export const ProductIcon: React.FC<{ glyph: ProductGlyph; className?: string }> = ({ glyph, className }) => {
  const Cmp = PRODUCT_GLYPHS[glyph];
  return <Cmp className={className} />;
};

export const SystemIcon: React.FC<{ glyph: SystemGlyph; className?: string }> = ({ glyph, className }) => {
  const Cmp = SYSTEM_GLYPHS[glyph];
  return <Cmp className={className} />;
};

/**
 * The mark on the face of the central hub — an "EX" built from a bar-chart
 * E and a circuit X, matching the reference's hub decal. Drawn rather than
 * using components/Logo.tsx, which renders a raster <img> that cannot live
 * inside an SVG layer.
 */
export const HubMark: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {/* bar-chart "E" */}
    <g fill="#ffffff" stroke="none">
      <rect x="-25" y="2" width="4.6" height="8" rx="1" />
      <rect x="-18.6" y="-2.4" width="4.6" height="12.4" rx="1" />
      <rect x="-12.2" y="-7.6" width="4.6" height="17.6" rx="1" />
    </g>
    {/* circuit "X" */}
    <g stroke="#ffffff" strokeWidth={3.4} strokeLinecap="round" fill="none">
      <path d="M-3.4 -8 L14.2 10" />
      <path d="M14.2 -8 L-3.4 10" />
    </g>
    <g fill="#5eead4" stroke="none">
      <circle cx="18.4" cy="-8" r="2.1" />
      <circle cx="18.4" cy="1" r="2.1" />
      <circle cx="18.4" cy="10" r="2.1" />
    </g>
    <g stroke="#5eead4" strokeWidth={1.5} fill="none" strokeLinecap="round">
      <path d="M14.2 -8h2.1M14.2 1h2.1M14.2 10h2.1" />
    </g>
  </g>
);
