'use client';

import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { useRef } from 'react';

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
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: Image[];
}

// Fixed mosaic positions per slot (offsets from the flex-centered origin)
const POSITIONS = [
  { height: '12.5vh', width: '25vw' },
  { height: '15vh', width: '35vw', top: '-15vh', left: '5vw' },
  { height: '22.5vh', width: '20vw', top: '-5vh', left: '-25vw' },
  { height: '12.5vh', width: '25vw', top: '0',     left: '27.5vw' },
  { height: '12.5vh', width: '20vw', top: '13.75vh', left: '5vw' },
  { height: '12.5vh', width: '30vw', top: '13.75vh', left: '-22.5vw' },
  { height: '7.5vh', width: '15vw', top: '11.25vh', left: '25vw' },
] as const;

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Large scales move cards that start near an edge completely out of the
  // viewport, leaving the scene mostly empty. Keep the parallax subtle.
  const scale4 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 4]), { stiffness: 80, damping: 20 });
  const scale5 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 5]), { stiffness: 80, damping: 20 });
  const scale6 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 6]), { stiffness: 80, damping: 20 });
  const scale8 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 8]), { stiffness: 80, damping: 20 });
  const scale9 = useSpring(useTransform(scrollYProgress, [0, 1], [1, 9]), { stiffness: 80, damping: 20 });

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.borderColor = 'rgba(255,0,0,0.55)';
    card.style.boxShadow   = '0 0 32px rgba(255,0,0,0.3)';
    const overlay = card.querySelector<HTMLDivElement>('.zoom-overlay');
    if (overlay) overlay.style.opacity = '1';
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.borderColor = 'rgba(255,0,0,0.15)';
    card.style.boxShadow   = '0 0 18px rgba(255,0,0,0.1)';
    const overlay = card.querySelector<HTMLDivElement>('.zoom-overlay');
    if (overlay) overlay.style.opacity = '0';
  };

  return (
    <div
      ref={container}
      style={{ position: 'relative', height: `${Math.max(150, images.length * 22.5)}vh` }}
    >
      <div style={{ position: 'sticky', top: '25vh', height: '50vh', overflow: 'hidden', transform: 'translateZ(0)' }}>
        {images.map(({ src, alt, title, description, tech, github, demo }, index) => {
          const scale = scales[index % scales.length];
          const pos   = POSITIONS[index % POSITIONS.length] as Record<string, string>;

          return (
            <motion.div
              key={index}
              style={{ scale, willChange: 'transform' }}
              className="absolute top-0 flex h-full w-full items-center justify-center"
            >
              <div
                className="group"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                style={{
                  position: 'relative',
                  height: pos.height,
                  width:  pos.width,
                  top:    pos.top    ?? undefined,
                  left:   pos.left   ?? undefined,
                  overflow: 'hidden',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,0,0,0.15)',
                  boxShadow: '0 0 18px rgba(255,0,0,0.1)',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden' as const,
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                />

                {/* Overlay — controlled by parent onMouseEnter/Leave */}
                <div
                  className="zoom-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.88)',
                    opacity: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '12px',
                    zIndex: 10,
                    transition: 'opacity 0.28s ease',
                    pointerEvents: 'none',
                  }}
                >
                  {title && (
                    <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 'clamp(0.6rem, 1vw, 0.9rem)', margin: '0 0 4px 0', letterSpacing: '-0.01em', fontFamily: 'var(--font-display, sans-serif)' }}>
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(0.5rem, 0.75vw, 0.68rem)', margin: '0 0 8px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {description}
                    </p>
                  )}
                  {tech && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '8px' }}>
                      {tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 'clamp(0.45rem, 0.6vw, 0.58rem)', fontFamily: 'monospace', padding: '2px 5px', background: 'rgba(255,0,0,0.12)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff6666', borderRadius: '4px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto' }}>
                    {github && (
                      <a href={github} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: '5px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', transition: 'background 0.2s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#ff0000')}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)')}
                      >
                        GitHub
                      </a>
                    )}
                    {demo && demo !== '#' && (
                      <a href={demo} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: '5px', background: '#ff0000', color: '#fff', fontSize: '0.6rem', fontWeight: 700, textDecoration: 'none', border: '1px solid #ff0000', transition: 'background 0.2s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#cc0000')}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#ff0000')}
                      >
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
