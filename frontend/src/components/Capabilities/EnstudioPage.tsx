import React from 'react';
import { PencilRuler, Boxes, MessageSquare, Workflow, BadgeCheck, SlidersHorizontal, Upload, ScanSearch, FileOutput } from 'lucide-react';
import ScrollAnimation, { ScrollStagger } from '../ScrollAnimation';

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
  { icon: Upload,      title: 'Input',   desc: 'Upload a P&ID, import a file, draw on the canvas, or describe the unit in plain language.' },
  { icon: ScanSearch,  title: 'Extract', desc: 'Local AI reads the drawing with the matching skill files and returns structured topology.' },
  { icon: Boxes,       title: 'Model',   desc: 'Equipment, instruments, and connections populate one normalized internal project model.' },
  { icon: BadgeCheck,  title: 'Review',  desc: 'Confidence-scored elements are verified against the source image and Mermaid diagram.' },
  { icon: FileOutput,  title: 'Export',  desc: 'Schema-driven adapters write VIDS for enVIEW and YMPL for enableSim.' },
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
  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': '167,139,250' } as React.CSSProperties}>

      {/* ── BACK + PRODUCT NAME ── */}
      <div style={{ paddingTop: 100, paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>

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

      {/* ── VISUAL: P&ID → Structured Model ── */}
      <div className="engram-container" style={{ marginBottom: 48 }}>
        <div style={{
          background: 'linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)',
          border: `1px solid ${ACCENT}33`,
          borderRadius: 20,
          padding: 'clamp(20px,4vw,48px)',
          boxShadow: `0 24px 64px rgba(167,139,250,0.12)`,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1 }}>HOW enSTUDIO WORKS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,3vw,32px)', flexWrap: 'wrap' }}>

            {/* LEFT — P&ID Schematic SVG */}
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 8 }}>INPUT — P&ID DRAWING</div>
              <svg viewBox="0 0 280 200" style={{ width: '100%', height: 'auto', background: 'white', borderRadius: 12, border: `1px solid ${ACCENT}22`, display: 'block' }}>
                {/* Vessel T-101 */}
                <ellipse cx={50} cy={90} rx={26} ry={40} fill="none" stroke={ACCENT} strokeWidth={1.5}/>
                <text x={50} y={142} textAnchor="middle" fontSize={8} fill="#9ca3af" fontFamily="monospace">T-101</text>
                {/* Pipe */}
                <line x1={76} y1={90} x2={115} y2={90} stroke="#374151" strokeWidth={2}/>
                {/* FT circle */}
                <circle cx={96} cy={72} r={14} fill="white" stroke={ACCENT} strokeWidth={1.5}/>
                <text x={96} y={69} textAnchor="middle" fontSize={7} fill={ACCENT} fontWeight="700">FT</text>
                <text x={96} y={79} textAnchor="middle" fontSize={6} fill="#9ca3af">1001</text>
                <line x1={96} y1={86} x2={96} y2={90} stroke="#374151" strokeWidth={1}/>
                {/* Valve */}
                <polygon points="115,83 133,90 115,97" fill="none" stroke="#374151" strokeWidth={1.5}/>
                <polygon points="151,83 133,90 151,97" fill="none" stroke="#374151" strokeWidth={1.5}/>
                <line x1={133} y1={83} x2={133} y2={72} stroke="#374151" strokeWidth={1.5}/>
                {/* Pipe continues */}
                <line x1={151} y1={90} x2={196} y2={90} stroke="#374151" strokeWidth={2}/>
                {/* Vessel V-201 */}
                <rect x={196} y={62} width={40} height={56} rx={5} fill="none" stroke={ACCENT} strokeWidth={1.5}/>
                <text x={216} y={130} textAnchor="middle" fontSize={8} fill="#9ca3af" fontFamily="monospace">V-201</text>
                {/* PT circle */}
                <circle cx={216} cy={50} r={13} fill="white" stroke="#60a5fa" strokeWidth={1.5}/>
                <text x={216} y={47} textAnchor="middle" fontSize={7} fill="#60a5fa" fontWeight="700">PT</text>
                <text x={216} y={57} textAnchor="middle" fontSize={6} fill="#9ca3af">2001</text>
                <line x1={216} y1={63} x2={216} y2={62} stroke="#374151" strokeWidth={1}/>
                {/* TT circle */}
                <line x1={236} y1={90} x2={260} y2={90} stroke="#374151" strokeWidth={2}/>
                <circle cx={248} cy={74} r={13} fill="white" stroke="#34d399" strokeWidth={1.5}/>
                <text x={248} y={71} textAnchor="middle" fontSize={7} fill="#34d399" fontWeight="700">TT</text>
                <text x={248} y={81} textAnchor="middle" fontSize={6} fill="#9ca3af">3001</text>
                <line x1={248} y1={87} x2={248} y2={90} stroke="#374151" strokeWidth={1}/>
                {/* Footer note */}
                <text x={8} y={165} fontSize={7} fill="#d1d5db">Sheet 3 of 14 · Rev.C · 2019</text>
                <text x={8} y={177} fontSize={7} fill="#d1d5db">Scanned PDF · 300 dpi</text>
              </svg>
            </div>

            {/* CENTER arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: ACCENT, letterSpacing: 1, textAlign: 'center' }}>enSTUDIO<br/>AI</div>
              <div style={{ fontSize: 32, color: ACCENT, lineHeight: 1 }}>→</div>
            </div>

            {/* RIGHT — Extracted tags */}
            <div style={{ flex: '1 1 240px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 8 }}>OUTPUT — STRUCTURED MODEL</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { tag: 'FT-1001', type: 'Flow Transmitter',      range: '0–500 m³/h',  conf: 'HIGH', c: '#10b981' },
                  { tag: 'PT-2001', type: 'Pressure Transmitter',   range: '0–10 bar',    conf: 'HIGH', c: '#10b981' },
                  { tag: 'TT-3001', type: 'Temperature Element',    range: '0–200 °C',    conf: 'MED',  c: '#f59e0b' },
                  { tag: 'V-201',   type: 'Vessel',                 range: 'Cap: 12 m³',  conf: 'HIGH', c: '#10b981' },
                ].map((row) => (
                  <div key={row.tag} style={{
                    background: 'white', borderRadius: 9, padding: '8px 12px',
                    border: `1px solid ${ACCENT}22`,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <code style={{ fontSize: 10, fontWeight: 700, color: ACCENT, minWidth: 64, flexShrink: 0 }}>{row.tag}</code>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>{row.type}</div>
                      <div style={{ fontSize: 9, color: '#9ca3af' }}>{row.range}</div>
                    </div>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: row.c + '18', color: row.c, flexShrink: 0 }}>{row.conf}</span>
                  </div>
                ))}
                <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, textAlign: 'right' }}>Exports → VIDS · YMPL · enVIEW</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* ── VISUAL: Before / After comparison ── */}
      <div className="engram-container" style={{ marginBottom: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Before */}
          <div style={{ background: '#f9fafb', borderRadius: 16, border: '1px solid var(--border)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: 1 }}>BEFORE — MANUAL REVIEW</div>
            <svg viewBox="0 0 260 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Stacked document icons */}
              {[0,6,12].map((offset) => (
                <rect key={offset} x={20+offset} y={20+offset} width={80} height={110} rx={4} fill="white" stroke="#d1d5db" strokeWidth={1.2}/>
              ))}
              {/* Lines on doc */}
              {[40,52,64,76,88,100].map((y) => (
                <line key={y} x1={28} y1={y} x2={88} y2={y} stroke="#e5e7eb" strokeWidth={1.5}/>
              ))}
              <text x={32} y={36} fontSize={7} fill="#9ca3af">P&ID-003 Rev.B</text>
              {/* Arrow */}
              <text x={120} y={95} fontSize={28} fill="#d1d5db" textAnchor="middle">↓</text>
              {/* Person icon */}
              <circle cx={200} cy={55} r={16} fill="#e5e7eb"/>
              <text x={200} y={60} fontSize={12} textAnchor="middle">👤</text>
              <rect x={160} y={75} width={80} height={50} rx={4} fill="white" stroke="#d1d5db" strokeWidth={1.2}/>
              {[85,95,105,115].map((y) => (
                <line key={y} x1={168} y1={y} x2={232} y2={y} stroke="#e5e7eb" strokeWidth={1.5}/>
              ))}
              <text x={130} y={145} fontSize={8} fill="#9ca3af" textAnchor="middle">Hours of manual entry per sheet</text>
            </svg>
            <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 600 }}>⏱ 3–8 hours per drawing sheet</div>
          </div>

          {/* After */}
          <div style={{ background: `linear-gradient(135deg,#f5f3ff,#ede9fe)`, borderRadius: 16, border: `1px solid ${ACCENT}44`, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: 1 }}>AFTER — enSTUDIO AI</div>
            <svg viewBox="0 0 260 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Doc icon */}
              <rect x={20} y={20} width={60} height={80} rx={4} fill="white" stroke={ACCENT} strokeWidth={1.2}/>
              {[35,47,59,71].map((y) => (
                <line key={y} x1={28} y1={y} x2={72} y2={y} stroke={ACCENT+'44'} strokeWidth={1.5}/>
              ))}
              {/* Arrow with label */}
              <line x1={85} y1={60} x2={140} y2={60} stroke={ACCENT} strokeWidth={2} markerEnd="url(#arr2)"/>
              <rect x={88} y={44} width={46} height={12} rx={3} fill={ACCENT+'22'}/>
              <text x={111} y={53} fontSize={7} fill={ACCENT} fontWeight="700" textAnchor="middle">AI READS</text>
              {/* Output cards */}
              {[
                { label: 'FT-1001', y: 28, c: ACCENT },
                { label: 'PT-2001', y: 68, c: '#60a5fa' },
                { label: 'TT-3001', y: 108, c: '#34d399' },
              ].map((r) => (
                <g key={r.label}>
                  <rect x={148} y={r.y} width={94} height={28} rx={5} fill="white" stroke={r.c} strokeWidth={1.2}/>
                  <text x={157} y={r.y+12} fontSize={7} fill={r.c} fontWeight="700">{r.label}</text>
                  <circle cx={231} cy={r.y+9} r={7} fill={r.c+'22'}/>
                  <text x={231} y={r.y+13} fontSize={6} fill={r.c} textAnchor="middle">✓</text>
                </g>
              ))}
              <defs>
                <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={ACCENT}/>
                </marker>
              </defs>
              <text x={130} y={155} fontSize={8} fill="#9ca3af" textAnchor="middle">Seconds per sheet, zero re-typing</text>
            </svg>
            <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>⚡ Seconds per drawing sheet</div>
          </div>

        </div>
      </div>

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
        <ScrollStagger className="engram-caps-grid" step={80}>
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
        </ScrollStagger>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Key Capabilities</span>
        <h2 className="engram-section-h2">From Drawing to Validated Configuration</h2>
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
        <h2 className="engram-section-h2">From Raw Drawing to Downstream-Ready</h2>
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

      {/* ── OUTPUT ADAPTERS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Output Adapters</span>
        <h2 className="engram-section-h2">One Model, Every Target System</h2>
        <ScrollStagger className="engram-three-col" step={90}>
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
        </ScrollStagger>
      </section>

      {/* ── SAFETY + LOCAL + BROWNFIELD ── */}
      <section className="engram-section engram-container">
        <ScrollStagger className="engram-three-col" step={90}>

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
        </ScrollStagger>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Outcomes</span>
        <h2 className="engram-section-h2">Drawings Become Living Configuration</h2>
        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 680, marginBottom: 32 }}>
          enSTUDIO collapses the configuration bottleneck. The same project model feeds operator displays and physics simulation, stays in sync through surgical patches, and turns static drawings into a single source of truth for the entire plant lifecycle.
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
          <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EnstudioPage;
