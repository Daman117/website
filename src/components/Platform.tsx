import React from 'react';
import { pipeNodes, pills } from '../data/platform';

const Platform: React.FC = () => (
  <section id="platform">
    <div className="section" data-reveal="">
      <span className="eyebrow">Platform</span>
      <h2 className="display" style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: '52px' }}>
        How capabilities connect
      </h2>

      <div className="platform-grid">
        {pipeNodes.map((node) => (
          <div
            key={node.cap}
            className="pipe-node"
            style={{ '--accent2': node.color } as React.CSSProperties}
          >
            <div className="pipe-cap" style={{ color: node.color }}>{node.cap}</div>
            <div className="pipe-sub">{node.label}</div>
            <div className="pipe-desc">{node.sub}</div>
          </div>
        ))}

        {/* spacer + pills centered in row 2 */}
        <div className="pipe-spacer" />
        {pills.map((pill) => (
          <div
            key={pill.name}
            className="pipe-node pipe-pill"
            style={{ '--accent2': pill.dot } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
              <div className="pill-dot" style={{ background: pill.dot, width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 }}></div>
              <div className="pipe-sub" style={{ margin: 0 }}>{pill.name}</div>
            </div>
            <div className="pipe-desc">{pill.desc}</div>
          </div>
        ))}
        <div className="pipe-spacer" />
      </div>
    </div>
  </section>
);

export default Platform;
