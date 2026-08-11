import React from 'react';
import { archSources, archCaps, archUsers } from '../../data/v2';
import Icon from '../Icon';
import ScrollAnimation, { LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 8: ARCHITECTURE
// ─────────────────────────────────────────────────────────────────
export const ArchitectureSection: React.FC = () => (
  <section id="architecture">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Platform architecture</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="One Platform. Multiple Sources." />
      <LineReveal
        as="p"
        className="section-lead"
        text="Every source of plant data feeds one platform on your own network — and the answers reach every team that needs them."
      />

      <ScrollAnimation delay={150} duration={900} threshold={0.06}>
        <div className="arch-diagram">
          <div className="card arch-band arch-band-sources">
            <div className="u-flex-center arch-band-label"><span className="arch-band-pill">Plant Data Sources</span></div>
            <div className="u-flex u-flex-wrap u-gap-10 u-justify-center arch-source-row">
              {archSources.map((s) => <div key={s} className="label-text arch-source-chip">{s}</div>)}
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

          <div className="card arch-band arch-band-caps">
            <div className="u-flex-center arch-band-label"><span className="arch-band-pill">Capabilities</span></div>
            <div className="u-flex u-flex-wrap u-gap-10 u-justify-center arch-caps-row">
              {archCaps.map((c) => (
                <div
                  key={c.name}
                  className="card-heading-sm arch-cap-chip"
                  style={{ '--accent': c.color } as React.CSSProperties}
                >
                  <span className="arch-cap-dot" />
                  <span className="arch-cap-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="arch-connector" aria-hidden="true">
            <div className="arch-conn-line" /><div className="arch-conn-arrow" />
          </div>

          <div className="card arch-band arch-band-users">
            <div className="u-flex-center arch-band-label"><span className="arch-band-pill">Users</span></div>
            <div className="u-flex u-flex-wrap u-gap-10 u-justify-center arch-users-row">
              {archUsers.map((u) => (
                <div key={u.name} className="label-text arch-user-chip">
                  <Icon name={u.icon} size={15} strokeWidth={1.7} />
                  <span>{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  </section>
);

export default ArchitectureSection;
