import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MouseGlow = ({ children, theme }) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const lastSpawnTime = useRef(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. Calculate Cursor Spotlight Coordinates
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);

    // 2. Mouse Tilt (3D Card Tilt) & Magnetic Hover
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    const rotateX = -normY * 6; // max 6 degrees tilt
    const rotateY = normX * 6;

    // Magnetic translation (moves slightly towards cursor - liquid water pull)
    const translateX = normX * 5; // max 5px pull
    const translateY = normY * 5;

    containerRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
    containerRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    containerRef.current.style.setProperty('--translate-x', `${translateX}px`);
    containerRef.current.style.setProperty('--translate-y', `${translateY}px`);

    // 3. Particle Bloom Spawner (Throttle: 1 particle per 350ms)
    const now = Date.now();
    if (now - lastSpawnTime.current > 350) {
      lastSpawnTime.current = now;
      
      const newParticle = {
        id: Math.random(),
        x,
        y,
        // Random drift direction
        dx: (Math.random() - 0.5) * 30,
        dy: (Math.random() - 0.5) * 30 - 10, // drift slightly upwards
        size: Math.random() * 2 + 1
      };

      setParticles((prev) => [...prev.slice(-4), newParticle]); // keep max 4 active particles in state
    }
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    // Spring back smoothly
    containerRef.current.style.setProperty('--rotate-x', `0deg`);
    containerRef.current.style.setProperty('--rotate-y', `0deg`);
    containerRef.current.style.setProperty('--translate-x', `0px`);
    containerRef.current.style.setProperty('--translate-y', `0px`);
  };

  // Clean up particles after they fade out
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter(p => Date.now() - p.id * 1000 < 500)); // remove expired particles
    }, 500);
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div
      ref={containerRef}
      className="mouse-glow-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        '--glow-color': theme.glow || 'rgba(255, 0, 0, 0.15)',
        '--border-glow-color': theme.color || 'var(--yellow)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.2, 1.15), box-shadow 0.6s ease'
      }}
    >
      {/* 4. Glass Depth Backdrop Blur, Auroras, Noise Overlay */}
      <div className="frosted-glass-blur" />
      <div className="noise-overlay" />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 3, height: '100%', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default MouseGlow;
