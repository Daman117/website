import React from 'react';
import { impacts } from '../data/v2';
import Icon from './Icon';

const BusinessImpact: React.FC = () => (
  <section id="impact">
    <div className="section" data-reveal="">
      <span className="eyebrow">Outcomes</span>
      <h2 className="display section-title">Business Impact</h2>
      <p className="section-lead">
        Industrial buyers purchase outcomes. enX shortens the path from a question to a defensible answer — and keeps engineering knowledge in the business.
      </p>

      <div className="impact-grid">
        {impacts.map((m) => (
          <div key={m.label} className="impact-card">
            <div className="impact-top">
              <span className="impact-stat">{m.stat}</span>
              <span className="impact-icon"><Icon name={m.icon} size={18} strokeWidth={1.8} /></span>
            </div>
            <h3 className="impact-label">{m.label}</h3>
            <p className="impact-detail">{m.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BusinessImpact;
