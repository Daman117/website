import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { useNavScroll } from '../hooks/useNavScroll';
import { getLenis } from '../hooks/useLenis';

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
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    const lenis = getLenis();
    if (location.pathname === '/') {
      if (lenis) lenis.scrollTo(0, { duration: 1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Logo always means "go to the very top of home" — drop any saved
      // scroll position so ScrollRestorer doesn't jump back down to where
      // the user left off (that restore is only for the browser back button).
      sessionStorage.removeItem('homeScrollY');
      navigate('/');
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

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
      <button
        className="nav-logo"
        onClick={handleLogoClick}
        aria-label="Go to home"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <div className="nav-mark">
          <Logo />
        </div>
        <div className="nav-word">
          <span>en</span><span>X</span>
        </div>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', marginRight: '7%' }}>
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

          <li>
            <Link
              to="/platform"
              className={location.pathname === '/platform' ? 'nav-active' : ''}
              onMouseEnter={setUnderlineOrigin as unknown as React.MouseEventHandler<HTMLAnchorElement>}
              onMouseLeave={setUnderlineOrigin as unknown as React.MouseEventHandler<HTMLAnchorElement>}
            >
              Platform
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onMouseEnter={setUnderlineOrigin as unknown as React.MouseEventHandler<HTMLAnchorElement>}
              onMouseLeave={setUnderlineOrigin as unknown as React.MouseEventHandler<HTMLAnchorElement>}
            >
              About Us
            </Link>
          </li>

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
