import React from 'react';
import { pipeNodes } from '../data/platform';

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
            style={{ 
              '--accent2': node.color,
              background: 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(14px) saturate(150%)',
              WebkitBackdropFilter: 'blur(14px) saturate(150%)'
            } as React.CSSProperties}
          >
            <div className="pipe-cap" style={{ color: node.color }}>{node.cap}</div>
            <div className="pipe-sub">{node.label}</div>
            <div className="pipe-desc">{node.sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Platform;
