import React from 'react';
import { resources } from '../../data/v2';
import Icon from '../Icon';
import ScrollAnimation, { ScrollStagger, LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 12: RESOURCES
// ─────────────────────────────────────────────────────────────────
const Resources: React.FC<{ onOpenContact: (src?: string) => void }> = ({ onOpenContact }) => (
  <section id="resources">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Resource center</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Resources" />
      <LineReveal
        as="p"
        className="section-lead"
        text="Whitepapers, technical notes, product briefs and deployment guides. Request any resource and we'll send it over."
      />

      <ScrollStagger className="grid-3-compact res-grid" step={80}>
        {resources.map((r) => (
          <button
            key={r.title}
            className="card res-card hover-lift"
            onClick={() => onOpenContact(`Resource: ${r.title}`)}
          >
            <div className="res-img-wrap">
              <img className="media-fill res-img" src={r.img} alt={r.title} loading="lazy" decoding="async" />
              <span className="tag-text res-type">{r.type}</span>
            </div>
            <div className="res-body">
              <div className="res-icon"><Icon name={r.icon} size={16} strokeWidth={1.8} /></div>
              <h3 className="res-title">{r.title}</h3>
              <p className="res-desc">{r.desc}</p>
              <span className="res-link">Request →</span>
            </div>
          </button>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

export default Resources;
