import React from 'react';
import { pipeNodes } from '../data/platform';
import ScrollAnimation, { ScrollStagger } from './ScrollAnimation';

const Platform: React.FC = () => (
  <section id="platform">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Platform</span>
        <h2 className="display" style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: '52px' }}>
          How capabilities connect
        </h2>
      </ScrollAnimation>

      <ScrollStagger className="platform-grid" step={90}>
        {pipeNodes.map((node) => (
          <div
            key={node.cap}
            className="pipe-node hover-lift"
            style={{
              '--accent2': node.color,
              background: 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(14px) saturate(150%)',
              WebkitBackdropFilter: 'blur(14px) saturate(150%)',
            } as React.CSSProperties}
          >
            <div className="pipe-cap" style={{ color: node.color }}>{node.cap}</div>
            <div className="pipe-sub">{node.label}</div>
            <div className="pipe-desc">{node.sub}</div>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

export default Platform;
