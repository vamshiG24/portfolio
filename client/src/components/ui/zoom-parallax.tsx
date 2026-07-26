'use client';

import { useScroll, useTransform, useSpring, motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import './zoom-parallax.css';

interface Image {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  tech?: string[];
  github?: string;
  demo?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

const POSITIONS = [
  { height: '12.5vh', width: '25vw' },
  { height: '15vh', width: '35vw', top: '-15vh', left: '5vw' },
  { height: '22.5vh', width: '20vw', top: '-5vh', left: '-25vw' },
  { height: '12.5vh', width: '25vw', top: '0', left: '27.5vw' },
  { height: '12.5vh', width: '20vw', top: '13.75vh', left: '5vw' },
  { height: '12.5vh', width: '30vw', top: '13.75vh', left: '-22.5vw' },
  { height: '7.5vh', width: '15vw', top: '11.25vh', left: '25vw' },
] as const;

const COOLDOWN_MS = 650;      // min time between paging steps (one wheel tick = one project)
const WHEEL_THRESHOLD = 12;   // ignore tiny/inertial wheel jitter
const SWIPE_THRESHOLD = 40;   // px, for touch swipe

// ─── Static Fullscreen Project Panel (no scroll scrubbing — AnimatePresence handles enter/exit) ──
interface ProjectPanelProps {
  project: Image;
  index: number;
  total: number;
}

function ProjectPanel({ project, index, total }: ProjectPanelProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', background: '#0c0c0c' }}>
      {/* Left side: Image */}
      <div style={{ position: 'relative', width: '55%', height: '100%', overflow: 'hidden' }}>
        <img
          src={project.src || '/placeholder.svg'}
          alt={project.alt || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, transparent 55%, #0c0c0c 100%), linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <span style={{
          position: 'absolute', top: 24, left: 28,
          fontSize: '5.5rem', fontWeight: 900,
          color: 'rgba(255,255,255,0.06)',
          fontFamily: 'var(--font-display, sans-serif)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
          letterSpacing: '-0.04em',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Right side: Details */}
      <div
        style={{
          width: '45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 52px',
          background: '#0c0c0c',
          position: 'relative',
        }}
      >
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.22em',
          color: 'rgba(255,0,0,0.85)', fontFamily: 'var(--font-mono, monospace)', marginBottom: 14,
        }}>
          PROJECT {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>

        <h3 style={{
          fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#fff',
          margin: '0 0 16px', letterSpacing: '-0.025em',
          fontFamily: 'var(--font-display, sans-serif)', lineHeight: 1.2,
        }}>
          {project.title}
        </h3>

        <div style={{ width: 36, height: 2, background: '#ff0000', borderRadius: 2, marginBottom: 20 }} />

        <p style={{
          color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem',
          lineHeight: 1.8, margin: '0 0 28px', maxWidth: 420,
        }}>
          {project.description}
        </p>

        {project.tech && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
            {project.tech.map((t, i) => (
              <span key={i} style={{
                fontSize: '0.67rem', fontFamily: 'monospace', padding: '4px 10px',
                background: 'rgba(255,0,0,0.08)', border: '1px solid rgba(255,68,68,0.22)',
                color: '#ff6666', borderRadius: 6, letterSpacing: '0.04em',
              }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {project.github && (
            <a
              href={project.github} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '10px 22px',
                borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none',
                background: 'rgba(255,255,255,0.07)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.13)', letterSpacing: '0.04em',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)';
              }}
            >
              GitHub ↗
            </a>
          )}
          {project.demo && project.demo !== '#' && (
            <a
              href={project.demo} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', padding: '10px 22px',
                borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none',
                background: '#ff0000', color: '#fff', border: '1px solid #ff0000', letterSpacing: '0.04em',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#cc0000')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#ff0000')}
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function ZoomParallax({ images }: ZoomParallaxProps) {
  const zoomContainer = useRef<HTMLDivElement>(null);
  const pagingWrapper = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paging, setPaging] = useState(false);

  const cooldownRef = useRef(0);
  const isScrollingDownRef = useRef(true);
  const touchStartYRef = useRef<number | null>(null);
  const pagingRef = useRef(paging);
  const activeIndexRef = useRef(activeIndex);
  pagingRef.current = paging;
  activeIndexRef.current = activeIndex;

  const exitCooldownUntilRef = useRef(0);
  const lastExitTimeRef = useRef(0);
  const disablePagingUntilRef = useRef(0);

  const actualProjects = images.slice(1);
  const zoomVh = 220; // scroll distance dedicated to the mosaic zoom-in

  // ── Phase 1: Zooming Mosaic (unchanged mechanics, own local scroll range) ──
  const { scrollYProgress } = useScroll({
    target: zoomContainer,
    offset: ['start start', 'end end'],
  });

  const scale4 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 4]), { stiffness: 95, damping: 22 });
  const scale5 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 5]), { stiffness: 95, damping: 22 });
  const scale6 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 6]), { stiffness: 95, damping: 22 });
  const scale8 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 8]), { stiffness: 95, damping: 22 });
  const scale9 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 9]), { stiffness: 95, damping: 22 });
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const mosaicOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  const mosaicY = useTransform(scrollYProgress, [0, 0.85], [-120, 0]);

  // Track natural scroll direction while NOT locked, so we know which way
  // the user was heading when they cross into the paging section.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (!pagingRef.current) {
        const currentY = window.scrollY;
        if (currentY !== lastY) {
          isScrollingDownRef.current = currentY > lastY;
          lastY = currentY;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Always-mounted (not gated on `paging`) — absorbs leftover wheel momentum
  // right after an exit jump so it can't immediately scroll you back off target.
  useEffect(() => {
    const swallowMomentum = (e: WheelEvent) => {
      if (Date.now() < exitCooldownUntilRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', swallowMomentum, { passive: false });
    return () => window.removeEventListener('wheel', swallowMomentum);
  }, []);

  // Engage paging mode when the paging wrapper enters the viewport.
  useEffect(() => {
    if (!pagingWrapper.current || actualProjects.length === 0) return;

    const el = pagingWrapper.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // If we just exited paging or are navigating via navbar/anchor, ignore observer events
        if (Date.now() < disablePagingUntilRef.current) return;
        if (Date.now() - lastExitTimeRef.current < 800) return;
        if (pagingRef.current) return; // already paging, ignore
        if (entry.isIntersecting && entry.intersectionRatio > 0.02) {
          const goingDown = isScrollingDownRef.current;
          setActiveIndex(goingDown ? 0 : actualProjects.length - 1);
          setPaging(true);
          cooldownRef.current = Date.now(); // Ignore initial scroll/touch inertia when entering paging mode
        }
      },
      { threshold: [0, 0.02, 0.5, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [actualProjects.length]);

  // Release paging scroll-lock when user navigates away (e.g. Navbar click or browser back/forward)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a') || target.closest('button');
      if (anchor) {
        const href = anchor.getAttribute('href') || anchor.getAttribute('data-href');
        if (href && href.startsWith('#') && href.length > 1) {
          disablePagingUntilRef.current = Date.now() + 2500;
          lastExitTimeRef.current = Date.now();
          setPaging(false);
        }
      }
    };

    const handleRelease = () => {
      disablePagingUntilRef.current = Date.now() + 2500;
      lastExitTimeRef.current = Date.now();
      setPaging(false);
    };

    document.addEventListener('click', handleAnchorClick, true);
    window.addEventListener('hashchange', handleRelease);
    window.addEventListener('popstate', handleRelease);

    return () => {
      document.removeEventListener('click', handleAnchorClick, true);
      window.removeEventListener('hashchange', handleRelease);
      window.removeEventListener('popstate', handleRelease);
    };
  }, []);

  // Lock/unlock body scroll while paging is active.
  useEffect(() => {
    if (paging) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [paging]);

  const exitPaging = useCallback((direction: 'up' | 'down') => {
    lastExitTimeRef.current = Date.now();
    setPaging(false);
    exitCooldownUntilRef.current = Date.now() + 500; // swallow momentum for 500ms

    requestAnimationFrame(() => {
      if (direction === 'down') {
        const el = pagingWrapper.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + rect.bottom + 50 });
      } else {
        // Reset straight to the top of the mosaic (progress ≈ 0) so the
        // full gallery of small cards shows immediately — not the deep-zoom
        // single-card frame that sits right before the paging handoff.
        const zc = zoomContainer.current;
        if (!zc) return;
        const rect = zc.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + rect.top + 5 });
      }
    });
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    const now = Date.now();
    if (now - cooldownRef.current < COOLDOWN_MS) return;
    cooldownRef.current = now;

    const idx = activeIndexRef.current;
    if (dir === 1) {
      if (idx < actualProjects.length - 1) {
        setActiveIndex(idx + 1);
      } else {
        exitPaging('down');
      }
    } else {
      if (idx > 0) {
        setActiveIndex(idx - 1);
      } else {
        exitPaging('up');
      }
    }
  }, [actualProjects.length, exitPaging]);

  // Wheel / keyboard / touch handlers, active only while paging.
  useEffect(() => {
    if (!paging) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
    };

    const onTouchStart = (e: TouchEvent) => { touchStartYRef.current = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      touchStartYRef.current = null;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      step(delta > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [paging, step]);

  return (
    <>
      {/* ── Phase 1: Zooming Mosaic (normal scroll) ── */}
      <div ref={zoomContainer} className="zoom-parallax-container" style={{ height: `${zoomVh}vh` }}>
        <div className="zoom-parallax-scene">
          <motion.div className="zoom-parallax-layer" style={{ opacity: mosaicOpacity, y: mosaicY }}>
            {images.map(({ src, alt, title, description, tech, github, demo }, index) => {
              const scale = scales[index % scales.length];
              const pos = POSITIONS[index % POSITIONS.length] as Record<string, string>;

              return (
                <motion.div
                  key={index}
                  style={{
                    scale,
                    willChange: 'transform',
                    position: 'absolute',
                    top: 0,
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    className="zoom-parallax-card"
                    style={{
                      height: pos.height,
                      width: pos.width,
                      top: pos.top ?? undefined,
                      left: pos.left ?? undefined,
                    }}
                  >
                    <img
                      src={src || '/placeholder.svg'}
                      alt={alt || `Parallax image ${index + 1}`}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div className="zoom-overlay">
                      {title && <h3 className="zoom-overlay-title">{title}</h3>}
                      {description && <p className="zoom-overlay-desc">{description}</p>}
                      {tech && (
                        <div className="zoom-overlay-tags">
                          {tech.map((t, i) => (
                            <span key={i} className="zoom-overlay-tag">{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="zoom-overlay-links">
                        {github && <span className="zoom-overlay-link zoom-overlay-link--github">GitHub</span>}
                        {demo && demo !== '#' && <span className="zoom-overlay-link zoom-overlay-link--live">Live</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Phase 2: One-swipe-one-project paging ── */}
      <div ref={pagingWrapper} style={{ position: 'relative', height: '100vh', background: '#0c0c0c' }}>
        {paging && actualProjects.length > 0 && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0c0c0c', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <ProjectPanel
                  project={actualProjects[activeIndex]}
                  index={activeIndex}
                  total={actualProjects.length}
                />
              </motion.div>
            </AnimatePresence>

            {/* Dot Indicators */}
            <div style={{
              position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
              display: 'flex', flexDirection: 'column', gap: 10, zIndex: 999,
            }}>
              {actualProjects.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: i === activeIndex ? 22 : 6,
                    borderRadius: i === activeIndex ? 4 : '50%',
                    background: i === activeIndex ? '#ff0000' : 'rgba(255,255,255,0.22)',
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}