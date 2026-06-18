import React, { useState, useEffect } from 'react';
import { CAPS } from '../../data/caps';
import type { Cap } from '../../types';

interface CapModalProps {
  capId: string | null;
  onClose: () => void;
  onOpenContact: (source?: string) => void;
}

const PerfRight: React.FC<{ cap: Cap }> = ({ cap: _cap }) => (
  <div>
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

const CapModal: React.FC<CapModalProps> = ({ capId, onClose, onOpenContact }) => {
  const [activeTab, setActiveTab] = useState(0);
  const cap = capId ? CAPS.find((c) => c.id === capId) : null;

  useEffect(() => {
    setActiveTab(0);
  }, [capId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (capId) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [capId, onClose]);

  if (!cap) return null;

  return (
    <div
      className={`cap-modal-overlay ${capId ? 'open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="cap-modal-panel">
        <div className="cap-modal-topbar">
          <button className="cap-modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="cap-modal-body">
          <div className="cap-modal-header">
            <div className="cap-modal-name-group">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cap.color, flexShrink: 0 }}></div>
              <span className="cap-modal-name">{cap.name}</span>
            </div>
            <span
              className="badge"
              style={{ color: cap.color, background: `${cap.color}18`, borderColor: `${cap.color}55` }}
            >
              {cap.status}
            </span>
          </div>
          <div className="cap-modal-cat">{cap.cat}</div>

          {cap.zerod && (
            <div className="zerod-strip">
              <div className="zerod-item">
                <div className="zerod-dot"></div>
                <span className="zerod-text">Zero-day OPC-UA connectivity</span>
              </div>
              <div className="zerod-item">
                <div className="zerod-dot"></div>
                <span className="zerod-text">Native Apple Silicon</span>
              </div>
              <div className="zerod-item">
                <div className="zerod-dot"></div>
                <span className="zerod-text">No cloud dependency</span>
              </div>
            </div>
          )}

          {cap.airgap && (
            <div className="airgap-strip">
              <div className="zerod-item">
                <div className="zerod-dot"></div>
                <span className="zerod-text">Air-gap ready</span>
              </div>
              <div className="zerod-item">
                <div className="zerod-dot"></div>
                <span className="zerod-text">Local AI only — no internet</span>
              </div>
              <div className="zerod-item">
                <div className="zerod-dot"></div>
                <span className="zerod-text">Three input channels, one output format</span>
              </div>
            </div>
          )}

          {cap.patent && (
            <div className="zerod-strip">
              <div className="zerod-item">
                <div className="zerod-dot" style={{ background: '#A5B4FC' }}></div>
                <span className="zerod-text">Patent-pending matrix M methodology</span>
              </div>
              <div className="zerod-item">
                <div className="zerod-dot" style={{ background: '#A5B4FC' }}></div>
                <span className="zerod-text">Analytical (not simulation)</span>
              </div>
            </div>
          )}

          <div className="acc-content" style={{ paddingTop: '24px' }}>
            <div>
              <p style={{ fontSize: '14px', color: 'var(--t3)', lineHeight: '1.8', marginBottom: cap.body2 ? '16px' : '24px' }}>
                {cap.body}
              </p>
              {cap.body2 && (
                <p style={{ fontSize: '13px', color: 'var(--t4)', lineHeight: '1.8', marginBottom: '24px' }}>
                  {cap.body2}
                </p>
              )}

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

            <div>
              {cap.right === 'perf'
                ? <PerfRight cap={cap} />
                : <SpecsRight cap={cap} onOpenContact={onOpenContact} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapModal;
