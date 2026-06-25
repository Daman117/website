import React from 'react';
import { industries } from '../data/v2';
import Icon from './Icon';
import ScrollAnimation, { ScrollStagger } from './ScrollAnimation';

const Industries: React.FC = () => (
  <section id="industries">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Where it runs</span>
        <h2 className="display section-title">Built for Industrial Operations</h2>
        <p className="section-lead">
          enX works wherever the plant floor lives in drawings, documents and live process data. Find your industry.
        </p>
      </ScrollAnimation>

      <ScrollStagger className="ind-grid" step={70}>
        {industries.map((ind) => (
          <div key={ind.id} className="ind-card hover-scale-sm">
            <div className="ind-icon"><Icon name={ind.icon} size={22} strokeWidth={1.7} /></div>
            <h3 className="ind-name">{ind.name}</h3>
            <p className="ind-desc">{ind.desc}</p>
            <div className="ind-caps">
              {ind.caps.map((c) => <span key={c} className="ind-cap">{c}</span>)}
            </div>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

export default Industries;
