import React from 'react';

/**
 * The enxco mark: a hexagonal circuit, drawn.
 *
 * SVG rather than the raster it replaced. The mark sits at 20-30px in the nav
 * and its whole character is thin traces, small nodes and the gaps between
 * them — the first things a bitmap loses at that size, and the first things it
 * loses again on a high-density screen. Drawn, it is sharp at any size and a
 * couple of kilobytes instead of a request.
 *
 * ── Two tones, and where they come from ─────────────────────────────────
 * The outer ring and the inner trace are different weights in the original.
 * Both are stated here as `currentColor` at different opacities rather than as
 * fixed navy: the mark has to work on the dark nav, on a light page, and on
 * whatever comes next, and inheriting `color` is what lets one component do
 * all three. Nothing in here names a colour.
 *
 * ── Why the ring is six segments and not a hexagon ──────────────────────
 * The gaps ARE the design — it reads as a circuit because the traces stop
 * short of the nodes rather than running through them. A single hexagon path
 * with a dash pattern would put the gaps at even intervals; authored per edge,
 * each break lands where a node is.
 */

const R = 27;
const CX = 32;
const CY = 32;

/** The six corners of a pointy-top hexagon. */
const V = Array.from({ length: 6 }, (_, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

/** One edge, pulled back from both corners so the node sits in the gap. */
function edge(a: { x: number; y: number }, b: { x: number; y: number }, trim = 5) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = (dx / len) * trim;
  const uy = (dy / len) * trim;
  return `M${(a.x + ux).toFixed(2)} ${(a.y + uy).toFixed(2)}L${(b.x - ux).toFixed(2)} ${(
    b.y - uy
  ).toFixed(2)}`;
}

interface LogoProps {
  /** Rendered square; the wordmark beside it carries the lockup's width. */
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 26, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* ── The ring ────────────────────────────────────────────────────── */}
    <g
      stroke="currentColor"
      strokeOpacity="0.95"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {V.map((v, i) => (
        <path key={i} d={edge(v, V[(i + 1) % 6])} />
      ))}
    </g>

    {/* Nodes at the corners the traces stop short of. */}
    <g fill="currentColor" fillOpacity="0.95">
      {V.map((v, i) => (
        <circle key={i} cx={v.x.toFixed(2)} cy={v.y.toFixed(2)} r="2.9" />
      ))}
    </g>

    {/* ── The inner trace ─────────────────────────────────────────────
        Lighter than the ring, as in the original: it is the signal inside
        the enclosure, not part of the enclosure. */}
    <g
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* the long run down the left, stepping in at the top and out again */}
      <path d="M24.5 15.5v6.5l-6 5.5v9l7 5.5" />
      {/* a branch off it, rising to the right */}
      <path d="M27.5 26.5l6-5v-6" />
      {/* a short stub on the right, angled toward the centre */}
      <path d="M36.5 24.5l4.5-3" />
    </g>

    <g fill="currentColor" fillOpacity="0.5">
      <circle cx="24.5" cy="14.5" r="2.4" />
      <circle cx="33.5" cy="14" r="2.2" />
      <circle cx="25.5" cy="42" r="2.6" />
      <circle cx="41.5" cy="21" r="2.4" />
      <circle cx="36.5" cy="24.5" r="2" />
    </g>

    {/* ── The right-hand traces ───────────────────────────────────────
        Kept at the ring's weight: in the original they belong to the frame
        rather than to the signal. */}
    <g
      stroke="currentColor"
      strokeOpacity="0.95"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M40 16.5l3.5 3" />
      <path d="M40.5 34.5v5.5l-4 3" />
    </g>
    <g fill="currentColor" fillOpacity="0.95">
      <circle cx="39.5" cy="16" r="2.4" />
      <circle cx="40.5" cy="33.5" r="2.2" />
    </g>

    {/* The core. Dimmest thing in the mark, and the only one that is alone. */}
    <circle cx="32" cy="30.5" r="2.6" fill="currentColor" fillOpacity="0.34" />
  </svg>
);

export default Logo;
