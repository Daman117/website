import React from 'react';
import { CAPS } from '../../data/caps';
import ScrollAnimation, { ScrollStagger, RevealLines } from '../ScrollAnimation';
import CapCard from './shared/CapCard';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 5: CAPABILITIES (CAP GRID)
// ─────────────────────────────────────────────────────────────────
const CapabilitySection: React.FC = () => (
  <section id="capabilities">
    <div className="cap-head">
      <div>
        <ScrollAnimation>
          <span className="eyebrow">Products</span>
        </ScrollAnimation>
        <RevealLines
          as="h2"
          className="display"
          lines={[{ text: 'Every capability.', className: 'cap-head-bold' }, { text: 'One platform.', className: 'cap-head-light' }]}
        />
      </div>
    </div>
    <ScrollStagger className="cap-grid" step={80}>
      {CAPS.map((cap) => <CapCard key={cap.id} cap={cap} />)}
    </ScrollStagger>
  </section>
);

export default CapabilitySection;
