import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, Gauge, MonitorPlay, PenTool, LayoutGrid, Cpu, FileCheck, Play, FileOutput } from 'lucide-react';
import ScrollAnimation, { ScrollStagger } from '../ScrollAnimation';

interface EnablePageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#10B981';

const challenges = [
  'Senior engineers retiring with plant knowledge held only in their heads',
  'Stability, controllability and operability discovered late — at dynamic studies or, worse, at commissioning',
  'HAZOP, alarm rationalisation and control-structure decisions slow, manual and uneven in quality',
  'Plant changes hard to evaluate before they are built',
  'Existing models locked inside commercial simulators',
];

const existingSolutions = [
  { solution: 'Steady-state simulators', limitation: 'Compute a fixed operating point — no transient stability, loop interaction or controllability' },
  { solution: 'Dynamic simulators', limitation: 'Answer stability only after costly model-building and trial-and-error step tests' },
  { solution: 'RGA / eigenvalues in MATLAB', limitation: 'Require exporting a linearised model and a prior dynamic build' },
  { solution: 'Tribal knowledge', limitation: 'Informal, unverifiable, and lost when experienced engineers leave' },
];

const capabilities = [
  {
    Icon: Boxes,
    title: 'The Matrix Model',
    subtitle: 'Your Whole Plant as One Mathematical Object',
    desc: 'enABLE encodes the plant the engineer draws as a single block matrix that captures how every part is coupled to every other part.',
    features: [
      'Each unit operation contributes a matrix block',
      'Stream connections inject off-diagonal coupling',
      'Assembled matrix M with input matrix B = the linearised plant',
      '37 unit-operation builders with real physics — reactors, separations, heat transfer, rotating equipment, vessels and valves',
      'The same matrix drives both analysis and live simulation',
    ],
    color: '#10B981',
  },
  {
    Icon: Gauge,
    title: 'Analytical Verdicts',
    subtitle: 'Eigenvalue-Based Judgment, Computed Live — No Step Tests',
    desc: 'From the matrix, enABLE derives the engineering conclusions that conventionally require dynamic runs.',
    features: [
      'Eigenvalues — stability and response speed; a positive real part is an unstable mode',
      'Relative Gain Array — loop-to-valve pairing and interaction, without plant step tests',
      'Condition number — how ill-conditioned and hard to control the plant is',
      'Eigenvalue sensitivity — ranked recommended changes and change-impact previews',
      'Fiedler value — naturally weakly-coupled control zones',
    ],
    color: '#2563EB',
  },
  {
    Icon: MonitorPlay,
    title: 'Analyse → Live Simulation',
    subtitle: 'From a Fast Verdict to a Full Dynamic Test — One Model',
    desc: 'The same plant runs as a closed-loop dynamic simulation, putting the analysis predictions to the test.',
    features: [
      'Verdict-first: stable / marginal / unstable, with margin and slowest-mode time constant',
      'Bottleneck equipment identified',
      'Closed-loop simulation: controllers, operator-style faceplates, trends, alarms, startup sequence',
      'Inject faults and watch how stability and the controls respond',
      'Operator training and what-ifs against a virtual plant, not a real one',
    ],
    color: '#A78BFA',
  },
];

const steps = [
  { icon: PenTool,    title: 'Draw or Import',   desc: 'Draw the plant as a flowsheet, or import an existing model — YMPL, stream table, HYSYS or DWSIM.' },
  { icon: LayoutGrid, title: 'Assemble M',       desc: 'Unit blocks and stream coupling assemble into matrix M (with input matrix B), recomputed live on every build.' },
  { icon: Cpu,        title: 'Compute',          desc: 'Eigenvalues, RGA, condition number, eigenvalue sensitivity and the Fiedler value — derived analytically.' },
  { icon: FileCheck,  title: 'Read the Verdict', desc: 'A plain-language conclusion leads: stable / marginal / unstable, with the bottleneck and ranked changes.' },
  { icon: Play,       title: 'Simulate',         desc: 'Run the same plant closed-loop to confirm the predictions under realistic, time-varying conditions.' },
  { icon: FileOutput, title: 'Review & Export',  desc: 'HAZOP pre-fill, validation report, control narrative and alarm bounds for a qualified team to complete.' },
];

const validationFeatures = [
  'Eigenvalues match the analytic answer to within 1e-10 (two-tank)',
  'Stability verdict: 100% agreement (5 of 5 cases)',
  'RGA loop pairing: 100% on the applicable case',
  'Recommended-change direction: 100% (28 of 28 perturbations)',
  'Change-impact (10% change): worst-case error under 3%',
  '86 test files · roughly 1,990 test functions',
];

const honestyFeatures = [
  'Computed / exact — eigenvalues, RGA, condition number',
  'Predicted — confirm in Simulate — recommended changes, change-impact, range sweep',
  'Draft — requires engineer review — SIMC tuning, control narrative, alarm bounds',
  'Pre-fill, not a substitute — the HAZOP report aids a qualified team',
  'Import basis disclosed — each parameter tagged data-derived or handbook-default',
];

const securityFeatures = [
  'Desktop application — runs on the engineer’s own machine',
  'No cloud dependency',
  'Air-gap compatible',
  'Your plant models stay yours, in an open and comparable matrix form',
  'No vendor lock-in',
];

const outcomes = [
  'Judgment earlier in design',
  'Less blank-sheet hazard & control work',
  'Change evaluated before it is made',
  'Plant knowledge retained',
  'Operability issues caught before commissioning',
  'Decision support, not a replacement for review',
];

const EnablePage: React.FC<EnablePageProps> = ({ onOpenContact }) => {
  const navigate = useNavigate();

  return (
    <main className="engram-page">

      {/* ── BACK + PRODUCT NAME ── */}
      <div style={{ paddingTop: 100, paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
        <button className="product-back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div style={{ marginTop: -20, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            fontFamily: "'Space Grotesk','DM Sans',sans-serif",
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 700,
            letterSpacing: '-1.5px',
            color: 'var(--t1)',
            lineHeight: 1,
          }}>
            en<span style={{ color: ACCENT }}>ABLE</span>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="engram-hero engram-container">
        <div className="engram-hero-badge">
          <span style={{ color: ACCENT, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>PROCESS INTELLIGENCE FOR DESIGN &amp; CONTROL</span>
        </div>
        <h1 className="engram-hero-h1">
          Turn Your Plant Into a<br />
          <span style={{ color: ACCENT }}>Matrix</span>
        </h1>
        <p className="engram-hero-sub">
          enABLE is a desktop engineering application for process and control engineers. Draw your plant as a flowsheet and it becomes a block-matrix model — dx/dt = M·x + B·u — that yields eigenvalue-based engineering judgment at design time.
        </p>
        <p className="engram-hero-body">
          From that one matrix, enABLE computes stability, controllability, loop pairing, recommended changes, alarm bounds and a HAZOP pre-fill — then runs the same plant as a live closed-loop dynamic simulation. Questions that normally take years of experience or long dynamic studies become calculations.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Waitlist')}>
            Join the Waitlist
          </button>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Overview</span>
        <h2 className="engram-section-h2">An Intelligence Layer for Process Design</h2>
        <div className="engram-overview-grid">
          <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85 }}>
            enABLE turns a plant model into eigenvalue-based engineering judgment, and is honest about the difference between what it computes exactly, what it predicts, and what a human must still confirm. It complements the steady-state and dynamic simulators an organisation already uses — adding analysis those tools do not provide — rather than replacing them.
          </p>
          <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85 }}>
            Results are presented verdict-first: a plain-language conclusion about the design leads, with the supporting detail available on demand. Because the model that produces the analysis is the model that drives the simulation, a plant can move from a static design judgment to a running virtual plant without re-modelling.
          </p>
        </div>
        <div className="matrix-eq" style={{ marginTop: 28, maxWidth: 620 }}>
          dx/dt = M·x + B·u<br /><br />
          M  = unit-operation blocks + stream coupling<br />
          stable&nbsp;&nbsp; → all eigenvalues have negative real parts<br />
          unstable → any eigenvalue has a positive real part
        </div>
      </section>

      {/* ── CHALLENGE ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <h2 className="engram-section-h2">Design Judgment Arrives Too Late</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32 }}>
          Whether a plant will be stable, controllable and operable is often only discovered late — when changes are expensive — and the experience needed to judge it is walking out the door.
        </p>

        <div className="engram-two-col">
          <div className="engram-card">
            <h3 className="engram-card-title">The Problems enABLE Addresses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {challenges.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, marginTop: 8, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.7 }}>{c}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--t5)', marginTop: 20, fontStyle: 'italic' }}>
              The knowledge cliff is real: a generation of experienced engineers is retiring with their plant models held only in their heads.
            </p>
          </div>

          <div className="engram-card">
            <h3 className="engram-card-title">Why Conventional Tools Fall Short</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              The control-theory techniques are decades old and uncontroversial — but delivering them as automatic, live, design-time outputs from a single matrix is uncommon.
            </p>
            <table className="engram-table">
              <thead>
                <tr>
                  <th>Approach</th>
                  <th>Limitation</th>
                </tr>
              </thead>
              <tbody>
                {existingSolutions.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>{row.solution}</td>
                    <td style={{ color: 'var(--t4)' }}>{row.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 14, fontWeight: 500 }}>
              enABLE computes eigenvalue stability, RGA pairing, condition number and zoning automatically, at design time, from one block matrix.
            </p>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Key Capabilities</span>
        <h2 className="engram-section-h2">From a Matrix to a Running Plant</h2>
        <ScrollStagger className="engram-caps-grid" step={80}>
          {capabilities.map((cap) => (
            <div key={cap.title} className="engram-cap-card" style={{ '--cap-color': cap.color } as React.CSSProperties}>
              <div className="engram-cap-icon" style={{ color: cap.color }}><cap.Icon size={26} strokeWidth={1.75} /></div>
              <h3 className="engram-cap-title" style={{ color: cap.color }}>{cap.title}</h3>
              <p className="engram-cap-sub">{cap.subtitle}</p>
              <p className="engram-cap-desc">{cap.desc}</p>
              <ul className="engram-cap-list">
                {cap.features.map((f, i) => (
                  <li key={i}>
                    <span style={{ color: cap.color, marginRight: 6 }}>—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">How It Works</span>
        <h2 className="engram-section-h2">One Model, Two Depths</h2>
        <ScrollAnimation duration={800}>
          <div className="engram-flow-row">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="engram-flow-card">
                  <div className="engram-flow-num">
                    <s.icon size={20} strokeWidth={1.75} />
                  </div>
                  <h4 className="engram-flow-title">{s.title}</h4>
                  <p className="engram-flow-desc">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="engram-flow-connector" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollAnimation>
      </section>

      {/* ── VALIDATION + HONESTY + SECURITY ── */}
      <section className="engram-section engram-container">
        <ScrollStagger className="engram-three-col" step={90}>

          {/* Validation */}
          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block' }}>Validation</span>
            <h3 className="engram-card-title">Correctness Enforced by Tests</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              These are assertions in the test suite, not marketing numbers.
            </p>
            {validationFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
            <p style={{ fontSize: 12, color: 'var(--t5)', marginTop: 14, fontStyle: 'italic' }}>
              Results hold on the benchmark set — not a claim of accuracy on every plant.
            </p>
          </div>

          {/* Honesty model */}
          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block' }}>The Honesty Model</span>
            <h3 className="engram-card-title">Every Output Is Labelled</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              enABLE deliberately labels how much to trust each result.
            </p>
            {honestyFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563EB', marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="engram-card" style={{ borderColor: 'rgba(16,185,129,0.25)' }}>
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block', color: ACCENT }}>Industrial Security</span>
            <h3 className="engram-card-title">Runs Inside Your Perimeter</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              No vendor inside your security boundary.
            </p>
            {securityFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>
        </ScrollStagger>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Vision</span>
        <h2 className="engram-section-h2">From Tribal Knowledge to a Shared Engineering Language</h2>
        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 680, marginBottom: 32 }}>
          Instead of plant wisdom living as informal stories, it can live as structure in the matrix that a junior engineer, a senior engineer, and a piece of software can all read. The matrix becomes the common ground for design review, for safety analysis, and for passing knowledge from one generation of engineers to the next.
        </p>
        <ScrollStagger className="engram-outcomes-grid" step={50}>
          {outcomes.map((o, i) => (
            <div key={i} className="engram-outcome-pill">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
              <span>{o}</span>
            </div>
          ))}
        </ScrollStagger>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Waitlist')}>
            Join the Waitlist →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EnablePage;
