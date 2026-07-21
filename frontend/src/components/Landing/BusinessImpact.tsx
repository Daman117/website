import React from 'react';
import { impacts } from '../../data/v2';
import Icon from '../Icon';
import ScrollAnimation, { ScrollStagger, LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 9: BUSINESS IMPACT
// ─────────────────────────────────────────────────────────────────
const BusinessImpact: React.FC = () => (
  <section id="impact">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Outcomes</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Business Impact" />
      <LineReveal
        as="p"
        className="section-lead"
        text="Industrial buyers purchase outcomes. enxplant shortens the path from a question to a defensible answer — and keeps engineering knowledge in the business."
      />

      <ScrollStagger className="grid-3-compact impact-grid" step={80}>
        {impacts.map((m) => (
          <div key={m.label} className="card impact-card hover-lift">
            <div className="u-flex-between impact-top">
              <span className="impact-stat">{m.stat}</span>
              <span className="impact-icon"><Icon name={m.icon} size={18} strokeWidth={1.8} /></span>
            </div>
            <h3 className="impact-label">{m.label}</h3>
            <p className="body-text-compact impact-detail">{m.detail}</p>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

export default BusinessImpact;
