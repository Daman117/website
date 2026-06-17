import React from 'react';
import Logo from './Logo';
import { CAPS } from '../data/caps';

interface FooterProps {
  onOpenContact: (source?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenContact: _onOpenContact }) => (
  <div style={{ borderTop: '1px solid var(--border)' }}>
    <footer id="footer">
      <div>
        <div className="foot-logo">
          <div className="nav-mark" style={{ width: '30px', height: '30px' }}>
            <Logo width={18} height={18} />
          </div>
          <div className="nav-word"><span>en</span><span>X</span></div>
        </div>
        <p className="foot-tag">Industrial intelligence capabilities. Built by plant engineers, for plant engineers.</p>
        <p className="foot-copy">© 2026 enSAR Solutions Inc.</p>
      </div>

      <div>
        <p className="foot-title">Products</p>
        {CAPS.map((c) => (
          <div
            key={c.id}
            className="foot-link"
            onClick={() => {}}
            style={{ cursor: 'default' }}
          >
            <div className="foot-dot" style={{ background: c.color }}></div>
            {c.name}
          </div>
        ))}
      </div>

      <div>
        <p className="foot-title">Contact</p>
        <p style={{ fontSize: '13px', color: 'var(--t5)', marginBottom: '6px' }}>Dr. Jagan Mohan Reddy Yeturu</p>
        <p style={{ fontSize: '13px', color: 'var(--t5)', marginBottom: '14px' }}>Founder, enSAR Solutions Inc.</p>
        <a
          href="https://linkedin.com/in/jagan-ensar"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '12px', color: 'var(--primary)', display: 'inline-block', transition: 'opacity .2s' }}
        >
          LinkedIn ↗
        </a>
        <p style={{ fontSize: '12px', color: 'var(--t5)', marginTop: '10px' }}>
          <a
            href="mailto:contact@ensarsolutions.com"
            style={{ color: 'var(--primary)', transition: 'opacity .2s' }}
          >
            contact@ensarsolutions.com
          </a>
        </p>
      </div>
    </footer>
  </div>
);

export default Footer;
