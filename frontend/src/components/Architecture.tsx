import React from 'react';
import { archSources, archCaps, archUsers } from '../data/v2';
import Icon from './Icon';

const Architecture: React.FC = () => (
  <section id="architecture">
    <div className="section" data-reveal="">
      <span className="eyebrow">Platform architecture</span>
      <h2 className="display section-title">One Platform. Multiple Sources.</h2>
      <p className="section-lead">
        Every plant data source flows into one local platform, becomes connected capabilities, and reaches every team that needs it.
      </p>

      <div className="arch">
        <div className="arch-layer">
          <div className="arch-layer-label">Plant data sources</div>
          <div className="arch-row">
            {archSources.map((s) => <span key={s} className="arch-source">{s}</span>)}
          </div>
        </div>

        <div className="arch-flow" aria-hidden="true"><span /></div>

        <div className="arch-platform">
          <span className="arch-platform-mark">enX</span>
          <span className="arch-platform-text">Local-first industrial intelligence platform</span>
        </div>

        <div className="arch-flow" aria-hidden="true"><span /></div>

        <div className="arch-layer">
          <div className="arch-layer-label">Capabilities</div>
          <div className="arch-row">
            {archCaps.map((c) => (
              <span key={c.name} className="arch-cap" style={{ '--accent': c.color } as React.CSSProperties}>
                <span className="arch-cap-dot" style={{ background: c.color }} />{c.name}
              </span>
            ))}
          </div>
        </div>

        <div className="arch-flow" aria-hidden="true"><span /></div>

        <div className="arch-layer">
          <div className="arch-layer-label">Users</div>
          <div className="arch-row">
            {archUsers.map((u) => (
              <span key={u.name} className="arch-user">
                <Icon name={u.icon} size={16} strokeWidth={1.7} />{u.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Architecture;
