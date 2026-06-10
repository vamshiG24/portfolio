import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Calendar, Briefcase, Award, GraduationCap } from 'lucide-react';

const timelineData = [
  {
    year: "2023",
    title: "Foundations, C++ & DSA",
    description: "Began core programming. Mastered C and C++ and solved hundreds of data structures & algorithms problems. Built foundational knowledge of HTML, CSS, and vanilla JS.",
    icon: <GraduationCap size={18} />,
    achievements: ["Mastered C/C++ fundamentals", "Solved 300+ DSA problems", "Built responsive static landing pages"]
  },
  {
    year: "2024",
    title: "Full Stack MERN Development",
    description: "Expanded into modern web development. Mastered React, Express, MongoDB, Node.js, and API integrations, building end-to-end full-stack applications.",
    icon: <Briefcase size={18} />,
    achievements: ["Built multi-user REST web apps", "Mastered Mongoose & database design", "Deployed apps with custom domain/SSL"]
  },
  {
    year: "2025",
    title: "Artificial Intelligence Research",
    description: "Shifted research focus to Deep Learning. Created medical imaging models for EEG seizure prediction and speech/face biometric validation systems.",
    icon: <Calendar size={18} />,
    achievements: ["ECAPA-TDNN voice models", "TensorFlow & CNN signal analysis", "Biometric face-matching pipelines"]
  },
  {
    year: "Future",
    title: "Production AI & Open Source",
    description: "Building production-grade AI tools. Collaborating on open-source packages and engineering solutions that merge LLMs with standard product architectures.",
    icon: <Award size={18} />,
    achievements: ["LLM integration products", "Open source contributions", "System design mastery"]
  },
];

const TimelineCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-120px" });
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className={`timeline-row ${isLeft ? 'row-left' : 'row-right'}`}
      style={{
        display: 'grid',
        width: '100%',
        position: 'relative',
        marginBottom: '48px',
      }}
    >
      {/* Central/Left Dot */}
      <div className="timeline-badge-container">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="timeline-badge-dot"
        >
          {item.icon}
        </motion.div>
      </div>

      {/* Card Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="timeline-panel glass-card"
        style={{ 
          padding: '28px', 
          borderLeft: '4px solid var(--yellow-dark)', 
          position: 'relative',
          background: 'var(--card-bg)',
          textAlign: 'left'
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--yellow-dark)', fontFamily: 'var(--font-mono)' }}>{item.year}</span>
        <h3 style={{ fontSize: '1.25rem', margin: '8px 0 12px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '16px' }}>{item.description}</p>
        <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {item.achievements.map((ach, idx) => (
            <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{ach}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

const Timeline = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="timeline"
      ref={containerRef}
      style={{
        width: '100%',
        padding: '100px 24px',
        background: 'var(--bg-secondary)',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}
          >
            My <span style={{ color: 'var(--yellow-dark)' }}>Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}
          >
            A timeline of my growth, technical education, and projects
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div style={{ position: 'relative', marginTop: '40px' }}>
          {/* Vertical central line */}
          <div
            className="timeline-center-line"
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '100%',
              background: 'rgba(202, 138, 4, 0.12)',
            }}
          >
            <motion.div
              style={{
                width: '100%',
                height: lineHeight,
                background: 'linear-gradient(to bottom, var(--yellow-light), var(--yellow), var(--yellow-dark))',
                boxShadow: '0 0 8px var(--yellow-glow)',
              }}
            />
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
            {timelineData.map((item, index) => (
              <TimelineCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        .timeline-row {
          grid-template-columns: 1fr 60px 1fr;
          align-items: center;
        }
        .row-left .timeline-panel {
          grid-column: 1;
        }
        .row-left .timeline-badge-container {
          grid-column: 2;
        }
        .row-right .timeline-panel {
          grid-column: 3;
        }
        .row-right .timeline-badge-container {
          grid-column: 2;
        }
        
        .timeline-badge-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
        
        .timeline-badge-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--bg-primary);
          border: 3px solid var(--yellow-dark);
          box-shadow: 0 4px 10px rgba(202, 138, 4, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--yellow-dark);
          z-index: 5;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .timeline-row:hover .timeline-panel {
          border-left-color: var(--yellow) !important;
          transform: translateY(-5px) scale(1.01) !important;
          box-shadow: var(--shadow-lg), 0 8px 30px -4px rgba(234, 179, 8, 0.15) !important;
        }

        .timeline-row:hover .timeline-badge-dot {
          background-color: var(--yellow) !important;
          color: var(--text-primary) !important;
          transform: scale(1.2) !important;
          border-color: var(--yellow-dark) !important;
          box-shadow: 0 0 15px var(--yellow-glow-strong) !important;
        }

        @media (max-width: 767px) {
          .timeline-center-line {
            left: 20px !important;
          }
          .timeline-row {
            display: flex !important;
            flex-direction: row !important;
            gap: 16px !important;
            margin-bottom: 36px !important;
          }
          .timeline-badge-container {
            width: 40px !important;
            flex-shrink: 0 !important;
            justify-content: center !important;
            height: auto !important;
            align-items: flex-start !important;
            padding-top: 10px !important;
          }
          .timeline-panel {
            flex: 1 !important;
            width: auto !important;
            text-align: left !important;
          }
          .row-left .timeline-panel, .row-right .timeline-panel {
            grid-column: unset !important;
            transform: none !important;
          }
          .row-left .timeline-badge-container, .row-right .timeline-badge-container {
            grid-column: unset !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Timeline;
