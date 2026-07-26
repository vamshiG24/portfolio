import React from 'react';
import { FlowArt, FlowSection } from './FlowArt';
import { Briefcase, Sparkles, Award, GraduationCap } from 'lucide-react';

const timelineEvents = [
  {
    id: 'tl-1',
    year: '2026 - PRESENT',
    title: 'Lead AI & Cryptographic Security Architect',
    subtitle: 'BioSecure Access & Immutable Hash Ledgers',
    description: 'Architected zero-trust multimodal biometric authentication pairing ECAPA-TDNN neural voice embedding models with DeepFace facial recognition (99.4% accuracy under <120ms latency). Engineered a SHA-256 digital evidence hash ledger providing automated tamper detection and cryptographic audit logs.',
    badges: ['Flask', 'React', 'PyTorch', 'MongoDB', 'SHA-256', 'WebSockets'],
    color: '#a855f7',
    icon: <Briefcase size={16} />,
  },
  {
    id: 'tl-2',
    year: '2025',
    title: 'Neural Signal Deep Learning Researcher',
    subtitle: 'CNN EEG Seizure Prediction & Frequency Analytics',
    description: 'Engineered end-to-end convolutional neural network (CNN) architectures for early EEG epileptic seizure prediction. Applied Fourier Transform (FFT) matrix spectral decomposition, dropout regularization, and batch normalization to achieve robust generalization across clinical neural datasets.',
    badges: ['TensorFlow', 'Keras', 'Python', 'SciPy', 'NumPy', 'Matplotlib'],
    color: '#22c55e',
    icon: <Sparkles size={16} />,
  },
  {
    id: 'tl-3',
    year: '2024',
    title: 'Full-Stack Web & 3D Systems Engineer',
    subtitle: 'High-Performance MERN & GSAP Web Applications',
    description: 'Developed scalable full-stack web applications and interactive 3D portfolio environments using React, Node.js, Express, and GSAP ScrollTrigger animation engines. Optimized WebGL render pipelines and responsive layouts for 60 FPS performance.',
    badges: ['React', 'Node.js', 'Express', 'GSAP', 'Three.js', 'TailwindCSS'],
    color: '#06b6d4',
    icon: <Award size={16} />,
  },
  {
    id: 'tl-4',
    year: '2023 - 2024',
    title: 'Computer Science & Engineering Graduate',
    subtitle: 'Core Algorithms & Distributed Systems',
    description: 'Graduated with technical honors in Computer Science & Engineering. Mastered advanced data structures, asymptotic algorithm analysis, database query optimization, cloud computing infrastructure, and machine learning mathematical foundations.',
    badges: ['Data Structures', 'Algorithms', 'Distributed Systems', 'Cloud Computing', 'Machine Learning'],
    color: '#ff4444',
    icon: <GraduationCap size={16} />,
  },
];

const Timeline = ({ lowSpecMode }) => {
  return (
    <section id="timeline" style={{ width: '100%', position: 'relative', background: '#0c0c0c' }}>
      <FlowArt aria-label="Experience timeline scroll">
        {timelineEvents.map((item, index) => (
          <FlowSection key={item.id} className="bg-[#0c0c0c]">
            {/* Background Ambient Glow */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '500px',
                height: '300px',
                background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Top Left Header (Large Display Typography) */}
            <div
              style={{
                width: '100%',
                maxWidth: '1050px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingTop: '60px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: item.color,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: '99px',
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}40`,
                  }}
                >
                  MILESTONE 0{index + 1} / 0{timelineEvents.length}
                </span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  textShadow: `0 0 40px ${item.color}25`,
                }}
              >
                TIMELINE <span style={{ color: item.color }}>// {item.year}</span>
              </h2>
            </div>

            {/* Main Content Area with Timeline Node Axis */}
            <div
              style={{
                width: '100%',
                maxWidth: '1050px',
                margin: '0 auto',
                display: 'flex',
                gap: '32px',
                paddingTop: '24px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Vertical Timeline Axis Node Line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px' }}>
                {/* Glowing Orb Node */}
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 20px ${item.color}, 0 0 40px ${item.color}80`,
                    border: '3px solid #0c0c0c',
                    flexShrink: 0,
                  }}
                />
                {/* Glowing Axis Bar */}
                <div
                  style={{
                    width: '2px',
                    flex: 1,
                    background: `linear-gradient(to bottom, ${item.color}, rgba(255,255,255,0.05))`,
                    marginTop: '8px',
                  }}
                />
              </div>

              {/* Milestone Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                {/* Title & Subtitle Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3
                    style={{
                      fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
                      fontWeight: 900,
                      color: '#ffffff',
                      margin: 0,
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '-0.015em',
                      lineHeight: 1.15,
                    }}
                  >
                    {item.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        color: item.color,
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.icon}
                      <span>{item.subtitle}</span>
                    </div>
                  </div>
                </div>

                {/* Description Paragraph */}
                <p
                  style={{
                    fontSize: 'clamp(0.98rem, 1.6vw, 1.15rem)',
                    color: 'rgba(240, 240, 245, 0.88)',
                    lineHeight: 1.75,
                    margin: 0,
                    fontFamily: 'var(--font-sans)',
                    maxWidth: '850px',
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.description}
                </p>

                {/* Skill Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      marginRight: '4px',
                    }}
                  >
                    STACK:
                  </span>
                  {item.badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      style={{
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '6px 18px',
                        borderRadius: '99px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${item.color}50`,
                        color: '#ffffff',
                        boxShadow: `0 0 15px ${item.color}15`,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div style={{ width: '100%', maxWidth: '1050px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>
                FLOW-ART ROTATION PINNING
              </span>
              <span style={{ fontSize: '0.72rem', color: item.color, fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                {item.year}
              </span>
            </div>
          </FlowSection>
        ))}
      </FlowArt>
    </section>
  );
};

export default Timeline;
