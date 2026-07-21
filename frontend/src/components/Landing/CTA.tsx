import React from 'react';
import ScrollAnimation, { LineReveal, RevealLines } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 14: CTA
// ─────────────────────────────────────────────────────────────────
const CTA: React.FC<{ onOpenContact: (src?: string) => void }> = ({ onOpenContact }) => (
  <section id="cta">
    <div className="cta-glow" />
    <ScrollAnimation threshold={0.2}>
      <div className="cta-panel">
        <span className="eyebrow">Start here</span>
        <RevealLines as="h2" className="cta-h" lines={['Your plant.', 'Your documents.', '90 days.']} />
        <LineReveal
          as="p"
          className="cta-p"
          text="No vendor inside your network. No data leaving your plant. At 90 days you'll know exactly what changed."
        />
        <div className="cta-btns">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Book a Demo')}>Book a Demo →</button>
          <button className="button-text btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
        </div>
        <div className="cta-paths">
          <button className="cta-path" onClick={() => onOpenContact('Talk to Engineering Team')}>Talk to Engineering Team</button>
          <span className="cta-path-sep" aria-hidden="true">·</span>
          <button className="cta-path" onClick={() => onOpenContact('Technical Overview')}>Request Technical Overview</button>
          <span className="cta-path-sep" aria-hidden="true">·</span>
          <button className="cta-path" onClick={() => onOpenContact('Waitlist')}>Join Waitlist</button>
        </div>
      </div>
    </ScrollAnimation>
  </section>
);

export default CTA;
