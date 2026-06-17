import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilRuler, Boxes, MessageSquare, Workflow, BadgeCheck, SlidersHorizontal } from 'lucide-react';

interface EnstudioPageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#A78BFA';

const challenges = [
  'P&IDs are missing, outdated, or locked in scanned PDFs from decades ago',
  'Configuring a plant by hand takes 40+ engineer-hours per drawing sheet',
  'Tag lists, ranges, and alarm setpoints are re-keyed by hand into every system',
  'Brownfield plants have no clean source-of-truth drawing to start from',
  'Every downstream tool (SCADA, simulation) wants a different file format',
  'A single equipment change means re-importing and re-typing the whole drawing',
];

const existingSolutions = [
  { solution: 'Manual Configuration', limitation: 'Engineer types every tag, range, and connection by hand — slow and error-prone' },
  { solution: 'Generic OCR Tools', limitation: 'Read text but cannot understand equipment, topology, or control loops' },
  { solution: 'Vendor Import Wizards', limitation: 'Locked to one DCS format — no path to simulation or other systems' },
  { solution: 'CAD-Based Extractors', limitation: 'Need clean vector drawings — useless for scanned or brownfield P&IDs' },
];

const inputModes = [
  {
    Icon: PencilRuler,
    title: 'Draw',
    subtitle: 'Author from scratch',
    desc: 'Drag ISA-5.1 symbols onto the canvas, draw connections, and fill parameter forms. Every action writes straight to the internal model.',
    features: [
      'ISA-5.1 symbol palette',
      'Direct topology editing',
      'Surgical patching — no full re-import',
      'Diff preview before every change',
    ],
  },
  {
    Icon: Boxes,
    title: 'Import',
    subtitle: 'Upload any drawing',
    desc: 'Drop a P&ID PDF, scanned sheet, equipment CSV, datasheet, or YMPL file. AI reads it and renders equipment and connections on the canvas.',
    features: [
      'Vector & scanned P&ID PDFs',
      'Multi-page sheets in parallel',
      'Equipment lists & datasheets',
      'Existing YMPL / VIDS files',
    ],
  },
  {
    Icon: MessageSquare,
    title: 'Describe',
    subtitle: 'Plain-language topology',
    desc: 'Type or talk through a process unit. The same parser used by enableSim extracts equipment, instruments, and connections into the model.',
    features: [
      'Natural-language extraction',
      'Conversational model building',
      'Same output as image import',
      'Runs on local AI — never leaves the network',
    ],
  },
];

const capabilities = [
  {
    Icon: Workflow,
    title: 'Diagram Intelligence',
    subtitle: 'Read the Language of P&IDs',
    desc: 'AI vision reads equipment symbols, tags, and pipe topology from any engineering drawing — vector or scanned.',
    features: [
      'ISA symbol & tag recognition',
      'Equipment, instrument & connection extraction',
      'Legend-page detection with company convention profiles',
      'Auto-generated Mermaid diagram for instant visual verification',
      '>80% tag accuracy on real P&ID sheets',
    ],
    color: '#A78BFA',
  },
  {
    Icon: BadgeCheck,
    title: 'Confidence-Scored Review',
    subtitle: 'Engineers Stay in Control',
    desc: 'Every extracted element is scored and surfaced for review before it ever reaches a downstream system.',
    features: [
      'High / Medium / Low confidence colour coding',
      'Side-by-side source image vs Mermaid topology',
      'Three-column Accept / Edit / Reject table',
      'Safety-critical (TAHH, PAHH, SIL) require explicit sign-off',
      'Inline [VERIFY] annotations carried into export',
    ],
    color: '#60A5FA',
  },
  {
    Icon: SlidersHorizontal,
    title: 'Schema-Driven Adapters',
    subtitle: 'One Model, Many Targets',
    desc: 'A normalized internal model exports to multiple formats. Field mappings live in YAML schema files — never hardcoded.',
    features: [
      'VIDS YAML for enVIEW (vplant import)',
      'YMPL for enableSim (enable build)',
      'Add a field = edit one schema file, no code change',
      'Add an adapter = one schema + ~10 lines',
      'Extensible to Ignition, DeltaV and custom formats',
    ],
    color: '#34D399',
  },
];

const steps = [
  { n: '1', title: 'Input', desc: 'Upload a P&ID, import a file, draw on the canvas, or describe the unit in plain language.' },
  { n: '2', title: 'Extract', desc: 'Local AI reads the drawing with the matching skill files and returns structured topology.' },
  { n: '3', title: 'Model', desc: 'Equipment, instruments, and connections populate one normalized internal project model.' },
  { n: '4', title: 'Review', desc: 'Confidence-scored elements are verified against the source image and Mermaid diagram.' },
  { n: '5', title: 'Export', desc: 'Schema-driven adapters write VIDS for enVIEW and YMPL for enableSim.' },
];

const adapters = [
  {
    label: 'VIDS Adapter',
    target: 'enVIEW',
    color: '#A78BFA',
    desc: 'Converts the internal model into VPlant YAML (VIDS v1.0) for vplant import.',
    points: [
      'Equipment → plant screens, instruments → tag & alarm configs',
      'Operator-facing alarm limits in engineering units',
      'Auto-positioned on import — adjusted once in enVIEW',
      'Must pass vplant validate before export is allowed',
    ],
  },
  {
    label: 'YMPL Adapter',
    target: 'enableSim',
    color: '#34D399',
    desc: 'Converts the internal model into YMPL topology for enable build.',
    points: [
      'Equipment → nodes, connections → edges with port assignment',
      'Perry defaults injected for simulation parameters',
      'Mermaid stored in the meta block, always regenerated',
      'Never writes the physics matrix — that is enable build',
    ],
  },
  {
    label: 'Future Adapters',
    target: 'Extensible',
    color: '#60A5FA',
    desc: 'The adapter pattern supports new targets without touching the core.',
    points: [
      'Ignition tag export (CSV / JSON)',
      'Emerson DeltaV DVSN import format',
      'Custom plant-specific formats',
      'Each adapter only reads the internal model',
    ],
  },
];

const safetyFeatures = [
  'Confidence scoring on every extracted element',
  'Safety-critical instruments locked until explicit sign-off',
  'Diff view before any patch is committed',
  'Automatic revision logging on every change',
  'Surgical patching — no P&ID redraw for a single change',
];

const localFeatures = [
  'Runs entirely on localhost — one command, opens in browser',
  'Drawings never leave the engineer’s network',
  'Local AI models for draw, describe and converse modes',
  'Lightweight Flask tool — runs on macOS, Windows, Linux',
  'Skill plug-ins drop in as folders — no rebuild',
];

const brownfieldFeatures = [
  'Read existing DCS HMI screenshots from any vendor',
  'Tag names lifted exactly as displayed on screen',
  'No paper, no scanning, no OCR archaeology',
  'Documents what is actually built and running',
  'Turns every existing DCS installation into a starting point',
];

const outcomes = [
  '40 engineer-hours → under 2 hours per sheet',
  'Under 30 minutes review time per P&ID',
  'Validated VIDS with no manual edits',
  'Same project feeds enVIEW and enableSim',
  'No re-keying across systems',
  'Brownfield plants documented in minutes',
];

const EnstudioPage: React.FC<EnstudioPageProps> = ({ onOpenContact }) => {
  const navigate = useNavigate();

  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': '167,139,250' } as React.CSSProperties}>

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
            en<span style={{ color: ACCENT }}>STUDIO</span>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="engram-hero engram-container">
        <div className="engram-hero-badge">
          <span style={{ color: ACCENT, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>DRAWING INTELLIGENCE</span>
        </div>
        <h1 className="engram-hero-h1">
          Turn Engineering Drawings Into<br />
          <span style={{ color: ACCENT }}>Plant Configuration</span>
        </h1>
        <p className="engram-hero-sub">
          enSTUDIO is the intelligent middle layer between your drawings and your systems. Upload it, draw it, or describe it — it becomes structured, validated, downstream-ready configuration.
        </p>
        <p className="engram-hero-body">
          Engineering drawings sit in scanned PDFs, legacy CAD files, and decades-old archives. enSTUDIO reads them with local AI, builds one normalized project model, and exports VIDS for enVIEW and YMPL for enableSim — without re-keying a single tag.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo
          </button>
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Overview</span>
        <h2 className="engram-section-h2">Flexible Input → AI Processing → Flexible Output</h2>
        <div className="engram-overview-grid">
          <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85 }}>
            enSTUDIO does not force a single schema on either end. The AI understands both the drawing in front of you and the systems downstream. P&IDs, equipment lists, datasheets, YMPL files, or plain text all flow into one normalized internal model.
          </p>
          <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85 }}>
            That model is the working representation — not a file format. From it, schema-driven adapters generate exactly what each target system needs. The engineer never edits an output format by hand. It is a configuration tool for commissioning and change — it never runs at operator runtime.
          </p>
        </div>
      </section>

      {/* ── CHALLENGE ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <h2 className="engram-section-h2">Configuration Is the Bottleneck</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32 }}>
          Standing up a plant configuration means reading drawings and re-typing them into every system — by hand, again and again.
        </p>

        <div className="engram-two-col">
          <div className="engram-card">
            <h3 className="engram-card-title">Common Challenges</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {challenges.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, marginTop: 8, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.7 }}>{c}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--t5)', marginTop: 20, fontStyle: 'italic' }}>
              The target: 40 engineer-hours per sheet reduced to under two.
            </p>
          </div>

          <div className="engram-card">
            <h3 className="engram-card-title">Why Existing Tools Fall Short</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              Generic readers and vendor wizards were never built for industrial topology and dual-system output.
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
            <p style={{ fontSize: 12, color: ACCENT, marginTop: 14, fontWeight: 500 }}>
              enSTUDIO reads the drawing, understands the topology, and exports to every target.
            </p>
          </div>
        </div>
      </section>

      {/* ── INPUT MODES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Three Ways In</span>
        <h2 className="engram-section-h2">Meet Engineers Where They Are</h2>
        <div className="engram-caps-grid">
          {inputModes.map((m) => (
            <div key={m.title} className="engram-cap-card" style={{ '--cap-color': ACCENT } as React.CSSProperties}>
              <div className="engram-cap-icon" style={{ color: ACCENT }}><m.Icon size={26} strokeWidth={1.75} /></div>
              <h3 className="engram-cap-title" style={{ color: ACCENT }}>{m.title}</h3>
              <p className="engram-cap-sub">{m.subtitle}</p>
              <p className="engram-cap-desc">{m.desc}</p>
              <ul className="engram-cap-list">
                {m.features.map((f, i) => (
                  <li key={i}>
                    <span style={{ color: ACCENT, marginRight: 6 }}>—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Key Capabilities</span>
        <h2 className="engram-section-h2">From Drawing to Validated Configuration</h2>
        <div className="engram-caps-grid">
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
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">How It Works</span>
        <h2 className="engram-section-h2">From Raw Drawing to Downstream-Ready</h2>
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
      </section>

      {/* ── OUTPUT ADAPTERS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Output Adapters</span>
        <h2 className="engram-section-h2">One Model, Every Target System</h2>
        <div className="engram-three-col">
          {adapters.map((a) => (
            <div key={a.label} className="engram-card" style={{ borderColor: `${a.color}40` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: a.color }}>{a.target}</span>
              </div>
              <h3 className="engram-card-title" style={{ marginBottom: 8 }}>{a.label}</h3>
              <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>{a.desc}</p>
              {a.points.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.color, marginTop: 8, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── SAFETY + LOCAL + BROWNFIELD ── */}
      <section className="engram-section engram-container">
        <div className="engram-three-col">

          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block' }}>Human-in-the-Loop</span>
            <h3 className="engram-card-title">Nothing Ships Unreviewed</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              Every extraction is verified before it reaches a live system.
            </p>
            {safetyFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#60A5FA', marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          <div className="engram-card" style={{ borderColor: 'rgba(167,139,250,0.25)' }}>
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block', color: ACCENT }}>Local & Lightweight</span>
            <h3 className="engram-card-title">Your Drawings Stay With You</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              A simple local tool — no cloud, no heavy install.
            </p>
            {localFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block', color: '#34D399' }}>Brownfield Ready</span>
            <h3 className="engram-card-title">Document What Is Actually Running</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              No P&ID? Read the DCS screen that is already live.
            </p>
            {brownfieldFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399', marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Outcomes</span>
        <h2 className="engram-section-h2">Drawings Become Living Configuration</h2>
        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 680, marginBottom: 32 }}>
          enSTUDIO collapses the configuration bottleneck. The same project model feeds operator displays and physics simulation, stays in sync through surgical patches, and turns static drawings into a single source of truth for the entire plant lifecycle.
        </p>
        <div className="engram-outcomes-grid">
          {outcomes.map((o, i) => (
            <div key={i} className="engram-outcome-pill">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
              <span>{o}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EnstudioPage;
