/**
 * The Live Trends chart.
 *
 * Three process tags on one 0-100 engineering scale, which is how a real
 * overview screen shows unlike units together: the operator is reading shape
 * and correlation, not absolute values.
 *
 * ── The motion ──────────────────────────────────────────────────────────
 * Each trace drifts gently up and down on its own, as a live tag does when
 * the process is steady — nothing sweeps across it, and nothing scrolls.
 *
 * There WAS a sweep cursor with a blanked band, in the style of a bedside
 * monitor. It read as a beam passing over the chart rather than as three tags
 * behaving independently, which is what a trend screen is showing. The cursor,
 * its mask and the reversed dash geometry all came out with it.
 *
 * Each trace has its own phase and period, so the three never move together —
 * three lines rising in unison would read as the chart being nudged rather
 * than as the plant breathing.
 *
 * The drift is a `transform` on a group per tag, so it composites on the GPU
 * and no path is ever recomputed.
 */
import React from 'react';
import { TREND, trendPath, trends } from './enviewHeroData';

const TrendChart: React.FC = () => (
  <svg
    className="evh-trend-svg"
    viewBox={`0 0 ${TREND.w} ${TREND.h}`}
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    {/* Gridlines at the axis ticks. Horizontal only: vertical rules would
        fight the traces at this size. */}
    <g stroke="#1e293b" strokeOpacity="0.85" strokeWidth="0.5">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = TREND.pad + f * (TREND.h - TREND.pad * 2);
        return <path key={f} d={`M0 ${y.toFixed(1)}H${TREND.w}`} />;
      })}
    </g>

    {trends.map((t, i) => (
      <g
        key={t.id}
        className="evh-trace-drift"
        style={
          {
            '--d': `${(-i * 3.4).toFixed(1)}s`,
            '--dur': `${(11 + i * 2.6).toFixed(1)}s`,
          } as React.CSSProperties
        }
      >
        <path
          className="evh-trace"
          style={{ color: t.color } as React.CSSProperties}
          d={trendPath(t.values)}
          fill="none"
          stroke={t.color}
          strokeWidth="1.15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    ))}
  </svg>
);

export default TrendChart;
