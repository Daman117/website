import React from 'react';
import { founder, standards, techStack } from '../data/v2';
import Icon from './Icon';

const Trust: React.FC = () => (
  <section id="trust">
    <div className="section" data-reveal="">
      <span className="eyebrow">Credibility</span>
      <h2 className="display section-title">Built by Engineers</h2>
      <p className="section-lead">
        Not a startup chasing a demo. enX comes from real plant work, real standards, and a technology stack built for the security perimeter.
      </p>

      <div className="trust-grid">
        {/* Founder */}
        <div className="trust-founder">
          <div className="trust-founder-head">
            <div className="trust-avatar" aria-hidden="true">JY</div>
            <div>
              <h3 className="trust-founder-name">{founder.name}</h3>
              <p className="trust-founder-role">{founder.role}</p>
              <p className="trust-founder-bg">{founder.background}</p>
            </div>
          </div>
          <blockquote className="trust-quote">{founder.bio}</blockquote>
          <div className="trust-facts">
            {founder.facts.map((f) => (
              <div key={f.k} className="trust-fact">
                <span className="trust-fact-k">{f.k}</span>
                <span className="trust-fact-v">{f.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Standards + tech */}
        <div className="trust-side">
          <div className="trust-panel">
            <p className="trust-panel-title">Engineering standards</p>
            <div className="trust-std-list">
              {standards.map((s) => (
                <div key={s.code} className="trust-std">
                  <span className="trust-std-code mono">{s.code}</span>
                  <span className="trust-std-desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="trust-panel">
            <p className="trust-panel-title">Technology stack</p>
            <div className="trust-tech-row">
              {techStack.map((t) => (
                <span key={t.name} className="trust-tech">
                  <Icon name={t.icon} size={15} strokeWidth={1.8} />{t.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Trust;
