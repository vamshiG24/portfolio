import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(ScrollTrigger, Observer);

const logs = [
  {
    title: "BioSecure Access - Multimodal Biometric Integration",
    challenge: "Integrating voice (ECAPA-TDNN) and face (DeepFace) authentication in real-time was complex, especially handling audio from the browser and ensuring smooth verification.",
    solution: "Pre-processed browser WebM audio to 16kHz WAV for the model. Set up separate pipelines for voice and face recognition using Flask. Tested the integration to achieve a working real-time authentication prototype.",
    date: "Mar 2026",
    category: "AI & MULTIMODAL VERIFICATION",
    color: "rgba(139, 92, 246, 0.9)"
  },
  {
    title: "Secure Digital Evidence Management - Cryptographic Hash Integrity",
    challenge: "Ensuring evidence files were tamper-proof using SHA-256 hashing while storing them securely in the cloud.",
    solution: "Implemented SHA-256 hashing for uploaded evidence files. Stored evidence files in Cloudinary and linked their hashes in MongoDB.",
    date: "Feb 2026",
    category: "SECURITY & IMMUTABLE LEDGERS",
    color: "rgba(6, 182, 212, 0.9)"
  },
  {
    title: "EEG Seizure Detection - CNN Model Overfitting",
    challenge: "CNN model overfitted on training EEG data (high training accuracy but low validation accuracy), making it hard to generalize to new EEG patterns.",
    solution: "Added dropout layers and batch normalization to the CNN model. Used data augmentation to improve generalization. Monitored validation metrics to ensure the model learned meaningful patterns.",
    date: "Nov 2025",
    category: "DEEP LEARNING MODEL OPTIMIZATION",
    color: "rgba(34, 197, 94, 0.9)"
  }
];

const LogCard = ({ log, index, totalCards, cardRef }) => {
  const color = log.color || "rgba(139, 92, 246, 0.9)";
  const [hovered, setHovered] = useState(false);

  // Extract raw RGB from color string for dynamic glow
  const colorBase = color.replace('rgba(', '').replace('0.9)', '').trim().replace(',', '').replace(',', '').split(' ');

  return (
    <div ref={cardRef} className="log-card-wrapper">
      <div
        className="glass-card log-normal-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          borderRadius: '28px',
          border: `1px solid ${hovered ? color.replace('0.9', '0.45') : 'rgba(255, 255, 255, 0.07)'}`,
          background: hovered
            ? `rgba(12, 12, 18, 0.92)`
            : 'rgba(8, 8, 12, 0.85)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          boxShadow: hovered
            ? `0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px ${color.replace('0.9','0.35')}, 0 0 80px ${color.replace('0.9','0.22')}, inset 0 1px 0 ${color.replace('0.9','0.2')}`
            : `0 40px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)`,
          filter: hovered ? 'brightness(1.25)' : 'brightness(1)',
          overflow: 'hidden',
          padding: '0',
          transition: 'box-shadow 0.4s ease, filter 0.4s ease, border-color 0.4s ease, background 0.4s ease',
        }}>


        {/* Ambient color blob — top left */}
        <div style={{
          position: 'absolute', top: '-70px', left: '-50px',
          width: hovered ? '420px' : '320px',
          height: hovered ? '420px' : '320px',
          borderRadius: '50%',
          background: color.replace('0.9', hovered ? '0.28' : '0.13'),
          filter: `blur(${hovered ? '80px' : '70px'})`,
          pointerEvents: 'none', zIndex: 0,
          transition: 'all 0.5s ease',
        }} />

        {/* Ambient color blob — bottom right */}
        <div style={{
          position: 'absolute', bottom: '-50px', right: '-50px',
          width: hovered ? '300px' : '220px',
          height: hovered ? '300px' : '220px',
          borderRadius: '50%',
          background: color.replace('0.9', hovered ? '0.22' : '0.08'),
          filter: `blur(${hovered ? '65px' : '55px'})`,
          pointerEvents: 'none', zIndex: 0,
          transition: 'all 0.5s ease',
        }} />

        {/* Top color stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: `linear-gradient(90deg, transparent 0%, ${color} 35%, ${color.replace('0.9','0.45')} 65%, transparent 100%)`,
          borderRadius: '28px 28px 0 0', zIndex: 2,
        }} />

        {/* Glass top shine */}
        <div style={{
          position: 'absolute', top: '3px', left: '15px', right: '15px', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16) 50%, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Large index watermark */}
        <div style={{
          position: 'absolute', top: '-16px', right: '30px',
          fontSize: '9.5rem', fontWeight: 900,
          fontFamily: 'var(--font-display)',
          color: color.replace('0.9', '0.05'),
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
          zIndex: 0, letterSpacing: '-0.05em',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* ── Inner content ── */}
        <div style={{ position: 'relative', zIndex: 1, padding: '38px 42px 38px' }}>

          {/* Row 1: Category pill + Date */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '22px', flexWrap: 'wrap', gap: '12px',
          }}>
            {/* Pill badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 14px 5px 10px', borderRadius: '999px',
              background: color.replace('0.9', '0.11'),
              border: `1px solid ${color.replace('0.9', '0.32')}`,
              boxShadow: `0 0 14px ${color.replace('0.9', '0.14')}`,
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: color, boxShadow: `0 0 7px ${color}`, flexShrink: 0,
              }} />
              <span style={{
                fontSize: '0.67rem', color: color, fontWeight: 800,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {log.category}
              </span>
            </div>

            {/* Date badge */}
            <div style={{
              padding: '4px 13px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{
                fontSize: '0.77rem', color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.06em',
              }}>
                {log.date}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 style={{
            fontSize: 'clamp(1.1rem, 2.2vw, 1.48rem)', fontWeight: 800,
            margin: '0 0 26px 0', color: '#ffffff',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.022em',
            lineHeight: 1.3, maxWidth: '88%',
          }}>
            {log.title}
          </h3>

          {/* Decorative divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '26px' }}>
            <div style={{
              flex: 1, height: '1px',
              background: `linear-gradient(90deg, ${color.replace('0.9','0.45')}, rgba(255,255,255,0.03))`,
            }} />
            <div style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: color.replace('0.9','0.65'), boxShadow: `0 0 9px ${color}`,
            }} />
            <div style={{
              flex: 1, height: '1px',
              background: 'rgba(255,255,255,0.04)',
            }} />
          </div>

          {/* Grid: Challenge | Solution */}
          <div className="log-grid-content" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px',
          }}>

            {/* Challenge panel */}
            <div className="challenge-col-hover" style={{
              background: color.replace('0.9', '0.05'),
              border: `1px solid ${color.replace('0.9', '0.18')}`,
              borderTop: `2px solid ${color.replace('0.9', '0.65')}`,
              padding: '22px', borderRadius: '16px',
              display: 'flex', flexDirection: 'column', gap: '14px',
              transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
            }}>
              {/* panel top shine */}
              <div style={{
                position: 'absolute', top: 0, left: '18%', right: '18%', height: '1px',
                background: `linear-gradient(90deg, transparent, ${color.replace('0.9','0.38')}, transparent)`,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <div style={{
                  width: '33px', height: '33px', borderRadius: '10px',
                  background: color.replace('0.9', '0.14'),
                  border: `1px solid ${color.replace('0.9', '0.28')}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <AlertCircle size={15} style={{ color }} />
                </div>
                <h4 style={{
                  fontSize: '0.7rem', textTransform: 'uppercase',
                  letterSpacing: '0.1em', color, fontWeight: 800,
                  fontFamily: 'var(--font-mono)', margin: 0,
                }}>
                  Challenge
                </h4>
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                lineHeight: '1.68', margin: 0,
              }}>
                {log.challenge}
              </p>
            </div>

            {/* Solution panel */}
            <div className="solution-col-hover" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderTop: '2px solid rgba(255,255,255,0.5)',
              padding: '22px', borderRadius: '16px',
              display: 'flex', flexDirection: 'column', gap: '14px',
              transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
            }}>
              {/* panel top shine */}
              <div style={{
                position: 'absolute', top: 0, left: '18%', right: '18%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <div style={{
                  width: '33px', height: '33px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Sparkles size={15} style={{ color: '#ffffff' }} />
                </div>
                <h4 style={{
                  fontSize: '0.7rem', textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: 'rgba(255,255,255,0.82)',
                  fontWeight: 800, fontFamily: 'var(--font-mono)', margin: 0,
                }}>
                  Solution
                </h4>
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
                lineHeight: '1.68', margin: 0,
              }}>
                {log.solution}
              </p>
            </div>
          </div>

          {/* Bottom status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '26px', paddingTop: '18px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="pulse-dot" style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.9)',
              }} />
              <span style={{
                fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.07em',
              }}>RESOLVED</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['PROD', 'DEPLOYED'].map(tag => (
                <span key={tag} style={{
                  fontSize: '0.6rem', padding: '3px 9px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.28)',
                  fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.08em',
                }}>{tag}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const BuildLogs = () => {
  const sectionRef = useRef(null);
  const cardsListRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  useEffect(() => {
    const cards = cardRefs.current;
    if (cards.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    gsap.set(cards, { y: "0%", scale: 1, opacity: 1 });
    for (let i = 1; i < cards.length; i++) {
      gsap.set(cards[i], { y: "100%", opacity: 0 });
    }

    let activeIndex = 0;
    let isAnimating = false;

    const tl = gsap.timeline({ paused: true });

    for (let i = 1; i < cards.length; i++) {
      tl.addLabel(`card-${i - 1}`);
      tl.to(cards[i], { y: "0%", opacity: 1, duration: 0.8, ease: "power2.out" }, `slide-${i}`);
      for (let j = 0; j < i; j++) {
        const targetScale = 1 - (i - j) * 0.05;
        const targetOpacity = 1 - (i - j) * 0.15;
        tl.to(cards[j], { scale: targetScale, opacity: targetOpacity, duration: 0.8, ease: "power2.out" }, `slide-${i}`);
      }
    }
    tl.addLabel(`card-${cards.length - 1}`);

    const pinTrigger = ScrollTrigger.create({
      trigger: "#buildlogs",
      start: "top top",
      end: `+=${(cards.length - 1) * 100}%`,
      pin: true,
      onEnter: () => { activeIndex = 0; gsap.set(tl, { progress: 0 }); observer.enable(); },
      onLeave: () => { observer.disable(); },
      onEnterBack: () => { activeIndex = cards.length - 1; gsap.set(tl, { progress: 1 }); observer.enable(); },
      onLeaveBack: () => { observer.disable(); }
    });

    const goToCard = (index) => {
      if (index < 0 || index >= cards.length || isAnimating) return;
      isAnimating = true;
      activeIndex = index;
      gsap.to(tl, {
        progress: index / (cards.length - 1),
        duration: 0.7, ease: "power2.out",
        onComplete: () => { isAnimating = false; }
      });
    };

    const observer = Observer.create({
      target: window,
      type: "wheel,touch",
      preventDefault: true,
      onDown: () => {
        if (isAnimating) return;
        if (activeIndex < cards.length - 1) {
          goToCard(activeIndex + 1);
        } else {
          observer.disable();
          window.scrollTo({ top: pinTrigger.end + 2, behavior: "smooth" });
        }
      },
      onUp: () => {
        if (isAnimating) return;
        if (activeIndex > 0) {
          goToCard(activeIndex - 1);
        } else {
          observer.disable();
          window.scrollTo({ top: pinTrigger.start - 2, behavior: "smooth" });
        }
      },
      tolerance: 15,
      active: false
    });

    return () => {
      if (pinTrigger) pinTrigger.kill();
      if (observer) observer.kill();
      if (tl) tl.kill();
    };
  }, []);

  return (
    <section
      id="buildlogs"
      ref={sectionRef}
      className="buildlogs-section"
      style={{
        width: '100%', height: '100vh',
        background: '#0a0a0e',
        position: 'relative', display: 'flex',
        flexDirection: 'column', justifyContent: 'center',
        padding: '40px 24px', overflow: 'hidden'
      }}
    >
      <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px', flexShrink: 0 }}>
          <span style={{
            color: 'rgba(139, 92, 246, 0.85)', fontWeight: 700,
            fontSize: '0.78rem', textTransform: 'uppercase',
            letterSpacing: '0.18em', fontFamily: 'var(--font-mono)',
            display: 'block', marginBottom: '10px'
          }}>
            TECHNICAL ARCHITECTURE
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '10px',
            color: '#ffffff', fontWeight: 800,
            fontFamily: 'var(--font-display)', letterSpacing: '-0.02em'
          }}>
            Build <span className="shimmer-gowni">Logs</span>
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.38)', fontSize: '1rem',
            maxWidth: '580px', margin: '0 auto', lineHeight: 1.55
          }}>
            A technical breakdown of engineering obstacles solved and core model architectures deployed.
          </p>
        </div>

        {/* Stacking Cards */}
        <div
          ref={cardsListRef}
          className="log-cards-list"
          style={{ position: 'relative', width: '100%', flex: 1, overflow: 'hidden' }}
        >
          {logs.map((log, index) => (
            <LogCard
              key={index}
              log={log}
              index={index}
              totalCards={logs.length}
              cardRef={addToRefs}
            />
          ))}
        </div>
      </div>

      <style>{`
        .log-card-wrapper {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%; height: 100%;
        }
        .challenge-col-hover {
          transition: transform 0.3s ease, filter 0.3s ease, background 0.3s ease;
        }
        .challenge-col-hover:hover {
          transform: translateY(-3px);
          filter: brightness(1.25);
        }
        .solution-col-hover {
          transition: transform 0.3s ease, filter 0.3s ease, background 0.3s ease;
        }
        .solution-col-hover:hover {
          background: rgba(255,255,255,0.065) !important;
          transform: translateY(-3px);
          filter: brightness(1.2);
        }
        .log-normal-card {
          transition: box-shadow 0.4s ease, filter 0.4s ease, border-color 0.4s ease;
        }
        .log-normal-card:hover {
          filter: brightness(1.12);
          border-color: rgba(255,255,255,0.16) !important;
          box-shadow: 0 48px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.12), 0 0 60px rgba(139,92,246,0.1) !important;
        }
        .log-normal-card .card-shimmer {
          position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.055) 50%, transparent 60%);
          pointer-events: none; z-index: 3;
          transition: none;
        }
        .log-normal-card:hover .card-shimmer {
          animation: shimmer-sweep 0.65s ease forwards;
        }
        @keyframes shimmer-sweep {
          from { left: -80%; }
          to   { left: 130%; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(34,197,94,0.9); }
          50% { opacity: 0.65; box-shadow: 0 0 16px rgba(34,197,94,0.5); }
        }
        .pulse-dot {
          animation: pulse-glow 2.2s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .buildlogs-section {
            height: auto !important;
            padding: 60px 20px !important;
            overflow: visible !important;
          }
          .log-cards-list {
            overflow: visible !important;
            height: auto !important;
          }
          .log-card-wrapper {
            position: relative !important;
            height: auto !important;
            margin-bottom: 24px !important;
            display: block !important;
          }
          .log-grid-content {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
          .log-normal-card {
            transform: none !important;
            scale: 1 !important;
            top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default BuildLogs;
