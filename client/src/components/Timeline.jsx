import React from 'react';
import { FlowArt, FlowSection } from './FlowArt';
import { Calendar, Terminal, Briefcase, Award, Sparkles, GraduationCap } from 'lucide-react';

const timelineEvents = [
  {
    id: 'tl-1',
    year: '2026 - PRESENT',
    title: 'Lead AI & Full-Stack Architect',
    subtitle: 'BioSecure & Immutable Ledger Systems',
    description: 'Architected real-time multimodal biometric authentication (ECAPA-TDNN voice + DeepFace embeddings) and SHA-256 digital evidence cryptographic hash ledgers with zero latency.',
    badges: ['Flask', 'React', 'PyTorch', 'MongoDB', 'SHA-256'],
    color: '#a855f7',
    icon: <Briefcase size={16} />,
  },
  {
    id: 'tl-2',
    year: '2025',
    title: 'Deep Learning & ML Engineer',
    subtitle: 'Neural Signal Processing Research',
    description: 'Engineered CNN EEG seizure prediction models with dropout regularization, batch normalization, and Fourier transform frequency matrix pre-processing to eliminate overfitting.',
    badges: ['TensorFlow', 'Keras', 'Python', 'SciPy', 'NumPy'],
    color: '#22c55e',
    icon: <Sparkles size={16} />,
  },
  {
    id: 'tl-3',
    year: '2024',
    title: 'Full-Stack Software Developer',
    subtitle: 'Web Application Ecosystems',
    description: 'Architected high-performance full-stack web applications, interactive 3D web applications, and real-time backend API services using React, Node.js, and GSAP animations.',
    badges: ['React', 'Node.js', 'Express', 'GSAP', 'TailwindCSS'],
    color: '#06b6d4',
    icon: <Award size={16} />,
  },
  {
    id: 'tl-4',
    year: '2023 - 2024',
    title: 'Computer Science & Engineering',
    subtitle: 'Academic Honors & Technical Excellence',
    description: 'Mastered advanced data structures, algorithm optimization, cloud computing architectures, and neural network fundamentals while leading engineering projects.',
    badges: ['Data Structures', 'Algorithms', 'Cloud Computing', 'Machine Learning'],
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
