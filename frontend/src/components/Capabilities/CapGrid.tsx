import React from 'react';
import { CAPS } from '../../data/caps';
import CapCard from './CapCard';
import ScrollAnimation, { ScrollStagger } from '../ScrollAnimation';

const CapGrid: React.FC = () => (
  <section id="capabilities">
    <div className="cap-head">
      <ScrollAnimation>
        <span className="eyebrow">Products</span>
        <h2 className="display">Every capability.<br /><span>One platform.</span></h2>
      </ScrollAnimation>
    </div>
    <ScrollStagger className="cap-grid" step={80}>
      {CAPS.map((cap) => (
        <CapCard key={cap.id} cap={cap} />
      ))}
    </ScrollStagger>
  </section>
);

export default CapGrid;
