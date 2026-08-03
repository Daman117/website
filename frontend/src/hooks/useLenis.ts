import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let modalOpen = false;

// Locks the page behind a full-screen overlay. Lenis's `prevent` only stops
// *smooth* scrolling — native scroll keeps working — so the body lock has to
// happen here too, or the background scrolls behind the overlay.
export function setLenisModalOpen(open: boolean) {
  modalOpen = open;
  document.body.style.overflow = open ? 'hidden' : '';
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      prevent: () => modalOpen,
    });

    lenisInstance = lenis;

    let raf: number;
    function tick(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

export function getLenis() {
  return lenisInstance;
}
