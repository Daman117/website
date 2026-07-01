import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let modalOpen = false;

export function setLenisModalOpen(open: boolean) {
  modalOpen = open;
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
