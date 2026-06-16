import React from 'react';
import { facts } from '../data/company';

const Company: React.FC = () => (
  <section id="company">
    <div className="section">
      <div className="company-grid">
        <div>
          <span className="eyebrow">About</span>
          <h2 className="company-h">Built because<br/>it needed to exist.</h2>
          <p className="company-p">
            enX is a division of enSAR Solutions Inc. — a global digital transformation company. The industrial intelligence work grew from a different frustration than most software: a practicing I&amp;C engineer who couldn't find the answer he needed fast enough when it mattered.
          </p>
          <p className="company-p">
            The existing tools required data migration, cloud connectivity, vendor relationships, and IT projects. They produced dashboards nobody used and answers engineers didn't trust. So the software was built from scratch.
          </p>
          <blockquote className="quote">
            "Grounded in how plant engineers actually think, how engineering documents are actually structured, and what an engineer needs when something goes wrong at 2AM."
          </blockquote>
          <p className="attr">Dr. Jagan Mohan Reddy Yeturu · Founder, enSAR Solutions Inc.</p>
        </div>
        <div>
          <div>
            {facts.map((f) => (
              <div key={f.k} className="fact-row">
                <span className="fact-key">{f.k}</span>
                <span className="fact-val">{f.v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '18px 20px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <p style={{ fontSize: '10px', color: 'var(--t5)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
              enSAR Solutions also serves
            </p>
            <p style={{ fontSize: '13px', color: 'var(--t4)', lineHeight: '1.8' }}>
              Digital transformation · Cloud native solutions · Software engineering · Cybersecurity · Business applications
            </p>
            <a
              href="https://ensarsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: '10px', fontSize: '12px', color: 'var(--primary)', display: 'inline-block', transition: 'opacity .2s' }}
            >
              ensarsolutions.com ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Company;
