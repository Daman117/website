import React from 'react';
import { industries } from '../../data/v2';
import ScrollAnimation, { ScrollStagger, LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 6: INDUSTRIES
// ─────────────────────────────────────────────────────────────────
const Industries: React.FC = () => (
  <section id="industries">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Where it runs</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Built for Industrial Operations" />
      <LineReveal
        as="p"
        className="section-lead"
        text="enxplant works wherever the plant floor lives in drawings, documents and live process data. Find your industry."
      />

      <ScrollStagger className="ind-grid" step={70}>
        {industries.map((ind) => (
          <div key={ind.id} className="card ind-card hover-scale-sm">
            <div className="ind-img">
              <img className="media-fill" src={ind.img} alt={ind.name} loading="lazy" decoding="async" />
            </div>
            <h3 className="ind-name">{ind.name}</h3>
            <p className="body-text-compact ind-desc">{ind.desc}</p>
            <div className="cluster ind-caps">
              {ind.caps.map((c) => <span key={c} className="ind-cap">{c}</span>)}
            </div>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

export default Industries;
