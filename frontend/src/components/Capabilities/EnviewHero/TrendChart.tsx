/**
 * The Live Trends chart — driven like a patient monitor.
 *
 * Three process tags on one 0-100 engineering scale, which is how a real
 * overview screen shows unlike units together: the operator is reading shape
 * and correlation, not absolute values.
 *
 * ── The sweep ───────────────────────────────────────────────────────────
 * The traces do not scroll and they do not pulse. A CURSOR sweeps left to
 * right across the chart, exactly as it does on a bedside monitor: behind it
 * the trace is drawn, immediately ahead of it there is a short blanked gap
 * where the previous sweep is being overwritten, and beyond that the old
 * trace is still standing.
 *
 * That blank gap is the whole illusion. Without it the cursor is a light
 * passing over a static picture; with it, the line ahead visibly gives way to
 * the line behind, which is what reads as a recording being made.
 *
 * ── How it is built ─────────────────────────────────────────────────────
 * One mask, not three. It is a white rectangle — everything visible — with a
 * narrow black-to-transparent band painted over it, and that band translates.
 * Black hides, transparent lets the white through, so the band is a moving
 * hole. All three traces share it, so they are erased and rewritten together,
 * which is what a single sweeping beam would do.
 *
 * The cursor itself rides outside the mask on the identical keyframes, so it
 * stays welded to the gap's leading edge without either knowing about the
 * other. Both are plain `transform` translations: they composite, and no path
 * is ever recomputed.
 */
import React from 'react';
import { TREND, trendPath, trends } from './enviewHeroData';

/** How wide the blanked band ahead of the cursor is, in viewBox units. */
const GAP = 26;

const TrendChart: React.FC = () => (
  <svg
    className="evh-trend-svg"
    viewBox={`0 0 ${TREND.w} ${TREND.h}`}
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* Hidden at the cursor, opening back up over GAP units to the right. */}
      <linearGradient id="evh-sweep-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#000" stopOpacity="1" />
        <stop offset="55%" stopColor="#000" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#000" stopOpacity="0" />
      </linearGradient>

      <mask id="evh-sweep-mask" maskUnits="userSpaceOnUse">
        <rect x="0" y="0" width={TREND.w} height={TREND.h} fill="#fff" />
        <rect
          className="evh-sweep-gap"
          x="0"
          y="0"
          width={GAP}
          height={TREND.h}
          fill="url(#evh-sweep-grad)"
        />
      </mask>

      {/* The cursor: bright at the trace, dissolving above and below it. */}
      <linearGradient id="evh-cursor-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0" />
        <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.75" />
        <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Gridlines at the axis ticks. Outside the mask: the graticule is
        printed on the screen, not written by the beam. */}
    <g stroke="#1e293b" strokeOpacity="0.85" strokeWidth="0.5">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = TREND.pad + f * (TREND.h - TREND.pad * 2);
        return <path key={f} d={`M0 ${y.toFixed(1)}H${TREND.w}`} />;
      })}
    </g>

    <g mask="url(#evh-sweep-mask)">
      {trends.map((t) => (
        <path
          key={t.id}
          className="evh-trace"
          style={{ color: t.color } as React.CSSProperties}
          d={trendPath(t.values)}
          fill="none"
          stroke={t.color}
          strokeWidth="1.15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
    </g>

    <rect
      className="evh-sweep-cursor"
      x="-1.1"
      y="0"
      width="2.2"
      height={TREND.h}
      fill="url(#evh-cursor-grad)"
    />
  </svg>
);

export default TrendChart;
