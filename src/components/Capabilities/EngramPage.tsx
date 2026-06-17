import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    icon: '⬡',
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
    icon: '◈',
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
    icon: '◎',
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
  { n: '1', title: 'Upload', desc: 'Connect enGRAM to existing repositories, network drives, and engineering document stores.' },
  { n: '2', title: 'Extract', desc: 'AI extracts tags, symbols, text, tables, relationships, and engineering metadata.' },
  { n: '3', title: 'Build Knowledge', desc: 'Information is structured into an interconnected plant knowledge graph.' },
  { n: '4', title: 'Query', desc: 'Engineers ask questions in natural language.' },
  { n: '5', title: 'Generate Answers', desc: 'enGRAM delivers contextual answers based on verified plant records.' },
  { n: '6', title: 'Verify', desc: 'Every response can be traced back to its original source for validation.' },
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
  const navigate = useNavigate();

  return (
    <main className="engram-page">

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
            en<span style={{ color: '#FDB022' }}>GRAM</span>
          </h2>
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
        <div className="engram-caps-grid">
          {capabilities.map((cap) => (
            <div key={cap.title} className="engram-cap-card" style={{ '--cap-color': cap.color } as React.CSSProperties}>
              <div className="engram-cap-icon" style={{ color: cap.color }}>{cap.icon}</div>
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
        <h2 className="engram-section-h2">From Raw Files to Actionable Intelligence</h2>
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

      {/* ── VALIDATION + COMPLIANCE + SECURITY ── */}
      <section className="engram-section engram-container">
        <div className="engram-three-col">

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
            <p style={{ fontSize: 11, color: 'var(--t5)', marginTop: 14, fontStyle: 'italic' }}>
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
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Vision</span>
        <h2 className="engram-section-h2">From Engineering Records to Plant Memory</h2>
        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 680, marginBottom: 32 }}>
          enGRAM transforms engineering information from static documentation into a continuously evolving intelligence system. As more information is added, the system becomes increasingly valuable — creating a long-term institutional memory for the entire facility.
        </p>
        <div className="engram-outcomes-grid">
          {outcomes.map((o, i) => (
            <div key={i} className="engram-outcome-pill">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FDB022', flexShrink: 0 }} />
              <span>{o}</span>
            </div>
          ))}
        </div>
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
