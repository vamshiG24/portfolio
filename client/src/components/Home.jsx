import { useEffect, useState } from 'react';
import { ArrowDown, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { SplineScene } from '@/components/ui/splite';

const Home = ({ lowSpecMode }) => {
  const nameVamshi = "Vamshi".split("");
  const nameGowni = "Gowni".split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.8,
      }
    }
  };

  const letterVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 150, damping: 10 }
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    // Detect mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Viewport observer to unmount when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    const section = document.getElementById('home');
    if (section) observer.observe(section);

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (section) observer.unobserve(section);
    };
  }, []);

  const handleScrollToProjects = (e) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#0c0c0c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Right Column: Robot Scene (positioned absolutely to span screen boundary without clipping) */}
      <motion.div
        initial={{ width: '100%', scale: 2.2, originX: 0.5, originY: 0.35 }}
        animate={{ width: '60%', scale: 1.0 }}
        transition={{ duration: 2.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '100%',
          position: 'absolute',
          right: 0,
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          overflow: 'visible',
        }}
        className="right-robot"
      >
        <div style={{ width: '100%', height: '100%', overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isInView && (
            (!isMobile && !lowSpecMode) ? (
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            ) : (
              /* Mobile Fallback Graphic: Futuristic Glowing CSS Orb */
              <div
                style={{
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #ff3333 0%, #aa0000 65%, #000000 100%)',
                  boxShadow: '0 0 40px rgba(255, 0, 0, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.15)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'mobile-orb-pulse 3s ease-in-out infinite alternate',
                  zIndex: 2
                }}
              >
                {/* Orbital Rings */}
                <div style={{
                  position: 'absolute',
                  width: '290px',
                  height: '290px',
                  border: '1.5px solid rgba(255, 0, 0, 0.15)',
                  borderRadius: '50%',
                  animation: 'mobile-ring-rotate-clockwise 16s linear infinite'
                }} />
                <div style={{
                  position: 'absolute',
                  width: '320px',
                  height: '150px',
                  border: '1.5px dashed rgba(255, 0, 0, 0.22)',
                  borderRadius: '50%',
                  transform: 'rotate(-25deg)',
                  animation: 'mobile-ring-rotate-counter 20s linear infinite'
                }} />

                {/* Pulse Glow Overlay */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 80%)',
                }} />
              </div>
            )
          )}
        </div>
      </motion.div>

      {/* Grid aligned details container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          alignItems: 'center',
          padding: '0 24px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
        className="home-container"
      >
        {/* Left Column: Details */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '45%',
            pointerEvents: 'auto',
          }}
          className="left-details"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '40px', width: '100%' }}>
            <span
              style={{
                color: '#ff0000',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(255, 0, 0, 0.1)',
                padding: '6px 16px',
                borderRadius: '99px',
                border: '1px solid rgba(255, 0, 0, 0.2)',
                alignSelf: 'flex-start',
              }}
            >
              MERN STACK & AI DEVELOPER
            </span>

            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1.1,
                margin: 0,
                color: '#ffffff',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.22em',
              }}
            >
              <div style={{ display: 'inline-flex' }} className="shimmer-vamshi">
                {nameVamshi.map((letter, index) => (
                  <motion.span
                    key={`v-${index}`}
                    variants={letterVariants}
                    whileHover={{ y: -10, color: '#ff0000', scale: 1.1 }}
                    style={{ display: 'inline-block', cursor: 'default', color: 'inherit', WebkitTextFillColor: 'inherit', transition: 'color 0.1s ease' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <div style={{ display: 'inline-flex' }} className="shimmer-gowni">
                {nameGowni.map((letter, index) => (
                  <motion.span
                    key={`g-${index}`}
                    variants={letterVariants}
                    whileHover={{ y: -10, color: '#ffffff', scale: 1.1 }}
                    style={{ display: 'inline-block', cursor: 'default', color: 'inherit', WebkitTextFillColor: 'inherit', transition: 'color 0.1s ease' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.h1>

            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.6, margin: 0 }}>
              Designing and engineering high-performance web applications using <span style={{ color: '#ffffff', fontWeight: 600 }}>MongoDB, Express, React, and Node.js</span>, combined with cutting-edge <span style={{ color: '#ff0000', fontWeight: 600 }}>Artificial Intelligence</span> capabilities.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '10px' }}>
              <motion.a
                href="/resume.pdf"
                download="Vamshi_Resume.pdf"
                whileHover={{ scale: 1.03, backgroundColor: '#cc0000' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#ff0000',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 14px rgba(255, 0, 0, 0.4)',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <Download size={18} /> Download CV
              </motion.a>

              <motion.a
                href="#projects"
                onClick={handleScrollToProjects}
                whileHover={{
                  scale: 1.03,
                  borderColor: '#ff0000',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  boxShadow: '0 0 20px rgba(255, 0, 0, 0.35)'
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-display)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <Eye size={18} /> View Projects
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          zIndex: 10,
        }}
        onClick={handleScrollToProjects}
      >
        <span>SCROLL DOWN</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} style={{ color: '#ff0000' }} />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .home-container {
            flex-direction: column-reverse !important;
            padding-top: 100px !important;
            height: auto !important;
            min-height: 100vh !important;
            justify-content: flex-end !important;
            pointer-events: auto !important;
          }
          .left-details {
            width: 100% !important;
            align-items: center !important;
            text-align: center !important;
            padding-bottom: 60px !important;
            margin-top: 20px !important;
          }
          .left-details > div {
            padding-right: 0 !important;
            align-items: center !important;
          }
          .left-details span {
            align-self: center !important;
          }
          .left-details div {
            justify-content: center !important;
          }
          .right-robot {
            position: relative !important;
            width: 100% !important;
            height: 380px !important;
            right: auto !important;
            top: auto !important;
          }
        }
        @keyframes mobile-orb-pulse {
          0% { transform: scale(0.96); box-shadow: 0 0 35px rgba(255, 0, 0, 0.3); }
          100% { transform: scale(1.04); box-shadow: 0 0 55px rgba(255, 0, 0, 0.5); }
        }
        @keyframes mobile-ring-rotate-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes mobile-ring-rotate-counter {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>
    </section>
  );
};

export default Home;
