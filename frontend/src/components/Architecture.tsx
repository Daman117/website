import React from 'react';
import { archSources, archCaps, archUsers } from '../data/v2';
import Icon from './Icon';
import ScrollAnimation from './ScrollAnimation';

const Architecture: React.FC = () => (
  <section id="architecture">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Platform architecture</span>
        <h2 className="display section-title">One Platform. Multiple Sources.</h2>
        <p className="section-lead">
          Every plant data source flows into one local platform, becomes connected intelligence, and reaches every team that needs it.
        </p>
      </ScrollAnimation>

      <ScrollAnimation delay={150} duration={900} threshold={0.06}>
        <div className="arch-diagram">
          <div className="arch-band arch-band-sources">
            <div className="arch-band-label"><span className="arch-band-pill">Plant Data Sources</span></div>
            <div className="arch-source-row">
              {archSources.map((s) => <div key={s} className="arch-source-chip">{s}</div>)}
            </div>
          </div>

          <div className="arch-connector" aria-hidden="true">
            <div className="arch-conn-line" /><div className="arch-conn-arrow" />
          </div>

          <div className="arch-platform-block">
            <div className="arch-platform-inner">
              <div className="arch-platform-logo">
                <span className="arch-platform-en">en</span><span className="arch-platform-x">X</span>
              </div>
              <div className="arch-platform-tagline">Local-first industrial intelligence platform</div>
              <div className="arch-platform-badges">
                <span className="arch-platform-badge">Air-gapped ready</span>
                <span className="arch-platform-badge">On-premises AI</span>
                <span className="arch-platform-badge">No cloud dependency</span>
              </div>
            </div>
          </div>

          <div className="arch-connector" aria-hidden="true">
            <div className="arch-conn-line" /><div className="arch-conn-arrow" />
          </div>

          <div className="arch-band arch-band-caps">
            <div className="arch-band-label"><span className="arch-band-pill">Capabilities</span></div>
            <div className="arch-caps-row">
              {archCaps.map((c) => (
                <div key={c.name} className="arch-cap-chip" style={{ '--accent': c.color, borderBottomColor: c.color } as React.CSSProperties}>
                  <span className="arch-cap-dot" style={{ background: c.color }} />
                  <span className="arch-cap-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="arch-connector" aria-hidden="true">
            <div className="arch-conn-line" /><div className="arch-conn-arrow" />
          </div>

          <div className="arch-band arch-band-users">
            <div className="arch-band-label"><span className="arch-band-pill">Users</span></div>
            <div className="arch-users-row">
              {archUsers.map((u) => (
                <div key={u.name} className="arch-user-chip">
                  <Icon name={u.icon} size={15} strokeWidth={1.7} /><span>{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  </section>
);

export default Architecture;
