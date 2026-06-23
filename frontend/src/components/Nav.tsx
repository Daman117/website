import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { useNavScroll } from '../hooks/useNavScroll';

interface NavProps {
  onOpenMobile: () => void;
  onOpenContact: (source?: string) => void;
}

const PRODUCTS = [
  { id: 'enview',   name: 'enVIEW',   cat: 'SCADA / Live Process Intelligence' },
  { id: 'engram',   name: 'enGRAM',   cat: 'Plant Knowledge' },
  { id: 'enstudio', name: 'enSTUDIO', cat: 'Drawing Intelligence' },
  { id: 'enable',   name: 'enABLE',   cat: 'Process Intelligence for Design & Control' },
  { id: 'engenie',  name: 'enGENIE',  cat: 'Instrument Engineering Intelligence' },
  { id: 'entie',    name: 'enTIE',    cat: 'Connected Intelligence' },
];

const Nav: React.FC<NavProps> = ({ onOpenMobile, onOpenContact }) => {
  const { scrolled, activeSection } = useNavScroll();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const closeDropdown = () => setDropdownOpen(false);

  // Direction-aware underline: grow from / retract toward the edge the cursor crosses
  const setUnderlineOrigin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const origin = e.clientX - rect.left < rect.width / 2 ? 'left' : 'right';
    el.style.setProperty('--ul-origin', origin);
  };

  return (
    <motion.nav
      id="nav"
      className={scrolled ? 'scrolled' : ''}
      aria-label="Main navigation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'tween', duration: 0.4, delay: 0.05 }}
    >
      <div className="nav-logo">
        <div className="nav-mark">
          <Logo />
        </div>
        <div className="nav-word">
          <span>en</span><span>X</span>
        </div>
        <span className="nav-parent">an enSAR Solutions division</span>
      </div>

      <ul role="list" className="nav-links">
        {/* Products with controlled dropdown — closes on click */}
        <li
          className={`nav-dropdown-wrap${dropdownOpen ? ' open' : ''}`}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={closeDropdown}
        >
          <a
            href="#capabilities"
            className={activeSection === 'capabilities' ? 'nav-active' : ''}
            onClick={closeDropdown}
            onMouseEnter={setUnderlineOrigin}
            onMouseLeave={setUnderlineOrigin}
          >
            Products
          </a>
          <div className="nav-dropdown">
            <div className="nav-dropdown-inner">
              {PRODUCTS.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="nav-dropdown-item"
                  onClick={closeDropdown}
                >
                  <span className="nav-dropdown-name">{p.name}</span>
                  <span className="nav-dropdown-cat">{p.cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </li>

        {['platform','principles','company'].map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={activeSection === id ? 'nav-active' : ''}
              onMouseEnter={setUnderlineOrigin}
              onMouseLeave={setUnderlineOrigin}
            >
              {id === 'company' ? 'About Us' : id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          </li>
        ))}

        <li>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); onOpenContact('Header'); }}
            onMouseEnter={setUnderlineOrigin}
            onMouseLeave={setUnderlineOrigin}
          >
            Contact Us
          </a>
        </li>
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className="nav-hamburger"
          id="hamburger"
          onClick={onOpenMobile}
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </motion.nav>
  );
};

export default Nav;
