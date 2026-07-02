import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let modalOpen = false;
let introLocked = false;

export function setLenisModalOpen(open: boolean) {
  modalOpen = open;
}

// Held true while the hero's entrance animation is still playing on a
// fresh load, so a wheel/touch scroll can't cut the text reveal short.
export function setLenisIntroLocked(locked: boolean) {
  introLocked = locked;
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      prevent: () => modalOpen || introLocked,
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
