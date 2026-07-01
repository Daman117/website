import React from 'react';
import { Workflow, FileText, Network, Upload, ScanSearch, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import ScrollAnimation, { ScrollStagger } from '../ScrollAnimation';

interface EngramPageProps {
  onOpenContact: (source?: string) => void;
}

const challenges = [
  'Thousands of documents scattered across network drives and repositories',
  'P&IDs and engineering drawings stored as static PDFs',
  'Engineering information disconnected across departments',
  'Time-consuming searches for critical asset information',
  'Loss of institutional knowledge over time',
  'Manual validation and compliance efforts',
];

const existingSolutions = [
  { solution: 'Network Drives & SharePoint', limitation: 'Store files but do not understand engineering relationships' },
  { solution: 'Generic AI Assistants', limitation: 'Struggle with industrial drawings, tags, and technical context' },
  { solution: 'Traditional DMS Platforms', limitation: 'Focus on storage rather than plant intelligence' },
  { solution: 'Cloud-Based Solutions', limitation: 'Often introduce security and compliance concerns' },
];

const capabilities = [
  {
    Icon: Workflow,
    title: 'Diagram Intelligence',
    subtitle: 'Understand the Language of Industrial Drawings',
    desc: 'enGRAM converts static engineering drawings into interactive, searchable plant knowledge.',
    features: [
      'P&ID Digitization – Convert scanned and legacy drawings into intelligent digital assets',
      'Advanced Symbol Recognition – Detect and classify hundreds of ISA-standard symbols',
      'Contextual OCR Extraction – Capture tags, annotations, and engineering metadata',
      'Connectivity Mapping – Understand relationships between instruments, equipment, and processes',
      'Rapid Processing – Analyze complex drawings quickly and accurately',
    ],
    color: '#FDB022',
  },
  {
    Icon: FileText,
    title: 'Document Intelligence',
    subtitle: 'Every Answer Is Grounded and Traceable',
    desc: 'enGRAM extracts engineering knowledge from documents and links it directly to plant assets.',
    features: [
      'Multi-format ingestion for PDF, Word, Excel, text, and engineering documents',
      'Automatic tag extraction and normalization',
      'Equipment-centric knowledge organization',
      'Natural language search and querying',
      'Citation-based answers for engineering confidence',
    ],
    color: '#10B981',
  },
  {
    Icon: Network,
    title: 'Plant Knowledge Graph',
    subtitle: 'Connect Information Across Your Entire Plant',
    desc: 'enGRAM structures extracted information into an interconnected engineering knowledge base.',
    features: [
      'Link documents, drawings, equipment, and tags',
      'Eliminate information silos',
      'Build a searchable digital representation of plant knowledge',
      'Provide context-aware answers across systems and assets',
    ],
    color: '#A78BFA',
  },
];

const steps = [
  { icon: Upload,        title: 'Upload',           desc: 'Connect enGRAM to existing repositories, network drives, and engineering document stores.' },
  { icon: ScanSearch,    title: 'Extract',          desc: 'AI extracts tags, symbols, text, tables, relationships, and engineering metadata.' },
  { icon: Network,       title: 'Build Knowledge',  desc: 'Information is structured into an interconnected plant knowledge graph.' },
  { icon: MessageCircle, title: 'Query',            desc: 'Engineers ask questions in natural language.' },
  { icon: Sparkles,      title: 'Generate Answers', desc: 'enGRAM delivers contextual answers based on verified plant records.' },
  { icon: ShieldCheck,   title: 'Verify',           desc: 'Every response can be traced back to its original source for validation.' },
];

const validationFeatures = [
  'Interactive diagram review tools',
  'AI-assisted correction workflows',
  'Tag verification and discrepancy detection',
  'Revision comparison capabilities',
  'Engineer approval before final publication',
];

const complianceFeatures = [
  'Alignment with industrial standards and engineering practices',
  'Design-to-as-built comparison workflows',
  'Automated compliance verification support',
  'Audit-ready traceability',
  'Full source document references',
];

const securityFeatures = [
  'Fully local deployment',
  'On-premises virtual machine hosting',
  'Air-gapped operation support',
  'No cloud dependency required',
  'Protection of proprietary engineering data',
  'Open deployment architecture without vendor lock-in',
];

const outcomes = [
  'Faster troubleshooting',
  'Reduced engineering search time',
  'Improved knowledge retention',
  'Better operational decision-making',
  'Stronger compliance readiness',
  'Continuous accumulation of plant knowledge',
];

const EngramPage: React.FC<EngramPageProps> = ({ onOpenContact }) => {
  return (
    <main className="engram-page">

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
            en<span style={{ color: '#FDB022' }}>GRAM</span>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="engram-hero engram-container">
        <div className="engram-hero-badge">
          <span style={{ color: '#FDB022', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>PLANT KNOWLEDGE</span>
        </div>
        <h1 className="engram-hero-h1">
          Turn Engineering Records Into<br />
          <span style={{ color: '#FDB022' }}>Plant Knowledge</span>
        </h1>
        <p className="engram-hero-sub">
          enGRAM transforms static engineering documents, drawings, and records into a living, searchable knowledge system built specifically for industrial plants.
        </p>
        <p className="engram-hero-body">
          Engineering information is often trapped inside PDFs, scanned drawings, spreadsheets, manuals, and disconnected repositories. enGRAM extracts, connects, and structures that information into a plant-wide intelligence layer that engineers can query, validate, and trust.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Pilot')}>
            Request a Demo
          </button>
        </div>
      </section>

      {/* ── VISUAL: Documents → enGRAM → Cited Answer ── */}
      <div className="engram-container" style={{ marginBottom: 48 }}>
        <div style={{
          background: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)',
          border: '1px solid #FDB02233',
          borderRadius: 20,
          padding: 'clamp(20px,4vw,48px)',
          boxShadow: '0 24px 64px rgba(253,176,34,0.10)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#FDB022', letterSpacing: 1 }}>HOW enGRAM WORKS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,3vw,28px)', flexWrap: 'wrap' }}>

            {/* LEFT — Document sources */}
            <div style={{ flex: '1 1 180px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 10 }}>INPUT — PLANT DOCUMENTS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'P&ID-003.pdf',          icon: '📄', color: '#FDB022' },
                  { label: 'SIS-SOP-Rev4.docx',     icon: '📋', color: '#60a5fa' },
                  { label: 'Instrument Datasheet',  icon: '📊', color: '#34d399' },
                  { label: 'Maintenance Manual',    icon: '🔧', color: '#f472b6' },
                ].map((d) => (
                  <div key={d.label} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'white', borderRadius: 8, padding: '7px 10px',
                    border: '1px solid #f3f4f6', fontSize: 11,
                  }}>
                    <span style={{ fontSize: 14 }}>{d.icon}</span>
                    <span style={{ color: '#374151', fontWeight: 500, flex: 1, fontSize: 10 }}>{d.label}</span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: d.color, flexShrink: 0 }}/>
                  </div>
                ))}
              </div>
            </div>

            {/* ARROW 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#FDB022', letterSpacing: 1, textAlign: 'center' }}>enGRAM<br/>INDEXES</div>
              <div style={{ fontSize: 28, color: '#FDB022', lineHeight: 1 }}>→</div>
            </div>

            {/* CENTER — Knowledge graph */}
            <div style={{ flex: '1 1 180px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 10 }}>KNOWLEDGE GRAPH</div>
              <svg viewBox="0 0 180 150" style={{ width: '100%', height: 'auto', background: 'white', borderRadius: 12, border: '1px solid #FDB02222', display: 'block' }}>
                {/* Central node */}
                <circle cx={90} cy={75} r={22} fill="#FDB02222" stroke="#FDB022" strokeWidth={2}/>
                <text x={90} y={71} textAnchor="middle" fontSize={7} fill="#b45309" fontWeight="700">Plant</text>
                <text x={90} y={81} textAnchor="middle" fontSize={7} fill="#b45309" fontWeight="700">Knowledge</text>
                {/* Satellite nodes */}
                {[
                  { cx: 35,  cy: 35,  label: 'FT-1001', c: '#FDB022' },
                  { cx: 150, cy: 30,  label: 'P-201',   c: '#60a5fa' },
                  { cx: 25,  cy: 120, label: 'SOP-14',  c: '#34d399' },
                  { cx: 155, cy: 118, label: 'Alarm',   c: '#f472b6' },
                ].map((n) => (
                  <g key={n.label}>
                    <line x1={90} y1={75} x2={n.cx} y2={n.cy} stroke={n.c+'66'} strokeWidth={1.5} strokeDasharray="3,2"/>
                    <circle cx={n.cx} cy={n.cy} r={16} fill="white" stroke={n.c} strokeWidth={1.5}/>
                    <text x={n.cx} y={n.cy+3} textAnchor="middle" fontSize={6.5} fill={n.c} fontWeight="700">{n.label}</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* ARROW 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#FDB022', letterSpacing: 1, textAlign: 'center' }}>CITED<br/>ANSWER</div>
              <div style={{ fontSize: 28, color: '#FDB022', lineHeight: 1 }}>→</div>
            </div>

            {/* RIGHT — Cited answer output */}
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 10 }}>OUTPUT — INSTANT ANSWER</div>
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #FDB02233', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: '#f9fafb', borderRadius: 7, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: '#9ca3af', marginBottom: 4 }}>Q: What is the max operating pressure of V-201?</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                    The maximum operating pressure for <strong>V-201</strong> is <strong style={{ color: '#FDB022' }}>12.4 bar</strong>, with a design pressure of 15 bar.
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {['P&ID-003, Sheet 7', 'Datasheet DS-201'].map((src) => (
                      <span key={src} style={{ fontSize: 9, background: '#FDB02218', color: '#b45309', padding: '2px 7px', borderRadius: 5, border: '1px solid #FDB02233', fontWeight: 600 }}>
                        📎 {src}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 9, color: '#9ca3af', borderTop: '1px solid #f3f4f6', paddingTop: 6 }}>Confidence: 94% · Sources indexed: 4 documents</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Overview</span>
        <h2 className="engram-section-h2">Plant Knowledge, Built for Engineers</h2>
        <div className="engram-overview-grid">
          <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85 }}>
            enGRAM is the Plant Intelligence Platform for instrumentation, process, and operations teams. Instead of organizing information by folders and files, enGRAM organizes knowledge around the assets that matter most — equipment tags, instruments, systems, and engineering relationships.
          </p>
          <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85 }}>
            By combining diagram intelligence, document intelligence, and AI-powered knowledge extraction, enGRAM turns decades of engineering records into a continuously growing source of operational intelligence.
          </p>
        </div>
      </section>

      {/* ── CHALLENGE ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <h2 className="engram-section-h2">The Hidden Cost of Industrial Knowledge</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32 }}>
          Industrial facilities generate enormous amounts of engineering data, but critical knowledge remains difficult to access.
        </p>

        <div className="engram-two-col">
          {/* Challenges list */}
          <div className="engram-card">
            <h3 className="engram-card-title">Common Challenges</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {challenges.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FDB022', marginTop: 8, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.7 }}>{c}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--t5)', marginTop: 20, fontStyle: 'italic' }}>
              Engineers spend valuable time locating information instead of solving operational problems.
            </p>
          </div>

          {/* Comparison table */}
          <div className="engram-card">
            <h3 className="engram-card-title">Why Existing Solutions Fall Short</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              Traditional document repositories and generic AI tools are not designed for industrial engineering environments.
            </p>
            <table className="engram-table">
              <thead>
                <tr>
                  <th>Solution</th>
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
              enGRAM was built specifically for industrial engineering data, diagrams, and workflows.
            </p>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Key Capabilities</span>
        <h2 className="engram-section-h2">Three Layers of Plant Intelligence</h2>
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
        <h2 className="engram-section-h2">From Raw Files to Actionable Intelligence</h2>
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

      {/* ── VALIDATION + COMPLIANCE + SECURITY ── */}
      <section className="engram-section engram-container">
        <ScrollStagger className="engram-three-col" step={90}>

          {/* Human in the Loop */}
          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block' }}>Human-in-the-Loop</span>
            <h3 className="engram-card-title">Engineers Stay in Control</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              enGRAM is designed to augment engineering teams — not replace them.
            </p>
            {validationFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
            <p style={{ fontSize: 12, color: 'var(--t5)', marginTop: 14, fontStyle: 'italic' }}>
              Every critical decision remains under human oversight.
            </p>
          </div>

          {/* Compliance */}
          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block' }}>Compliance</span>
            <h3 className="engram-card-title">Built for Regulated Environments</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              enGRAM supports engineering governance, standards compliance, and operational assurance.
            </p>
            {complianceFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563EB', marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="engram-card" style={{ borderColor: 'rgba(253,176,34,0.25)' }}>
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block', color: '#FDB022' }}>Industrial Security</span>
            <h3 className="engram-card-title">Your Data Never Leaves Your Plant</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              Security is a core design principle of enGRAM.
            </p>
            {securityFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FDB022', marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>
        </ScrollStagger>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Vision</span>
        <h2 className="engram-section-h2">From Engineering Records to Plant Memory</h2>
        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 680, marginBottom: 32 }}>
          enGRAM transforms engineering information from static documentation into a continuously evolving intelligence system. As more information is added, the system becomes increasingly valuable — creating a long-term institutional memory for the entire facility.
        </p>
        <ScrollStagger className="engram-outcomes-grid" step={50}>
          {outcomes.map((o, i) => (
            <div key={i} className="engram-outcome-pill">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FDB022', flexShrink: 0 }} />
              <span>{o}</span>
            </div>
          ))}
        </ScrollStagger>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Pilot')}>
            Request a Pilot →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EngramPage;
