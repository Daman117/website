import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CAPS } from '../../data/caps';
import { productExtras } from '../../data/v2';
import type { Cap } from '../../types';

const ProductExtras: React.FC<{ cap: Cap }> = ({ cap }) => {
  const extra = productExtras[cap.id];
  if (!extra) return null;
  return (
    <div className="pp-extras">
      {/* Capability diagram: Inputs → Processing → Outputs */}
      <div className="pp-block">
        <h2 className="pp-block-title">How it works</h2>
        <div className="pp-flow">
          {(['inputs', 'processing', 'outputs'] as const).map((k, i) => (
            <React.Fragment key={k}>
              <div className="pp-flow-col">
                <div className="pp-flow-label">{k === 'inputs' ? 'Inputs' : k === 'processing' ? 'Processing' : 'Outputs'}</div>
                <ul className="pp-flow-list">
                  {extra.flow[k].map((item) => (
                    <li key={item} style={k === 'outputs' ? { color: cap.color } : undefined}>{item}</li>
                  ))}
                </ul>
              </div>
              {i < 2 && <div className="pp-flow-arrow" style={{ color: cap.color }} aria-hidden="true">→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Use cases by role */}
      <div className="pp-block">
        <h2 className="pp-block-title">Use cases</h2>
        <div className="pp-uc-grid">
          {extra.useCases.map((u) => (
            <div key={u.role} className="pp-uc">
              <span className="pp-uc-role" style={{ color: cap.color }}>{u.role}</span>
              <p className="pp-uc-text">{u.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expected outcomes */}
      <div className="pp-block">
        <h2 className="pp-block-title">Expected outcomes</h2>
        <ul className="pp-outcomes">
          {extra.outcomes.map((o) => (
            <li key={o}><span style={{ color: cap.color }}>✓</span>{o}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface ProductPageProps {
  onOpenContact: (source?: string) => void;
}

const PerfRight: React.FC<{ cap: Cap }> = () => (
  <div>
    <div className="perf-table-wrap">
    <table className="perf-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th className="ours">enVIEW</th>
          <th>Incumbent</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Startup time</td><td className="ours">&lt;2s</td><td className="theirs">30–60s</td></tr>
        <tr><td>Memory (700 tags)</td><td className="ours">&lt;500MB</td><td className="theirs">2–4GB+</td></tr>
        <tr><td>CPU (M2, 1Hz scan)</td><td className="ours">&lt;15%</td><td className="theirs">30–50%+</td></tr>
        <tr><td>Tag latency</td><td className="ours">&lt;100ms</td><td className="theirs">200–500ms</td></tr>
        <tr><td>Installer size</td><td className="ours">~50MB</td><td className="theirs">GB-scale</td></tr>
        <tr><td>Licensing</td><td className="ours">from $2,500</td><td className="theirs">$100K+</td></tr>
      </tbody>
    </table>
    </div>
    <div className="price-grid">
      <div className="price-card">
        <div className="price-tier">Starter</div>
        <div className="price-amt">$2,500</div>
        <div className="price-tags">Up to 100 tags</div>
        <div className="price-feats">P&amp;ID + DCS · Alarms · Historian · CLI</div>
      </div>
      <div className="price-card featured">
        <div className="price-tier ours">Professional</div>
        <div className="price-amt">$5,000</div>
        <div className="price-tags">Up to 500 tags</div>
        <div className="price-feats">All views + 3D · Batch · AI assistant</div>
      </div>
      <div className="price-card">
        <div className="price-tier">Enterprise</div>
        <div className="price-amt">$10,000</div>
        <div className="price-tags">Up to 2,000 tags</div>
        <div className="price-feats">Multi-project · Priority support</div>
      </div>
    </div>
    <p style={{ fontSize: '10px', color: 'var(--t5)', lineHeight: '1.6' }}>
      Unlimited screens · unlimited operator clients · no per-seat fees · no annual maintenance.
    </p>
  </div>
);

const SpecsRight: React.FC<{ cap: Cap; onOpenContact: (src?: string) => void }> = ({ cap, onOpenContact }) => {
  const specs = cap.specs || [];
  const label = cap.id === 'engram' ? 'Request Pilot →'
    : cap.id === 'enable' ? 'Join Waitlist →'
    : cap.id === 'entie' ? 'Learn More →'
    : 'Request Demo →';
  const src = cap.id === 'engram' ? 'Request a Pilot' : cap.id === 'enable' ? 'Waitlist' : '';

  return (
    <div>
      <div className="spec-grid">
        {specs.map((s) => (
          <div key={s.l} className="spec-cell">
            <div className="spec-label">{s.l}</div>
            <div className="spec-val" style={{ color: cap.color }}>{s.v}</div>
          </div>
        ))}
      </div>
      <button className="acc-action-btn" onClick={() => onOpenContact(src)}>
        {label}
      </button>
    </div>
  );
};

const ProductPage: React.FC<ProductPageProps> = ({ onOpenContact }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const cap = CAPS.find((c) => c.id === id);

  if (!cap) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center', color: 'var(--t2)' }}>
        <p>Product not found.</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <main className="product-page">
        <div className="product-page-inner">
          {/* Header */}
          <div className="product-page-header">
            <div className="product-page-title-row">
              <div className="cap-card-dot" style={{ background: cap.color, width: 14, height: 14 }} />
              <h1 className="product-page-name">{cap.name}</h1>
            </div>
            <div className="product-page-cat">{cap.cat}</div>
            <p className="product-page-tag">{cap.tag}</p>
          </div>

          {/* Feature strips */}
          {cap.zerod && (
            <div className="zerod-strip">
              <div className="zerod-item"><div className="zerod-dot" /><span className="zerod-text">Zero-day OPC-UA connectivity</span></div>
              <div className="zerod-item"><div className="zerod-dot" /><span className="zerod-text">Native Apple Silicon</span></div>
              <div className="zerod-item"><div className="zerod-dot" /><span className="zerod-text">No cloud dependency</span></div>
            </div>
          )}
          {cap.airgap && (
            <div className="airgap-strip">
              <div className="zerod-item"><div className="zerod-dot" /><span className="zerod-text">Air-gap ready</span></div>
              <div className="zerod-item"><div className="zerod-dot" /><span className="zerod-text">Local AI only — no internet</span></div>
              <div className="zerod-item"><div className="zerod-dot" /><span className="zerod-text">Three input channels, one output format</span></div>
            </div>
          )}
          {cap.patent && (
            <div className="zerod-strip">
              <div className="zerod-item"><div className="zerod-dot" style={{ background: '#A5B4FC' }} /><span className="zerod-text">Patent-pending matrix M methodology</span></div>
              <div className="zerod-item"><div className="zerod-dot" style={{ background: '#A5B4FC' }} /><span className="zerod-text">Analytical verdict + live closed-loop simulation</span></div>
              <div className="zerod-item"><div className="zerod-dot" style={{ background: '#A5B4FC' }} /><span className="zerod-text">Eigenvalue-based · computed live on every build</span></div>
            </div>
          )}

          {/* Body + right panel */}
          <div className="product-page-content">
            <div className="product-page-left">
              <p style={{ fontSize: '15px', color: 'var(--t3)', lineHeight: '1.85', marginBottom: cap.body2 ? '16px' : '28px' }}>
                {cap.body}
              </p>
              {cap.body2 && (
                <p style={{ fontSize: '14px', color: 'var(--t4)', lineHeight: '1.8', marginBottom: '28px' }}>
                  {cap.body2}
                </p>
              )}

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {cap.tabs.map((tab, i) => (
                  <button
                    key={i}
                    className={`acc-tab-btn${activeTab === i ? ' active' : ''}`}
                    style={activeTab === i ? {
                      '--tab-color': cap.color,
                      '--tab-border': `${cap.color}80`,
                      '--tab-bg': `${cap.color}18`,
                    } as React.CSSProperties : {}}
                    onClick={() => setActiveTab(i)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '18px 20px', minHeight: '200px' }}
                dangerouslySetInnerHTML={{ __html: cap.tabs[activeTab].content }}
              />
            </div>

            <div className="product-page-right">
              {cap.right === 'perf'
                ? <PerfRight cap={cap} />
                : <SpecsRight cap={cap} onOpenContact={onOpenContact} />
              }
            </div>
          </div>

          <ProductExtras cap={cap} />
        </div>
      </main>
    </>
  );
};

export default ProductPage;
