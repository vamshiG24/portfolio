import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const FlowSection = ({
  className = '',
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <section
    data-flow-section
    aria-label={ariaLabel}
    className={`relative min-h-screen w-full overflow-hidden ${className}`}
  >
    <div
      data-flow-inner
      className="flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[5vw] pt-14 md:pt-[clamp(250px,35vh,350px)] pb-[40px] md:pb-[60px] will-change-transform"
      style={{ transformOrigin: 'bottom left', ...style }}
    >
      {children}
    </div>
  </section>
);

export const FlowArt = ({
  children,
  className = '',
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const mm = gsap.matchMedia(containerRef);
    mm.add("(min-width: 768px)", () => {
      const sections = Array.from(
        containerRef.current.querySelectorAll('[data-flow-section]')
      );
      if (sections.length === 0) return;

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 12, transformOrigin: 'bottom left' });
          gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 20%',
              scrub: true,
            },
          });
        }

        if (i < sections.length - 1) {
          ScrollTrigger.create({
            trigger: section,
            start: 'bottom bottom',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
          });
        }
      });

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, [children, reducedMotion]);

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={`w-full overflow-x-hidden ${className}`}
    >
      {children}
    </main>
  );
};

export default FlowArt;
