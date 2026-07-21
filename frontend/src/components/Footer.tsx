import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe } from 'lucide-react';
import Logo from './Logo';
import { LineReveal, ScrollStagger } from './ScrollAnimation';

interface FooterProps {
  onOpenContact: (source?: string) => void;
}

const LinkedInIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const products = [
  { id: 'enview', name: 'enVIEW' },
  { id: 'engram', name: 'enGRAM' },
  { id: 'enstudio', name: 'enSTUDIO' },
  { id: 'enable', name: 'enABLE' },
  { id: 'engenie', name: 'enGENIE' },
  { id: 'entie', name: 'enTIE' },
];

// Hash links go through the router (/#section) so they work from any page —
// PageScrollManager scrolls to the section once home has rendered.
const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Platform', to: '/#platform' },
  { label: 'Principles', to: '/#principles' },
];

const Footer: React.FC<FooterProps> = ({ onOpenContact }) => (
  <footer id="footer">
    <div className="footer-grid">
      {/* Brand */}
      <div>
        <div className="foot-logo">
          <div className="u-flex-center nav-mark">
            <Logo />
          </div>
          <div className="nav-word"><span>en</span><span>xplant</span></div>
        </div>
        <LineReveal
          as="p"
          className="body-text foot-tag"
          text="Industrial intelligence capabilities for the plant floor. Built by plant engineers, for plant engineers — local, open, and connected."
        />
      </div>

      {/* Products */}
      <div>
        <LineReveal as="p" className="foot-title" text="Products" />
        <ScrollStagger step={60} duration={550}>
          {products.map((p) => (
            <Link key={p.id} className="btn-reset foot-link" to={`/products/${p.id}`}>{p.name}</Link>
          ))}
        </ScrollStagger>
      </div>

      {/* Company */}
      <div>
        <LineReveal as="p" className="foot-title" text="Company" />
        <ScrollStagger step={60} duration={550}>
          {companyLinks.map((l) => (
            <Link key={l.label} className="btn-reset foot-link" to={l.to}>{l.label}</Link>
          ))}
          <button className="btn-reset foot-link" onClick={() => onOpenContact('Footer')}>Contact Us</button>
        </ScrollStagger>
      </div>

      {/* Resources */}
      <div>
        <LineReveal as="p" className="foot-title" text="Resources" />
        <ScrollStagger step={60} duration={550}>
          <Link className="btn-reset foot-link" to="/#resources">Resource Center</Link>
          <button className="btn-reset foot-link" onClick={() => onOpenContact('Documentation')}>Documentation</button>
          <button className="btn-reset foot-link" onClick={() => onOpenContact('Support')}>Support</button>
        </ScrollStagger>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="foot-bottom">
      <span className="foot-copy">© 2026 enSAR Solutions Inc. All rights reserved.</span>
      <div className="foot-social">
        <a href="https://linkedin.com/in/jagan-ensar" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
        <a href="mailto:contact@ensarsolutions.com" aria-label="Email">
          <Mail size={17} strokeWidth={1.75} />
        </a>
        <a href="https://ensarsolutions.com" target="_blank" rel="noopener noreferrer" aria-label="Website">
          <Globe size={17} strokeWidth={1.75} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
