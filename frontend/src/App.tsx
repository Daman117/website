import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLenis } from './hooks/useLenis';
import Nav from './components/Nav';
import MobileNav from './components/MobileNav';
import Hero from './components/Hero';
import ProductDemo from './components/ProductDemo';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import CapGrid from './components/Capabilities/CapGrid';
import Industries from './components/Industries';
import Platform from './components/Platform';
import Architecture from './components/Architecture';
import BusinessImpact from './components/BusinessImpact';
import Security from './components/Security';
import CaseStudies from './components/CaseStudies';
import Resources from './components/Resources';
import Principles from './components/Principles';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import ProductPage from './components/Capabilities/ProductPage';
import EngramPage from './components/Capabilities/EngramPage';
import EnstudioPage from './components/Capabilities/EnstudioPage';
import EngeniePage from './components/Capabilities/EngeniePage';
import EnviewPage from './components/Capabilities/EnviewPage';
import EnablePage from './components/Capabilities/EnablePage';
import AboutPage from './components/AboutPage';

function HomePage({
  onOpenContact,
}: {
  onOpenContact: (source?: string) => void;
}) {

  return (
    <main>
      <Hero onOpenContact={onOpenContact} />
      <ProductDemo />
      <Stats />
      <HowItWorks />
      <CapGrid />
      <Industries />
      <Platform />
      <Architecture />
      <BusinessImpact />
      <Security />
      <CaseStudies />
      <Resources onOpenContact={onOpenContact} />
      <Principles />

      <CTA onOpenContact={onOpenContact} />
    </main>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
};
const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};
const pageTransition = { type: 'tween', duration: 0.38 } as const;

function AnimatedRoutes({
  onOpenContact,
}: {
  onOpenContact: (source?: string) => void;
}) {
  const location = useLocation();
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={reduce ? reducedVariants : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={reduce ? { duration: 0 } : pageTransition}
        style={{ width: '100%' }}
      >
        <Routes location={location}>
          <Route
            path="/"
            element={<HomePage onOpenContact={onOpenContact} />}
          />
          <Route
            path="/products/engram"
            element={<EngramPage onOpenContact={onOpenContact} />}
          />
          <Route
            path="/products/enstudio"
            element={<EnstudioPage onOpenContact={onOpenContact} />}
          />
          <Route
            path="/products/engenie"
            element={<EngeniePage onOpenContact={onOpenContact} />}
          />
          <Route
            path="/products/enview"
            element={<EnviewPage onOpenContact={onOpenContact} />}
          />
          <Route
            path="/products/enable"
            element={<EnablePage onOpenContact={onOpenContact} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/products/:id"
            element={
              <ProductPage onOpenContact={onOpenContact} />
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function ScrollRestorer() {
  const location = useLocation();
  const prevPath = useRef('/');

  useEffect(() => {
    // Leaving home — save scroll position
    if (prevPath.current === '/' && location.pathname !== '/') {
      sessionStorage.setItem('homeScrollY', String(window.scrollY));
    }

    if (location.pathname === '/') {
      // Returning home — restore after page transition finishes
      const savedY = sessionStorage.getItem('homeScrollY');
      if (savedY) {
        sessionStorage.removeItem('homeScrollY');
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedY, 10), behavior: 'instant' });
        }, 420);
      }
    } else {
      // Any product page — start at top
      window.scrollTo(0, 0);
    }

    prevPath.current = location.pathname;
  }, [location.pathname]);

  return null;
}

function AppShell() {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSource, setContactSource] = useState<string | undefined>();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useLenis();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.style.backgroundColor = '#EEF3F9';
  }, []);


  const openContact = useCallback((source?: string) => {
    setContactSource(source);
    setContactOpen(true);
  }, []);

  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <>
      <ScrollRestorer />
      {/* Nav stays fixed — never animates on route change */}
      <Nav
        onOpenMobile={() => setMobileNavOpen(true)}
        onOpenContact={openContact}
      />
      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onOpenContact={openContact}
      />
      <ContactModal open={contactOpen} source={contactSource} onClose={closeContact} />

      {/* Only the body content animates between routes */}
      <AnimatedRoutes onOpenContact={openContact} />
      <Footer onOpenContact={openContact} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
