import React from 'react';
import { useNavigate } from 'react-router-dom';

interface EnviewPageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#2563EB';
const ACCENT_RGB = '37,99,235';

const heroChips = ['Native macOS', 'Apple Silicon', 'AI-Ready', 'ISA Compliant'];

const stats = [
  { value: '<2s', label: 'Startup Time' },
  { value: '<100ms', label: 'Tag Latency' },
  { value: '<500MB', label: 'Memory Footprint' },
  { value: '$5,000', label: 'Flat Entry Pricing' },
];

const challenges = [
  { title: 'Crippling Startup Times', desc: 'JVM-based platforms take 30–60 seconds to load. Operators wait blindly during critical plant upsets.' },
  { title: 'Monolithic Vulnerability', desc: 'Single-OS Windows dependency creates a common-cause failure. Ransomware takes down primary and backup together.' },
  { title: 'Engineering Bottlenecks', desc: 'Configuration takes months. Legacy systems require 40+ engineer-hours per screen due to manual layout.' },
  { title: 'Exorbitant Infrastructure Costs', desc: '$100K+ in licensing fees per server, where IT infrastructure regularly exceeds the actual software value.' },
];

const nativeApproach = [
  {
    icon: '⬡',
    title: 'Native Apple Silicon',
    subtitle: 'Built from scratch in Swift',
    desc: 'Zero JVM, zero .NET overhead — a control platform engineered for modern hardware.',
    features: ['Pure Swift codebase', 'No virtual machine', 'Runs on Mac mini / Apple Silicon'],
    color: '#2563EB',
  },
  {
    icon: '◈',
    title: 'Unmatched Performance',
    subtitle: '1 Hz scan, sub-100ms latency',
    desc: 'Full process visibility at a 1 Hz scan rate with under 100ms tag latency on under 500MB of memory.',
    features: ['1 Hz scan rate', '<100ms tag latency', '<500MB memory'],
    color: '#0E9BC4',
  },
  {
    icon: '◎',
    title: 'Decoupled Multi-threading',
    subtitle: 'Data and visuals never collide',
    desc: 'Strict separation of the background data layer and the visual presentation layer keeps the UI alive.',
    features: ['Async data engine', 'Independent render thread', 'No UI thread blocking'],
    color: '#10B981',
  },
  {
    icon: '▶',
    title: 'Instant Startup',
    subtitle: 'Live in under two seconds',
    desc: 'The app launches and streams live plant data in under 2 seconds — no blind waiting during upsets.',
    features: ['<2s cold start', 'Immediate live data', 'Always operator-ready'],
    color: '#F59E0B',
  },
];

const views = [
  {
    icon: '⬡',
    title: 'P&ID View',
    subtitle: 'Engineering',
    desc: 'ISA-101 compliant background, ISA-5.1 instrument bubbles, and an absolute single source of truth topology.',
    color: '#2563EB',
  },
  {
    icon: '◈',
    title: 'DCS Mimic View',
    subtitle: 'Operations',
    desc: 'Metallic equipment graphics, live value badges, and stream-colored piping for instant situational awareness.',
    color: '#0E9BC4',
  },
  {
    icon: '◎',
    title: '3D Plant View',
    subtitle: 'Management',
    desc: 'RealityKit spatial rendering, orbit-camera navigation, and physical asset location mapping.',
    color: '#10B981',
  },
];

const steps = [
  { n: '1', title: 'Connect', desc: 'OPC-UA / Modbus TCP / MQTT native connections established instantly via the command line.' },
  { n: '2', title: 'Import', desc: 'AI-native ingest of P&IDs, files, and drawings — auto-generating tags and topology.' },
  { n: '3', title: 'Design', desc: 'Engineering Studio with a visual importer and 331 pre-built industrial symbols.' },
  { n: '4', title: 'Run', desc: 'The system switches seamlessly from Edit to Run mode and live data flows.' },
];

const safety = [
  { title: 'ISA-18.2 Alarm Management', desc: 'Lifecycle alarm management that prevents operator cognitive overload.' },
  { title: 'Tiered SQLite Historian', desc: 'High-performance local data compression with automatic archiving.' },
  { title: 'Threat Detection', desc: 'Active behavioral-baseline monitoring that flags anomalous patterns.' },
  { title: 'Quorum-OS Failover', desc: 'Resilience against ransomware — primary and backup never share the same OS.' },
];

const matrix = {
  cols: ['enVIEW', 'Ignition', 'Honeywell', 'AVEVA'],
  rows: [
    { c: 'Architecture', v: ['Native Apple Silicon', 'JVM / Windows', 'JVM / Windows', 'JVM / Windows'] },
    { c: 'Views', v: ['Three synchronized views', 'Disconnected modules', 'Disconnected modules', 'Disconnected modules'] },
    { c: 'Headless Ops', v: ['21 CLI commands', 'GUI-only', 'GUI-only', 'GUI-only'] },
    { c: 'AI Integration', v: ['Native operator assistant', 'None', 'None', 'None'] },
    { c: 'Startup Time', v: ['<2 seconds', '30–60+ seconds', '30–60+ seconds', '30–60+ seconds'] },
    { c: 'Entry Pricing', v: ['$5,000 flat', '$30K–$100K+', '$100K+', '$30K–$100K+'] },
  ],
};

const aiFeatures = [
  { icon: '◎', title: 'Intelligent Operator Assistant', desc: 'Natural-language querying integrated into the HMI — e.g. “Why is reactor TT-101 temperature rising?”' },
  { icon: '⬡', title: 'Automated Engineering', desc: 'AI Vision reads static P&ID diagrams and automatically generates YAML configurations and screen shapes.' },
  { icon: '◈', title: 'MCP Server Analytics', desc: 'Securely exposes live, rationalized plant data to Desktop AI for predictive maintenance and threat analysis.' },
];

const transform = [
  { from: 'Fragile', to: 'Resilient', desc: 'Moving from ransomware-vulnerable Windows nodes to locked-down macOS hardware.' },
  { from: 'Manual', to: 'Automated', desc: 'Eliminating 40-hour builds in favor of AI-assisted, auto-synchronized P&ID imports.' },
  { from: 'Bloated', to: 'Accessible', desc: 'Replacing $100K+ tag-based licensing with a unified flat-rate platform.' },
];

const EnviewPage: React.FC<EnviewPageProps> = ({ onOpenContact }) => {
  const navigate = useNavigate();

  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>

      {/* ── BACK + PRODUCT NAME ── */}
      <div style={{ paddingTop: 100, paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
        <button className="product-back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div style={{ marginTop: -20, display: 'flex', justifyContent: 'center' }}>
          <h2 style={{
            fontFamily: "'Space Grotesk','DM Sans',sans-serif",
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 700,
            letterSpacing: '-1.5px',
            color: 'var(--t1)',
            lineHeight: 1,
          }}>
            en<span style={{ color: ACCENT }}>VIEW</span>
          </h2>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="engram-hero engram-container">
        <div className="engram-hero-badge">
          <span style={{ color: ACCENT, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>MODERN SCADA</span>
        </div>
        <h1 className="engram-hero-h1">
          Modern SCADA for<br />
          <span style={{ color: ACCENT }}>Industrial &amp; Manufacturing</span>
        </h1>
        <p className="engram-hero-sub">
          enVIEW is a ground-up, native control platform — built in Swift for Apple Silicon. Instant startup, sub-100ms latency, and three synchronized views from a single data model.
        </p>
        <p className="engram-hero-body">
          Legacy SCADA freezes when it matters most — a 20-year-old single-threaded architecture buckling under alarm floods. enVIEW decouples data from rendering so operators never lose visibility, and turns the P&ID into the live operational source of truth.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          {heroChips.map((c) => (
            <span key={c} className="badge" style={{ color: ACCENT, background: 'rgba(37,99,235,0.1)', borderColor: 'rgba(37,99,235,0.32)' }}>
              {c}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo
          </button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="engram-section engram-container">
        <div className="engram-stats">
          {stats.map((s) => (
            <div key={s.label} className="engram-stat">
              <div className="engram-stat-val">{s.value}</div>
              <div className="engram-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHALLENGE ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <h2 className="engram-section-h2">The Hidden Cost of Legacy SCADA</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32, maxWidth: 760 }}>
          The problem is not the plant. The problem is a 20-year-old software architecture built on single-threaded paradigms — one processing thread shared between data acquisition and UI rendering. When alarm floods hit, the screen freezes at the worst possible moment.
        </p>
        <div className="engram-quad">
          {challenges.map((c) => (
            <div key={c.title} className="engram-card">
              <div style={{ fontSize: 22, color: ACCENT, marginBottom: 12, lineHeight: 1 }}>⚠</div>
              <h3 className="engram-card-title" style={{ fontSize: 14, marginBottom: 8 }}>{c.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.65 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NATIVE APPROACH ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Approach</span>
        <h2 className="engram-section-h2">A Native Approach to Industrial Control</h2>
        <div className="engram-quad">
          {nativeApproach.map((m) => (
            <div key={m.title} className="engram-cap-card" style={{ '--cap-color': m.color } as React.CSSProperties}>
              <div className="engram-cap-icon" style={{ color: m.color }}>{m.icon}</div>
              <h3 className="engram-cap-title" style={{ color: m.color, fontSize: 15 }}>{m.title}</h3>
              <p className="engram-cap-sub">{m.subtitle}</p>
              <p className="engram-cap-desc">{m.desc}</p>
              <ul className="engram-cap-list">
                {m.features.map((f, i) => (
                  <li key={i}>
                    <span style={{ color: m.color, marginRight: 6 }}>—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── THREE VIEWS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">One Data Model · Three Views</span>
        <h2 className="engram-section-h2">The Unified Visual Paradigm</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 28, maxWidth: 720 }}>
          enVIEW treats the P&amp;ID as the master blueprint. No rebuilding, no version drift — what the engineer designs is exactly what the operator sees.
        </p>
        <div className="engram-caps-grid">
          {views.map((v) => (
            <div key={v.title} className="engram-cap-card" style={{ '--cap-color': v.color } as React.CSSProperties}>
              <div className="engram-cap-icon" style={{ color: v.color }}>{v.icon}</div>
              <h3 className="engram-cap-title" style={{ color: v.color }}>{v.title}</h3>
              <p className="engram-cap-sub">{v.subtitle}</p>
              <p className="engram-cap-desc" style={{ marginBottom: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">How It Works</span>
        <h2 className="engram-section-h2">From Controller to Operations in Minutes</h2>
        <div className="engram-flow-row">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="engram-flow-card">
                <div className="engram-flow-num">{s.n}</div>
                <h4 className="engram-flow-title">{s.title}</h4>
                <p className="engram-flow-desc">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="engram-flow-connector" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="engram-card" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', textAlign: 'center', borderColor: 'rgba(37,99,235,0.3)' }}>
          <span style={{ fontSize: 14, color: 'var(--t3)' }}>
            <b style={{ color: ACCENT }}>Impact:</b> 40 engineer-hours per traditional screen → <b style={{ color: 'var(--t1)' }}>under 2 hours</b> with auto-generation.
          </span>
        </div>
      </section>

      {/* ── SAFETY ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Always On</span>
        <h2 className="engram-section-h2">Silent Safety Systems in the Background</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 28, maxWidth: 720 }}>
          By decoupling data ingestion from visual rendering, enVIEW guarantees operators never lose visibility during an alarm flood — the “flood vs. flow” architecture.
        </p>
        <div className="engram-quad">
          {safety.map((s) => (
            <div key={s.title} className="engram-card">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, marginBottom: 12 }} />
              <h3 className="engram-card-title" style={{ fontSize: 14, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EVALUATION MATRIX ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Difference</span>
        <h2 className="engram-section-h2">The Modern SCADA Evaluation Matrix</h2>
        <div className="engram-card" style={{ padding: '10px 18px', overflowX: 'auto' }}>
          <table className="engram-table">
            <thead>
              <tr>
                <th>Criteria</th>
                {matrix.cols.map((c, i) => (
                  <th key={c} style={i === 0 ? { color: ACCENT } : undefined}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((row) => (
                <tr key={row.c}>
                  <td style={{ fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>{row.c}</td>
                  {row.v.map((val, i) => (
                    <td
                      key={i}
                      style={i === 0
                        ? { color: 'var(--t2)', fontWeight: 600, background: 'rgba(37,99,235,0.06)' }
                        : { color: 'var(--t4)' }}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── AI-NATIVE ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">AI-Native</span>
        <h2 className="engram-section-h2">Industrial Intelligence, Built In</h2>
        <div className="engram-caps-grid">
          {aiFeatures.map((f) => (
            <div key={f.title} className="engram-cap-card" style={{ '--cap-color': ACCENT } as React.CSSProperties}>
              <div className="engram-cap-icon" style={{ color: ACCENT }}>{f.icon}</div>
              <h3 className="engram-cap-title" style={{ color: ACCENT, fontSize: 15 }}>{f.title}</h3>
              <p className="engram-cap-desc" style={{ marginBottom: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRANSFORM / OUTCOMES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Future</span>
        <h2 className="engram-section-h2">Transforming Industrial Operations</h2>
        <div className="engram-three-col">
          {transform.map((t) => (
            <div key={t.to} className="engram-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15 }}>
                <span style={{ color: 'var(--t4)' }}>{t.from}</span>
                <span style={{ color: ACCENT }}>→</span>
                <span style={{ color: 'var(--t1)' }}>{t.to}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--t4)', lineHeight: 1.7 }}>{t.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 720, marginTop: 28 }}>
          enVIEW is not just a SCADA system. It is the operational intelligence platform that connects your physical plant to your digital future.
        </p>
        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EnviewPage;
