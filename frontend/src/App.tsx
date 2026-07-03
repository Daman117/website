import { lazy, Suspense, useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLenis, getLenis } from './hooks/useLenis';
import Nav from './components/Nav';
import MobileNav from './components/MobileNav';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';

// Home stays eager (it's the LCP page); every other route loads on demand.
const ProductPage = lazy(() => import('./components/Capabilities/ProductPage'));
const EngramPage = lazy(() => import('./components/Capabilities/EngramPage'));
const EnstudioPage = lazy(() => import('./components/Capabilities/EnstudioPage'));
const EngeniePage = lazy(() => import('./components/Capabilities/EngeniePage'));
const EnviewPage = lazy(() => import('./components/Capabilities/EnviewPage'));
const EnablePage = lazy(() => import('./components/Capabilities/EnablePage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const PlatformPage = lazy(() => import('./components/PlatformPage'));
const PrinciplesPage = lazy(() => import('./components/PrinciplesPage'));

function HomePage({
  onOpenContact,
}: {
  onOpenContact: (source?: string) => void;
}) {
  return <LandingPage onOpenContact={onOpenContact} />;
}

// Opacity-only — no translateY. A `transform` on this wrapper turns any
// viewport-fixed hero background inside it (enVIEW, Landing) into a
// fixed-relative-to-this-element background for the transition's duration,
// which the browser renders as a blurry/glitchy repaint while it animates.
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};
const pageTransition = { type: 'tween', duration: 0.38 } as const;

// Jumps to a scroll position without any easing — bypassing Lenis's own
// animation loop, which otherwise fights a plain window.scrollTo() and
// visibly glides from the old position instead of snapping instantly.
function jumpScrollTo(top: number) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(top, { immediate: true });
  } else {
    window.scrollTo({ top, behavior: 'instant' });
  }
}

// Saves the home scroll position the moment the user leaves home, so a later
// return can restore it. Lives outside AnimatePresence so it sees the route
// change immediately, while the old page is still on screen at its old scroll.
function ScrollSaver() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current === '/' && location.pathname !== '/') {
      sessionStorage.setItem('homeScrollY', String(window.scrollY));
    }
    prevPath.current = location.pathname;
  }, [location.pathname]);

  return null;
}

// Mounted inside the routed page (AnimatePresence mode="wait" delays that
// mount until the old page has fully faded out), so positioning happens while
// the new page is still transparent — no visible jump, no timing constants.
function PageScrollManager() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.pathname === '/') {
      if (location.hash) {
        const el = document.getElementById(location.hash.slice(1));
        if (el) {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(el, { offset: -80 });
          else el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      const savedY = sessionStorage.getItem('homeScrollY');
      if (savedY) {
        sessionStorage.removeItem('homeScrollY');
        jumpScrollTo(parseInt(savedY, 10));
      }
    } else {
      // Any other page starts at the top, instantly, while still transparent
      jumpScrollTo(0);
    }
  }, [location]);

  return null;
}

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
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={reduce ? { duration: 0 } : pageTransition}
        style={{ width: '100%' }}
      >
        <PageScrollManager />
        {/* min-height reserves the page's space while its chunk downloads,
            so Footer (mounted outside this boundary) can't jump up to sit
            right under Nav during the fetch — see App.tsx Footer placement. */}
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
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
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/principles" element={<PrinciplesPage />} />
            <Route
              path="/products/:id"
              element={
                <ProductPage onOpenContact={onOpenContact} />
              }
            />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSource, setContactSource] = useState<string | undefined>();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useLenis();

  const openContact = useCallback((source?: string) => {
    setContactSource(source);
    setContactOpen(true);
  }, []);

  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <>
      <ScrollSaver />
      {/* Nav stays fixed — never animates on route change */}
      <Nav
        onOpenMobile={() => setMobileNavOpen(true)}
        mobileOpen={mobileNavOpen}
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
