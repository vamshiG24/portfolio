import { useEffect, useState } from 'react';
import { ArrowDown, Download, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Typewriter from 'react-typewriter-effect';

const quotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "Simplicity is the soul of efficiency.",
  "Stay hungry, stay foolish.",
];

const AIAssistantCharacter = ({ voiceActive }) => {
  return (
    <div 
      className="glass-card floating-accent-card"
      style={{
        width: '100%',
        maxWidth: '400px',
        aspectRatio: '1/1',
        padding: '24px',
        border: '1px solid rgba(202, 138, 4, 0.42)',
        borderRadius: '50%',
        position: 'relative',
        boxShadow: voiceActive 
          ? '0 30px 60px -12px rgba(202, 138, 4, 0.45), 0 0 40px rgba(250, 204, 21, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
          : '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 8px 24px -8px rgba(202, 138, 4, 0.22), 0 0 15px rgba(250, 204, 21, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 243, 199, 0.4) 50%, rgba(255, 255, 255, 0.9) 100%)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        zIndex: 2,
        overflow: 'visible',
        cursor: 'default',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Click instructions badge */}
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: voiceActive 
          ? 'linear-gradient(90deg, #CA8A04, #FACC15)' 
          : 'linear-gradient(90deg, var(--text-secondary), var(--text-muted))',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '99px',
        padding: '4px 14px',
        fontSize: '0.68rem',
        fontWeight: '700',
        color: '#FFFFFF',
        boxShadow: voiceActive 
          ? '0 6px 16px rgba(202, 138, 4, 0.45)' 
          : '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        whiteSpace: 'nowrap',
        zIndex: 10,
        transition: 'all 0.4s ease',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: voiceActive ? '#ef4444' : '#FACC15',
          display: 'inline-block',
          animation: 'pulse-dot 1s infinite alternate'
        }} />
        {voiceActive ? 'ARIA SPEAKING...' : 'ARIA AI ASSISTANT'}
      </div>

      <svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Laptop hologram gradient */}
          <linearGradient id="laptop-glow" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--yellow)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--yellow-light)" stopOpacity="0.0" />
          </linearGradient>

          {/* Golden radial aura */}
          <radialGradient id="aura-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--yellow)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--yellow)" stopOpacity="0" />
          </radialGradient>

          {/* Hologram card gradient */}
          <linearGradient id="hologram-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(250, 204, 21, 0.15)" />
            <stop offset="100%" stopColor="rgba(251, 146, 60, 0.05)" />
          </linearGradient>
        </defs>

        {/* Ambient background glow */}
        <circle cx="200" cy="200" r="160" fill="url(#aura-glow)" />

        {/* Neural connection web in background */}
        <g opacity="0.35">
          {/* Nodes */}
          <circle cx="80" cy="120" r="4" fill="var(--yellow-dark)" />
          <circle cx="120" cy="80" r="3" fill="var(--yellow)" />
          <circle cx="280" cy="100" r="5" fill="var(--yellow-dark)" />
          <circle cx="320" cy="160" r="3" fill="var(--yellow)" />
          {/* Lines */}
          <line x1="80" y1="120" x2="120" y2="80" stroke="var(--yellow-dark)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="120" y1="80" x2="280" y2="100" stroke="var(--yellow-dark)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="280" y1="100" x2="320" y2="160" stroke="var(--yellow-dark)" strokeWidth="1" strokeDasharray="2,2" />
        </g>

        {/* THE CHAIR */}
        <g className="svg-chair">
          {/* Backrest support */}
          <path d="M 125,230 L 115,310" stroke="var(--text-muted)" strokeWidth="8" strokeLinecap="round" />
          {/* Ergonomic backrest pillow */}
          <rect x="105" y="160" width="16" height="85" rx="8" fill="var(--text-secondary)" stroke="var(--text-primary)" strokeWidth="2" />
          {/* Seat cushion */}
          <rect x="110" y="275" width="75" height="12" rx="6" fill="var(--text-secondary)" stroke="var(--text-primary)" strokeWidth="2" />
          {/* Central Cylinder */}
          <line x1="145" y1="287" x2="145" y2="345" stroke="var(--text-muted)" strokeWidth="10" />
          <line x1="145" y1="300" x2="145" y2="345" stroke="var(--text-primary)" strokeWidth="6" />
          {/* Base / Wheels legs */}
          <path d="M 115,345 L 175,345" stroke="var(--text-secondary)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="115" cy="350" r="5" fill="var(--text-primary)" />
          <circle cx="175" cy="350" r="5" fill="var(--text-primary)" />
        </g>

        {/* THE MAN (SITTING) */}
        <g className="svg-man">
          {/* Legs (sitting profile) */}
          {/* Thigh */}
          <path d="M 145,268 L 210,268" stroke="var(--text-secondary)" strokeWidth="18" strokeLinecap="round" />
          {/* Calf / Shin */}
          <path d="M 210,268 L 210,345" stroke="var(--text-secondary)" strokeWidth="16" strokeLinecap="round" />
          {/* Foot / Shoe */}
          <path d="M 210,345 L 230,345" stroke="var(--text-primary)" strokeWidth="10" strokeLinecap="round" />

          {/* Torso */}
          <path d="M 138,190 Q 142,275 160,275 C 170,275 175,275 178,240 Q 170,190 155,190 Z" fill="var(--text-primary)" />

          {/* Head & Neck */}
          <path d="M 148,185 L 152,165" stroke="#EAE5E0" strokeWidth="8" strokeLinecap="round" />
          {/* Face structure */}
          <circle cx="152" cy="150" r="16" fill="#F5F5F4" stroke="var(--text-secondary)" strokeWidth="2" />
          {/* Hair (Sleek side-part) */}
          <path d="M 140,146 C 140,132 158,130 166,140 C 168,142 165,148 160,146 C 155,144 148,148 140,146 Z" fill="var(--text-secondary)" />
          {/* AI Communication Headset (earbud glowing gold) */}
          <circle cx="148" cy="152" r="3.5" fill="var(--yellow-dark)" />
          <motion.circle 
            cx={148} 
            cy={152} 
            r={6} 
            fill="none" 
            stroke="var(--yellow)" 
            strokeWidth={1.5}
            animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Typing Arm (Left Arm) */}
          <path d="M 152,198 Q 185,215 208,210 Q 218,205 224,218" stroke="var(--text-secondary)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="224" cy="218" r="4" fill="#F5F5F4" />

          {/* Gesturing Arm (Right Arm) - animates on voice speaking */}
          <motion.path 
            d="M 158,198 Q 185,178 200,165 Q 215,152 230,158" 
            stroke="var(--text-primary)" 
            strokeWidth="11" 
            strokeLinecap="round" 
            fill="none" 
            animate={voiceActive ? {
              d: [
                "M 158,198 Q 185,178 200,165 Q 215,152 230,158",
                "M 158,198 Q 180,168 205,150 Q 225,132 235,142",
                "M 158,198 Q 185,178 200,165 Q 215,152 230,158"
              ]
            } : {
              y: [0, 2, 0]
            }}
            transition={{
              duration: voiceActive ? 2.5 : 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.circle 
            cx={230} 
            cy={158} 
            r={4.5} 
            fill="#F5F5F4"
            animate={voiceActive ? {
              cx: [230, 235, 230],
              cy: [158, 142, 158]
            } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>

        {/* THE TABLE & LAPTOP */}
        <g className="svg-table">
          {/* Laptop Screen projection beam */}
          <motion.polygon 
            points="242,228 270,228 320,130 190,130" 
            fill="url(#laptop-glow)" 
            animate={{ opacity: voiceActive ? [0.25, 0.45, 0.25] : [0.15, 0.25, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Table Surface */}
          <rect x="180" y="228" width="160" height="8" rx="4" fill="var(--text-secondary)" stroke="var(--text-primary)" strokeWidth="2" />
          {/* Desk Legs */}
          <line x1="200" y1="236" x2="200" y2="350" stroke="var(--text-muted)" strokeWidth="5" />
          <line x1="320" y1="236" x2="320" y2="350" stroke="var(--text-muted)" strokeWidth="5" />
          <line x1="195" y1="350" x2="325" y2="350" stroke="var(--text-secondary)" strokeWidth="6" strokeLinecap="round" />

          {/* Laptop */}
          {/* Base */}
          <polygon points="225,228 275,228 268,222 232,222" fill="var(--text-primary)" />
          {/* Screen (Angled open) */}
          <polygon points="268,222 284,188 280,186 264,220" fill="var(--text-muted)" />
          <polygon points="266,221 281,189 278,187 263,219" fill="var(--yellow-light)" opacity="0.9" />
        </g>

        {/* SPEECH AND VOICE WAVES (Shown when voiceActive is true) */}
        <AnimatePresence>
          {voiceActive && (
            <g className="svg-voice-waves">
              {/* Concentric sound wave arcs emanating from the AI mouth / head */}
              <motion.path 
                d="M 175,145 A 25,25 0 0,1 175,175" 
                stroke="var(--yellow-dark)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                fill="none" 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: 1.1 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              />
              <motion.path 
                d="M 185,135 A 40,40 0 0,1 185,185" 
                stroke="var(--yellow)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                fill="none" 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: 1.15 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
              <motion.path 
                d="M 195,125 A 55,55 0 0,1 195,195" 
                stroke="var(--yellow-dark)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                fill="none" 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: 1.2 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
              />

              {/* Glowing speech particle orbs rising */}
              <motion.circle 
                cx="180" 
                cy="130" 
                r="4" 
                fill="var(--yellow)" 
                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                animate={{ y: -60, x: -10, opacity: 0, scale: 1.2 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.circle 
                cx="210" 
                cy="120" 
                r="3" 
                fill="var(--yellow-dark)" 
                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                animate={{ y: -70, x: 15, opacity: 0, scale: 1 }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.5, ease: 'easeOut' }}
              />
            </g>
          )}
        </AnimatePresence>

        {/* HOLOGRAPHIC FLOATING WIDGETS */}
        {/* Widget 1: Tech Chart Line (Floats in top right) */}
        <motion.g 
          className="svg-widget-chart"
          initial={{ y: 0 }}
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Glass frame */}
          <rect x="250" y="50" width="90" height="50" rx="10" fill="url(#hologram-grad)" stroke="rgba(234, 179, 8, 0.3)" strokeWidth={1} style={{ backdropFilter: 'blur(5px)' }} />
          {/* Chart line */}
          <path d="M 260,85 L 280,70 L 295,80 L 315,62 L 330,75" stroke="var(--yellow)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx={315} cy={62} r={3} fill="var(--yellow-dark)" />
          <motion.circle 
            cx={315} 
            cy={62} 
            r={6} 
            fill="none" 
            stroke="var(--yellow)" 
            strokeWidth={1}
            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Chart title */}
          <text x="260" y="62" fill="var(--yellow-deep)" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700">AI CORE</text>
        </motion.g>

        {/* Widget 2: Sparkle & Code bubble (Floats top left) */}
        <motion.g 
          className="svg-widget-code"
          initial={{ y: 0 }}
          animate={{ y: [4, -8, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <rect x="50" y="40" width="80" height="32" rx="8" fill="url(#hologram-grad)" stroke="rgba(234, 179, 8, 0.25)" strokeWidth="1" />
          <text x="60" y="60" fill="var(--text-secondary)" fontSize="9" fontFamily="var(--font-mono)">&lt;AI /&gt;</text>
          {/* Golden Sparkle */}
          <path d="M 112,50 Q 112,56 118,56 Q 112,56 112,62 Q 112,56 106,56 Q 112,56 112,50 Z" fill="var(--yellow)" />
        </motion.g>

        {/* Equalizer overlay on screen when voice active */}
        <g transform="translate(250, 240)">
          <motion.rect 
            x="0" y="0" width="3" height="8" rx="1.5" fill="var(--yellow)"
            animate={voiceActive ? { height: [4, 16, 4] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.rect 
            x="6" y="0" width="3" height="12" rx="1.5" fill="var(--yellow-dark)"
            animate={voiceActive ? { height: [6, 20, 6] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          />
          <motion.rect 
            x="12" y="0" width="3" height="6" rx="1.5" fill="var(--yellow)"
            animate={voiceActive ? { height: [3, 14, 3] } : {}}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.rect 
            x="18" y="0" width="3" height="10" rx="1.5" fill="var(--yellow-deep)"
            animate={voiceActive ? { height: [5, 18, 5] } : {}}
            transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
          />
        </g>

        {/* Floating Digital Ring surrounding the developer */}
        <motion.circle 
          cx="200" 
          cy="260" 
          rx="120" 
          ry="30" 
          fill="none" 
          stroke="rgba(234, 179, 8, 0.12)" 
          strokeWidth="1.5" 
          strokeDasharray="5,15"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 260px' }}
        />
      </svg>

      {/* Decorative ambient lighting overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: voiceActive
          ? 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(250, 204, 21, 0.08) 100%)'
          : 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(250, 204, 21, 0.02) 100%)',
        pointerEvents: 'none',
        borderRadius: 'inherit',
        transition: 'background 0.5s ease',
      }} />

      {/* Small floating sound equalizer animation to match navbar */}
      {voiceActive && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '24px',
          display: 'flex',
          gap: '2px',
          height: '14px',
          alignItems: 'flex-end',
        }}>
          <span className="wave-bar bar-1" style={{ width: '2px', height: '6px' }}></span>
          <span className="wave-bar bar-2" style={{ width: '2px', height: '12px' }}></span>
          <span className="wave-bar bar-3" style={{ width: '2px', height: '8px' }}></span>
          <span className="wave-bar bar-4" style={{ width: '2px', height: '14px' }}></span>
        </div>
      )}
    </div>
  );
};

const Home = ({ voiceActive, toggleSpeech }) => {
  const [animDone, setAnimDone] = useState(false);
  const nameVamshi = "Vamshi".split("");
  const nameGowni = "Gowni".split("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleScrollToProjects = (e) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 80% 20%, rgba(250, 204, 21, 0.12) 0%, transparent 60%)',
      }}
    >
      {/* Decorative background orbs */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(250, 204, 21, 0.04)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '40px',
          alignItems: 'center',
          zIndex: 5,
        }}
        className="home-grid"
      >
        {/* Left Column: Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Immediate Name Header block */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, margin: 0, color: 'var(--text-primary)' }}>
              Hi, I'm <br />
              <span className={animDone ? "name-container" : ""} style={{ display: 'inline-flex', gap: '0.35em', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="gradient-text-yellow" style={{ display: 'inline-flex' }}>
                  {nameVamshi.map((letter, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ y: -8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                      style={{ display: 'inline-block', cursor: 'default' }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
                <motion.span 
                  className="gradient-text-yellow"
                  initial={{ x: -120, opacity: 0, filter: 'drop-shadow(0 0 0px rgba(250, 204, 21, 0))' }}
                  animate={{ 
                    x: 0, 
                    opacity: 1, 
                    filter: [
                      'drop-shadow(0 0 0px rgba(250, 204, 21, 0))',
                      'drop-shadow(0 0 25px rgba(250, 204, 21, 0.95))',
                      'drop-shadow(0 0 4px rgba(250, 204, 21, 0.15))'
                    ]
                  }}
                  onAnimationComplete={() => setAnimDone(true)}
                  transition={{ 
                    x: { type: 'spring', stiffness: 70, damping: 14, delay: 0.2 },
                    opacity: { duration: 0.6, delay: 0.2 },
                    filter: { duration: 2.2, times: [0, 0.4, 1], delay: 0.2 }
                  }}
                  style={{ display: 'inline-flex' }}
                >
                  {nameGowni.map((letter, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ y: -8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                      style={{ display: 'inline-block', cursor: 'default' }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* Subheading tag, subtitle, description, and buttons block that scales/fades in after Gowni sits */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <span 
              style={{
                color: 'var(--yellow-dark)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontFamily: 'var(--font-mono)'
              }}
            >
              WELCOME TO MY WORLD
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: 'var(--text-secondary)', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                Full-Stack MERN Developer & 
                <span style={{ 
                  background: 'linear-gradient(120deg, rgba(250, 204, 21, 0.18) 0%, rgba(249, 115, 22, 0.12) 100%)',
                  padding: '4px 14px',
                  borderRadius: '99px',
                  color: 'var(--yellow-deep)',
                  fontWeight: 700,
                  fontSize: '0.85em',
                  border: '1px solid rgba(202, 138, 4, 0.2)',
                  boxShadow: '0 4px 12px rgba(250, 204, 21, 0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}>
                  AI Enthusiast
                </span>
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
                I specialize in designing and engineering high-performance web applications using MongoDB, Express, React, and Node.js, combined with cutting-edge Artificial Intelligence capabilities.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '8px' }}>
                <motion.a
                  href="/resume.pdf"
                  download="Vamshi_Resume.pdf"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <Download size={18} /> Download CV
                </motion.a>

                <motion.a
                  href="#projects"
                  onClick={handleScrollToProjects}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  <Eye size={18} /> View Projects
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Visual Accent Card delayed until Gowni sits */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          className="home-visual-col"
        >
          <AIAssistantCharacter voiceActive={voiceActive} />

          {/* Minimal visual yellow wireframe circle */}
          <div 
            style={{
              position: 'absolute',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              border: '1.5px dashed rgba(202, 138, 4, 0.22)',
              boxShadow: '0 0 50px rgba(250, 204, 21, 0.06)',
              zIndex: -1,
              animation: 'spin-circle 30s linear infinite',
            }}
            className="wireframe-circle"
          />
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
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          cursor: 'pointer',
        }}
        onClick={handleScrollToProjects}
      >
        <span>SCROLL DOWN</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} style={{ color: 'var(--yellow-dark)' }} />
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes spin-circle {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-card {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-dot {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 1; }
        }
        .floating-accent-card {
          animation: float-card 6s ease-in-out infinite;
          transition: border-radius 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .floating-accent-card:hover {
          animation-play-state: paused;
          border-radius: 24px !important;
          box-shadow: 0 0 50px 10px rgba(250, 204, 21, 0.65), 0 0 80px 20px rgba(234, 179, 8, 0.35) !important;
          border-color: rgba(202, 138, 4, 0.8) !important;
          transform: scale(1.03) translateY(-6px) !important;
          filter: brightness(1.08) contrast(1.02);
        }
        @media (max-width: 991px) {
          .home-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .home-grid > div {
            align-items: center !important;
            margin: 0 auto;
            width: 100% !important;
          }
          .wireframe-circle {
            width: 320px !important;
            height: 320px !important;
          }
          .home-visual-col {
            margin-top: 20px;
            width: 100%;
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Home;
