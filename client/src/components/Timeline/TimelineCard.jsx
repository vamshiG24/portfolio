import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Folder } from 'lucide-react';
import MouseGlow from './MouseGlow';
import StatsCounter from './StatsCounter';
import ReflectionCard from './ReflectionCard';

const TimelineCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;

  // Stagger children config
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const orbitTechs = item.technologies.slice(0, 4);

  return (
    <div
      ref={cardRef}
      className={`timeline-row ${isLeft ? 'row-left' : 'row-right'}`}
      style={{
        display: 'grid',
        width: '100%',
        position: 'relative',
        marginBottom: '80px',
      }}
    >
      {/* 1. Orbiting Tech Icons Around the Node Dot */}
      <div className="timeline-badge-container">
        <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Main Central Dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="timeline-badge-dot"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: `3px solid ${item.theme.color}`,
              boxShadow: `0 0 15px ${item.theme.glow}`,
              color: item.theme.color,
              width: '44px',
              height: '44px',
              zIndex: 5
            }}
          >
            <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{item.year === "Future" ? "FT" : item.year.slice(2)}</span>
          </motion.div>

          {/* Orbiting Tech tags */}
          {isInView && orbitTechs.map((tech, idx) => {
            const angle = idx * 90;
            return (
              <div
                key={idx}
                className="orbit-item"
                style={{
                  '--orbit-angle': `${angle}deg`,
                  position: 'absolute',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                <div className="orbit-item-inner">
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'var(--card-bg)',
                      border: `1px solid ${item.theme.border}`,
                      color: item.theme.text,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {tech}
                  </span>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* 2. Glassmorphic Card Container with Mouse Glow */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50, scale: 0.95 }}
        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="timeline-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'transparent',
          boxShadow: 'none'
        }}
      >
        <MouseGlow theme={item.theme}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="dashboard-timeline-card"
            style={{
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderLeft: `5px solid ${item.theme.color}`,
              background: 'transparent', // controlled by MouseGlow glass-blur
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Neon Corner Accents ( tl / tr / bl / br ) */}
            <div className="neon-corner corner-tl" />
            <div className="neon-corner corner-tr" />
            <div className="neon-corner corner-bl" />
            <div className="neon-corner corner-br" />

            {/* SVG Border Beam traveling light effect */}
            <svg
              style={{
                position: 'absolute',
                inset: -1,
                width: 'calc(100% + 2px)',
                height: 'calc(100% + 2px)',
                pointerEvents: 'none',
                borderRadius: 'inherit',
                zIndex: 4
              }}
            >
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                rx="20"
                fill="none"
                stroke={`url(#beam-grad-${index})`}
                strokeWidth="2"
                strokeDasharray="90 350"
                className="border-beam-rect"
                style={{
                  opacity: 0,
                  transition: 'opacity 0.4s ease'
                }}
              />
              <defs>
                <linearGradient id={`beam-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={item.theme.color} stopOpacity="0" />
                  <stop offset="50%" stopColor={item.theme.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={item.theme.color} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Row 1: Header (Title, Subtitle & Floating Year Badge) - Section Highlight (Career) */}
            <div className="card-sub-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <motion.h3
                  variants={itemVariants}
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {item.title}
                </motion.h3>

                <motion.h4
                  variants={itemVariants}
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    margin: 0,
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.01em'
                  }}
                >
                  {item.subtitle}
                </motion.h4>
              </div>

              {/* Styled floating Year Badge */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 16px',
                  borderRadius: '30px',
                  background: item.theme.badgeBg,
                  border: `1px solid ${item.theme.border}`
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: item.theme.text, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                  {item.year}
                </span>
              </motion.div>
            </div>

            {/* Row 2: Description */}
            <motion.p
              variants={itemVariants}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.94rem',
                lineHeight: 1.65,
                margin: 0,
                padding: '0 8px'
              }}
            >
              {item.description}
            </motion.p>

            {/* Row 3: Metrics Dashboard (Stats row) - Section Highlight (Stats) */}
            <motion.div
              variants={itemVariants}
              className="card-sub-section"
              style={{
                display: 'flex',
                gap: '24px',
                padding: '16px 20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: `1px solid ${item.theme.border}`,
                alignSelf: 'stretch',
                justifyContent: 'space-around',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', color: item.theme.text, fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  <StatsCounter value={item.stats.projects} />
                </span>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Projects Completed</span>
              </div>

              {item.stats.research > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.4rem', color: item.theme.text, fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                    <StatsCounter value={item.stats.research} />
                  </span>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Research Papers</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', color: item.theme.text, fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  <StatsCounter value={item.stats.skills} />
                </span>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Technologies Used</span>
              </div>
            </motion.div>

            {/* Row 4: Grid split for Tech pills and Deliverables - Section Highlights */}
            <div className="card-columns-grid">

              {/* Tech stack - Section Highlight */}
              <motion.div variants={itemVariants} className="card-sub-section" style={{ flex: 1 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', paddingLeft: '4px' }}>
                  Tech Stack
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '4px' }}>
                  {item.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="tech-pill-badge"
                      style={{
                        fontSize: '0.72rem',
                        padding: '5px 12px',
                        borderRadius: '99px',
                        background: 'rgba(255, 255, 255, 0.85)',
                        border: '1px solid rgba(204, 0, 0, 0.12)',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Featured deliverables - Section Highlight */}
              <motion.div variants={itemVariants} className="card-sub-section" style={{ flex: 1.2 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', paddingLeft: '4px' }}>
                  Key Deliverables
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                  {item.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.55)',
                        border: `1px solid ${item.theme.border}`,
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                      }}
                    >
                      <Folder size={14} style={{ color: item.theme.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {proj.name}
                        </h5>
                        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '1px 0 0 0', lineHeight: 1.35 }}>{proj.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Row 5: Reflection typewriter box */}
            <motion.div variants={itemVariants} className="card-sub-section">
              <ReflectionCard text={item.reflection} theme={item.theme} />
            </motion.div>

          </motion.div>
        </MouseGlow>
      </motion.div>
    </div>
  );
};

export default TimelineCard;
