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
        text="Less time hunting for answers, and the reasoning behind every answer stays in the business instead of leaving with the people who knew it."
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

      {/* The case-study section labels its evidence honestly ("Internal
          pilot", "Scenario"). These figures come from the same pilot, so
          they carry the same qualifier — unattributed percentages beside
          attributed case studies read as overclaiming. */}
      <ScrollAnimation>
        <p className="label-text impact-source">
          Measured figures are from our 139-drawing internal pilot. Directional
          outcomes are qualitative.
        </p>
      </ScrollAnimation>
    </div>
  </section>
);

export default BusinessImpact;
