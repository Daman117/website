/**
 * Hand-drawn SVG glyphs for the enGRAM hero.
 *
 * Not lucide: these live inside the SVG canvas at canvas-pixel scale, drawn
 * on a box centred on the origin so a node places one with a single
 * translate. They also stay engineering-specific — an ISA valve body, a
 * vessel on saddles, an instrument bubble — which is what stops the graph
 * reading as stock AI iconography.
 *
 * `components/Icon.tsx` is the site-wide lucide map and stays untouched.
 */
import React from 'react';
import type { CapGlyph } from './engramHeroData';

const G: React.FC<{ children: React.ReactNode; sw?: number }> = ({ children, sw = 1.5 }) => (
  <g fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </g>
);

/** A brain, drawn as two lobes with a central fissure and inner folds.
 *  Used only by the hub now — the capability node that also carried it was
 *  removed, since two brains read as a duplicate. */
const Brain: React.FC = () => (
  <G>
    <path d="M0 -13.5v27" />
    <path d="M0 -12.6c-1.8-2.9-6.4-3.4-8.5-.7-3 -.3-5.4 1.8-5.4 4.5 0 1 .3 2 .9 2.8-1.5.9-2.5 2.5-2.5 4.4 0 2 1.1 3.7 2.7 4.6-.2.6-.3 1.2-.3 1.8 0 2.8 2.4 5.1 5.2 5.1 1.3 2 3.7 3 6 2.4" />
    <path d="M0 -12.6c1.8-2.9 6.4-3.4 8.5-.7 3-.3 5.4 1.8 5.4 4.5 0 1-.3 2-.9 2.8 1.5.9 2.5 2.5 2.5 4.4 0 2-1.1 3.7-2.7 4.6.2.6.3 1.2.3 1.8 0 2.8-2.4 5.1-5.2 5.1-1.3 2-3.7 3-6 2.4" />
    <path d="M-5.8 -6.3c1.9.4 3.9 1.5 5.8 2.7M5.8 .8c-1.9.4-3.9 1.5-5.8 2.7" />
  </G>
);

const GLYPHS: Record<CapGlyph, React.FC> = {
  // Pencil crossed with a ruler — drawing intelligence
  draw: () => (
    <G>
      <path d="M-9.6 9.2 -11.4 13.6 -7 11.8 6.6 -1.8a2.6 2.6 0 0 0 0-3.7l-.6-.6a2.6 2.6 0 0 0-3.7 0Z" />
      <path d="M2 -6.2 6.6 -1.6" />
      <path d="M-6.6 -8.6 -10 -5.2 3.6 8.4a2.6 2.6 0 0 0 3.7 0l.6-.6a2.6 2.6 0 0 0 0-3.7Z" />
      <path d="M-4.6 -3.4 -2.2 -5.8M-.4 .8 2 -1.6" />
    </G>
  ),
  // ISA control valve — bowtie body with an actuator
  valve: () => (
    <G>
      <path d="M-13 -5 0 3 -13 11Z" />
      <path d="M13 -5 0 3 13 11Z" />
      <path d="M0 3v-7" />
      <rect x="-7" y="-11" width="14" height="7" rx="1.8" />
    </G>
  ),
  // Operator screen with a live trend
  monitor: () => (
    <G>
      <rect x="-14" y="-11" width="28" height="19" rx="2.2" />
      <path d="M-5 13.4h10M0 8v5.4" />
      <path d="M-9 2.4 -4 -3.6 0 -.4 4.6 -6.4 8.4 -2.2" />
    </G>
  ),
  // Report — bars with a rising arrow
  trend: () => (
    <G>
      <path d="M-12 -12v24h24" />
      <path d="M-6.6 12V3.4M0 12V-2.6M6.6 12V1" />
      <path d="M-8 -2.2 -2.2 -8 2.2 -4 9.6 -11.2" />
      <path d="M5.6 -11.2h4v4" />
    </G>
  ),
  // Knowledge graph — hub and satellites
  graph: () => (
    <G>
      <circle cx="0" cy="0" r="3.6" />
      <circle cx="0" cy="-11.6" r="2.6" />
      <circle cx="10.6" cy="-5.2" r="2.6" />
      <circle cx="8.6" cy="7.8" r="2.6" />
      <circle cx="-8.6" cy="7.8" r="2.6" />
      <circle cx="-10.6" cy="-5.2" r="2.6" />
      <path d="M0 -3.6v-5.4M3.2 -2 7.9 -4.4M2.4 3.4 6.6 6.2M-2.4 3.4 -6.6 6.2M-3.2 -2 -7.9 -4.4" />
    </G>
  ),
  // Cited answer — a page with a fold
  document: () => (
    <G>
      <path d="M-9.5 -13h11l6 6v18.4a1.6 1.6 0 0 1-1.6 1.6h-15.4a1.6 1.6 0 0 1-1.6-1.6v-22.8a1.6 1.6 0 0 1 1.6-1.6Z" />
      <path d="M1.5 -13v6h6" />
      <path d="M-5.4 -1.4h10.8M-5.4 3.4h10.8M-5.4 8.2h6.4" />
    </G>
  ),
  // Tag linking — two chain links
  link: () => (
    <G>
      <path d="M-2.4 5.6 -6.6 9.8a5.9 5.9 0 0 1-8.4-8.4l4.2-4.2" />
      <path d="M2.4 -5.6 6.6 -9.8a5.9 5.9 0 0 1 8.4 8.4l-4.2 4.2" />
      <path d="M-5 5 5 -5" />
    </G>
  ),
  // Loop context — an instrument bubble on a lead
  instrument: () => (
    <G>
      <circle cx="1.5" cy="-2" r="9.4" />
      <path d="M-7.9 -2h18.8" />
      <path d="M-13 11 -5.2 3.6" />
      <path d="M-13 11h5M-13 11v-5" />
    </G>
  ),
  // Equipment record — a vessel on saddles
  vessel: () => (
    <G>
      <path d="M-7.5 -8.6h15" />
      <rect x="-7.5" y="-8.6" width="15" height="17.4" rx="3.4" />
      <path d="M-7.5 -3.4h15M-7.5 2.4h15" strokeOpacity="0.6" />
      <path d="M-5 8.8v3.6M5 8.8v3.6" />
      <path d="M-9 12.4h18" />
    </G>
  ),
};

export const CapIcon: React.FC<{ glyph: CapGlyph }> = ({ glyph }) => {
  const Cmp = GLYPHS[glyph];
  return <Cmp />;
};

/** The hub's own mark — the same brain, larger. */
export const HubBrain: React.FC = () => <Brain />;
