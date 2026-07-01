import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface ApproachItem {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  color: string;
}

interface Props {
  items: ApproachItem[];
}

const STAGGER = 0.5; // seconds between each card's reveal

const NativeApproachScroll: React.FC<Props> = ({ items }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconCircleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const bulletRefs = useRef<(HTMLLIElement | null)[][]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // idle icon pulse — independent loop, every ~3s, once revealed
      iconCircleRefs.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.timeline({ repeat: -1, delay: 1 + i * 0.15 })
          .to(circle, { scale: 1.08, duration: 0.4, ease: 'sine.inOut' })
          .to(circle, { scale: 1, duration: 0.4, ease: 'sine.inOut' })
          .to({}, { duration: 2.2 });
      });

      items.forEach((_, i) => {
        const card = cardRefs.current[i];
        if (!card) return;

        gsap.set(card, { opacity: 0, x: -80, filter: 'blur(6px)' });
        gsap.set(iconWrapRefs.current[i], { scale: 0.4, opacity: 0, rotate: -25 });
        gsap.set(titleRefs.current[i], { opacity: 0, x: -12 });
        gsap.set(descRefs.current[i], { opacity: 0, x: -16 });
        (bulletRefs.current[i] || []).forEach((el) => el && gsap.set(el, { opacity: 0, x: -12 }));

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          delay: i * STAGGER,
        });

        tl.to(card, {
          opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power4.out',
          clearProps: 'transform,filter', // hand control back to CSS so hover matches the other cards
        })
          .to(iconWrapRefs.current[i], { scale: 1, opacity: 1, rotate: 0, duration: 0.55, ease: 'back.out(2)' }, '<0.05')
          .to(titleRefs.current[i], { opacity: 1, x: 0, duration: 0.45 }, '<0.15')
          .to(descRefs.current[i], { opacity: 1, x: 0, duration: 0.5 }, '<0.1');

        (bulletRefs.current[i] || []).forEach((el, fi) => {
          tl.to(el, { opacity: 1, x: 0, duration: 0.35 }, fi === 0 ? '<0.1' : '<0.08');
        });
      });
    }, rowRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <section className="engram-section engram-container">
      <style>{`
        .approach-grid {
          display: grid;
          grid-template-columns: repeat(${items.length}, 1fr);
          gap: 18px;
        }
        @media (max-width: 1024px) { .approach-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px)  { .approach-grid { grid-template-columns: 1fr; } }

        .approach-card { will-change: transform, opacity, filter; }
        .approach-icon-wrap { will-change: transform, opacity; margin-bottom: 14px; }
        .approach-icon-circle {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(var(--cap-color-rgb, 37,99,235), 0.1);
          border: 1px solid rgba(var(--cap-color-rgb, 37,99,235), 0.25);
          will-change: transform;
        }
        .approach-card-title, .approach-card-desc, .approach-card-bullets li {
          will-change: transform, opacity;
        }
      `}</style>

      <span className="eyebrow">The Approach</span>
      <h2 className="engram-section-h2">A Native Approach to Industrial Control</h2>

      <div ref={rowRef} className="approach-grid">
        {items.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="engram-cap-card approach-card"
            style={{ '--cap-color': item.color } as React.CSSProperties}
          >
            <div ref={(el) => { iconWrapRefs.current[i] = el; }} className="approach-icon-wrap">
              <div
                ref={(el) => { iconCircleRefs.current[i] = el; }}
                className="approach-icon-circle"
                style={{ '--cap-color-rgb': hexToRgb(item.color) } as React.CSSProperties}
              >
                <item.Icon size={22} color={item.color} strokeWidth={1.75} />
              </div>
            </div>
            <h3 ref={(el) => { titleRefs.current[i] = el; }} className="engram-cap-title approach-card-title" style={{ color: item.color, fontSize: 15 }}>
              {item.title}
            </h3>
            <p className="engram-cap-sub">{item.subtitle}</p>
            <p ref={(el) => { descRefs.current[i] = el; }} className="engram-cap-desc approach-card-desc">{item.desc}</p>
            <ul className="engram-cap-list approach-card-bullets">
              {item.features.map((f, fi) => (
                <li key={fi} ref={(el) => {
                  if (!bulletRefs.current[i]) bulletRefs.current[i] = [];
                  bulletRefs.current[i][fi] = el;
                }}>
                  <span style={{ color: item.color, marginRight: 6 }}>—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

function hexToRgb(hex: string): string {
  const m = hex.replace('#', '');
  const bigint = parseInt(m, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

export default NativeApproachScroll;
