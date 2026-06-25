import React from 'react';
import { securityPrinciples } from '../data/v2';
import Icon from './Icon';
import ScrollAnimation, { ScrollStagger } from './ScrollAnimation';

const Security: React.FC = () => (
  <section id="security">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Security &amp; deployment</span>
        <h2 className="display section-title">Security by Design</h2>
        <p className="section-lead">
          enX is built to run where the network never leaves the fence line. No cloud, no external calls, no vendor inside your perimeter.
        </p>
      </ScrollAnimation>

      <ScrollStagger className="sec-grid" step={90}>
        {securityPrinciples.map((p) => (
          <div key={p.title} className="sec-card hover-lift">
            <div className="sec-icon"><Icon name={p.icon} size={20} strokeWidth={1.7} /></div>
            <h3 className="sec-title">{p.title}</h3>
            <p className="sec-desc">{p.desc}</p>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

export default Security;
