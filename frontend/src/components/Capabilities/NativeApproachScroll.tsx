import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LucideIcon } from 'lucide-react';
import { LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';

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
  eyebrow?: string;
  title?: string;
}

const STAGGER = 0.32; // seconds between each card's reveal

const NativeApproachScroll: React.FC<Props> = ({
  items,
  eyebrow = 'The Approach',
  title = 'A Native Approach to Industrial Control',
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconCircleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const bulletRefs = useRef<(HTMLLIElement | null)[][]>([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // idle icon pulse — independent loop, every ~3s, once revealed
      iconCircleRefs.current.forEach((circle, i) => {
        if (!circle) return;
        gsap.timeline({ repeat: 3, delay: 1 + i * 0.15 })
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

      <span className="eyebrow">{eyebrow}</span>
      <LineReveal as="h2" className="engram-section-h2" text={title} />

      <div ref={rowRef} className={`approach-grid approach-grid-cols-${items.length}`}>
        {items.map((item, i) => (
          <div
            key={item.title}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="card engram-cap-card approach-card"
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
            <h3 ref={(el) => { titleRefs.current[i] = el; }} className="engram-cap-title approach-card-title approach-title-text">
              {item.title}
            </h3>
            <p className="engram-cap-sub">{item.subtitle}</p>
            <p ref={(el) => { descRefs.current[i] = el; }} className="body-text engram-cap-desc approach-card-desc">{item.desc}</p>
            <ul className="stack engram-cap-list approach-card-bullets">
              {item.features.map((f, fi) => (
                <li key={fi} ref={(el) => {
                  if (!bulletRefs.current[i]) bulletRefs.current[i] = [];
                  bulletRefs.current[i][fi] = el;
                }}>
                  <span className="approach-bullet-dash">—</span>
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
