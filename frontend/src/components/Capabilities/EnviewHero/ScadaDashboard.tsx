/**
 * The SCADA overview screen — real UI, not a picture of one.
 *
 * Built as HTML rather than SVG, unlike the rest of the hero, and
 * deliberately: this is a dense grid of typography, rules and small numbers,
 * which is exactly what CSS grid and real text nodes are for. Drawing it in
 * SVG would mean hand-placing every label.
 *
 * ── Why it looks like plant software and not like a SaaS dashboard ──────
 * Four things, all of them restraint rather than decoration:
 *
 *   · One accent. Colour is reserved for STATE — red critical, amber warning,
 *     green healthy. Nothing is coloured to be attractive, so when something
 *     is coloured it means something.
 *   · Numbers dominate, labels recede. The value is the largest thing in
 *     every tile; its caption is small, upper-case and dim.
 *   · Real engineering units on every metric — bbl/d, kW, m³/h. A screen
 *     with bare numbers reads as a mock-up.
 *   · Tabular figures, so columns of numbers line up down the panel the way
 *     they do on a running system.
 *
 * ── Sizing ──────────────────────────────────────────────────────────────
 * Every dimension is `calc(N * var(--u))`, one canvas pixel, so the whole
 * screen scales with the stage without a single media query inside it and
 * without any text reflowing at a different size than it was composed at.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 * The screen never moves; only what is ON it does. Loops live on the small
 * elements (traces, lamps, plant units); the ENTRANCE lives on wrappers —
 * the frame, each panel via `--i`, and the `evh-in-*` groups inside them.
 * Kept apart deliberately: two animations on one property fight, and the
 * later declaration wins.
 */
import React, { useEffect, useState } from 'react';
import {
  Bell,
  Boxes,
  ChevronDown,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LineChart,
  PieChart,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import PlantSchematic from './PlantSchematic';
import TrendChart from './TrendChart';
import {
  alarmCounts,
  keyMetrics,
  navItems,
  plantStatus,
  recentAlarms,
  systemHealth,
  trendAxis,
  trendHours,
  trends,
} from './enviewHeroData';
import type { NavId } from './enviewHeroData';

/* Plausible bounds per severity. Criticals are rare, others are the long
   tail — a screen where all three roamed the same range would not read as an
   alarm system. */
const ALARM_RANGE: [number, number][] = [
  [0, 4],
  [3, 9],
  [8, 17],
];

/**
 * Live alarm counts.
 *
 * ONE count moves at a time, by one, every few seconds — because that is what
 * an alarm list does: alarms come in and are acknowledged individually. Three
 * numbers all jumping at once would read as a random number generator, which
 * is exactly what it would be.
 *
 * Every four seconds, not every frame: no React state is touched on a
 * animation tick, and the whole thing is one interval.
 */
function useLiveAlarms(reduceMotion: boolean) {
  const [counts, setCounts] = useState<number[]>(() => alarmCounts.map((a) => a.n));

  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => {
      setCounts((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        const [lo, hi] = ALARM_RANGE[i];
        const step = Math.random() < 0.5 ? -1 : 1;
        const next = [...prev];
        next[i] = Math.min(hi, Math.max(lo, prev[i] + step));
        return next;
      });
    }, 4200);
    return () => window.clearInterval(t);
  }, [reduceMotion]);

  return counts;
}

const NAV_ICON: Record<NavId, React.ComponentType<{ className?: string }>> = {
  overview: LayoutDashboard,
  assets: Boxes,
  alarms: Bell,
  trends: LineChart,
  analytics: PieChart,
  reports: FileText,
  settings: Settings,
};

/* The availability ring. A stroked circle with a dash gap rather than an arc
   path: one number drives it, and it stays exact at any radius. */
const Availability: React.FC<{ pct: number }> = ({ pct }) => {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="evh-avail evh-in evh-in-status">
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#1e293b" strokeWidth="4" />
        <circle
          className="evh-avail-arc evh-live"
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${((pct / 100) * c).toFixed(2)} ${c.toFixed(2)}`}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div className="evh-avail-text">
        <span className="evh-avail-pct">{pct}%</span>
        <span className="evh-avail-cap">Availability</span>
      </div>
    </div>
  );
};

const ScadaDashboard: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => {
  const live = useLiveAlarms(reduceMotion);

  return (
  <div className="evh-dash" role="img" aria-label="enVIEW SCADA plant overview screen">
    <div className="evh-dash-glass">
      {/* Ambient. Both are absolutely positioned, so neither becomes a grid
          item, and both sit above the panels but below nothing interactive —
          the whole screen is decorative. `evh-bloom` is the backlight
          breathing; `evh-sheen` is a reflection raking across the glass. */}
      <span className="evh-bloom" aria-hidden="true" />
      <span className="evh-sheen" aria-hidden="true" />
      {/* ── Left rail ──────────────────────────────────────────────────── */}
      <nav className="evh-rail" aria-hidden="true">
        <div className="evh-brand">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 2.6 20.4 7.3v9.4L12 21.4 3.6 16.7V7.3z"
              fill="url(#evh-brand-fill)"
              stroke="#60a5fa"
              strokeWidth="1.1"
            />
            <path d="M12 7.4 16.6 10v5L12 17.6 7.4 15v-5z" fill="#0b1a3d" />
            <defs>
              <linearGradient id="evh-brand-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <ul className="evh-nav evh-in evh-in-status">
          {navItems.map((n) => {
            const Icon = NAV_ICON[n.id];
            return (
              <li key={n.id} className={`evh-nav-item${n.id === 'overview' ? ' is-current' : ''}`}>
                <Icon className="evh-nav-icon" />
                <span className="evh-nav-label">{n.label}</span>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Screen ─────────────────────────────────────────────────────── */}
      <div className="evh-screen">
        <header className="evh-topbar">
          <h3 className="evh-screen-title">Overview</h3>
          <div className="evh-tools evh-in evh-in-status" aria-hidden="true">
            <Search className="evh-tool" />
            <span className="evh-tool-badged">
              <Bell className="evh-tool" />
              <i className="evh-badge-dot evh-live">1</i>
            </span>
            <Sun className="evh-tool" />
            <span className="evh-avatar">
              <User className="evh-tool" />
            </span>
          </div>
        </header>

        <div className="evh-grid">
          {/* ── Plant status ────────────────────────────────────────── */}
          <section className="evh-panel evh-p-status" style={{ '--i': 0 } as React.CSSProperties}>
            <span className="evh-cap">Plant Status</span>
            <div className="evh-status-row">
              <div>
                <p className="evh-status-state">{plantStatus.state}</p>
                <p className="evh-status-note">{plantStatus.note}</p>
              </div>
              <Availability pct={plantStatus.availability} />
            </div>
          </section>

          {/* ── Active alarms ───────────────────────────────────────── */}
          <section className="evh-panel evh-p-alarms" style={{ '--i': 1 } as React.CSSProperties}>
            <div className="evh-panel-head">
              <span className="evh-cap">Active Alarms</span>
              <span className="evh-link">View all</span>
            </div>
            <div className="evh-counts evh-in evh-in-status">
              {alarmCounts.map((a, i) => (
                <div key={a.label} className="evh-count">
                  {/* Keyed on the value, so a change remounts the span and
                      its arrival animation runs again — the number is seen to
                      update rather than silently swapping. */}
                  <span
                    key={live[i]}
                    className={`evh-count-n evh-count-tick${i === 0 ? ' evh-live' : ''}`}
                    style={{ color: a.color }}
                  >
                    {live[i]}
                  </span>
                  <span className="evh-count-l">{a.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Plant overview ──────────────────────────────────────── */}
          <section className="evh-panel evh-p-plant" style={{ '--i': 2 } as React.CSSProperties}>
            <span className="evh-cap">Plant Overview</span>
            <div className="evh-plant evh-in evh-in-plant">
              <PlantSchematic />
            </div>
          </section>

          {/* ── Live trends ─────────────────────────────────────────── */}
          <section className="evh-panel evh-p-trends" style={{ '--i': 3 } as React.CSSProperties}>
            <div className="evh-panel-head">
              <span className="evh-cap">Live Trends</span>
              <span className="evh-select">
                Last 8 hours <ChevronDown className="evh-select-caret" />
              </span>
            </div>

            <div className="evh-chart evh-in evh-in-chart">
              <div className="evh-chart-axis" aria-hidden="true">
                {trendAxis.map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>
              <div className="evh-chart-plot">
                <TrendChart />
              </div>
            </div>

            <div className="evh-chart-hours evh-in evh-in-chart" aria-hidden="true">
              {trendHours.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>

            <ul className="evh-legend evh-in evh-in-chart">
              {trends.map((t) => (
                <li key={t.id}>
                  <i style={{ background: t.color }} />
                  {t.label}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Key metrics ─────────────────────────────────────────── */}
          <section className="evh-panel evh-p-metrics" style={{ '--i': 4 } as React.CSSProperties}>
            <span className="evh-cap">Key Metrics</span>
            <ul className="evh-metrics evh-in evh-in-status">
              {keyMetrics.map((m) => (
                <li key={m.label}>
                  <span className="evh-metric-l">{m.label}</span>
                  <span className="evh-metric-v">
                    {m.value}
                    <em>{m.unit}</em>
                  </span>
                </li>
              ))}
            </ul>
            <span className="evh-link evh-link-foot">
              View full report <ExternalLink className="evh-link-icon" />
            </span>
          </section>

          {/* ── Recent alarms ───────────────────────────────────────── */}
          <section className="evh-panel evh-p-recent" style={{ '--i': 5 } as React.CSSProperties}>
            <div className="evh-panel-head">
              <span className="evh-cap">Recent Alarms</span>
              <span className="evh-link">View all</span>
            </div>
            <ul className="evh-recent evh-in evh-in-status">
              {recentAlarms.map((a, i) => (
                <li key={a.name}>
                  <i
                    className={`evh-sev evh-sev-${a.sev} evh-live`}
                    style={{ '--d': `${(-i * 1.3).toFixed(1)}s` } as React.CSSProperties}
                  />
                  <span className="evh-recent-n">{a.name}</span>
                  <span className="evh-recent-u">{a.unit}</span>
                  <span className="evh-recent-t">{a.at}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── System health ───────────────────────────────────────── */}
          <section className="evh-panel evh-p-health" style={{ '--i': 6 } as React.CSSProperties}>
            <span className="evh-cap">System Health</span>
            <ul className="evh-health evh-in evh-in-status">
              {systemHealth.map((h, i) => (
                <li key={h.label}>
                  <i
                    className="evh-sev evh-sev-ok evh-live"
                    style={{ '--d': `${(-i * 1.7).toFixed(1)}s` } as React.CSSProperties}
                  />
                  <span className="evh-health-l">{h.label}</span>
                  <span className="evh-health-s">
                    {h.state}
                    <ChevronDown className="evh-health-caret" />
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>

    {/* The stand: a lit plinth, which is what makes the screen read as an
        object standing in the room rather than a rectangle floating in it. */}
    <div className="evh-stand" aria-hidden="true">
      <span className="evh-stand-bar" />
      <span className="evh-stand-glow" />
    </div>
  </div>
  );
};

export default ScadaDashboard;
