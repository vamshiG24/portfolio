import React from 'react';
import { FlowArt, FlowSection } from './FlowArt';

const timelineEvents = [
  {
    id: 'tl-1',
    year: '2026 - PRESENT',
    title: 'Lead AI & Full-Stack Architect',
    subtitle: 'BioSecure & Immutable Ledger Systems',
    description: 'Architected real-time multimodal biometric authentication (ECAPA-TDNN voice + DeepFace embeddings) and SHA-256 digital evidence cryptographic hash ledgers with zero latency.',
    badges: ['Flask', 'React', 'PyTorch', 'MongoDB', 'SHA-256'],
    color: '#a855f7',
  },
  {
    id: 'tl-2',
    year: '2025',
    title: 'Deep Learning & ML Engineer',
    subtitle: 'Neural Signal Processing Research',
    description: 'Engineered CNN EEG seizure prediction models with dropout regularization, batch normalization, and Fourier transform frequency matrix pre-processing to eliminate overfitting.',
    badges: ['TensorFlow', 'Keras', 'Python', 'SciPy', 'NumPy'],
    color: '#22c55e',
  },
  {
    id: 'tl-3',
    year: '2024',
    title: 'Full-Stack Software Developer',
    subtitle: 'Web Application Ecosystems',
    description: 'Architected high-performance full-stack web applications, interactive 3D web applications, and real-time backend API services using React, Node.js, and GSAP animations.',
    badges: ['React', 'Node.js', 'Express', 'GSAP', 'TailwindCSS'],
    color: '#06b6d4',
  },
  {
    id: 'tl-4',
    year: '2023 - 2024',
    title: 'Computer Science & Engineering',
    subtitle: 'Academic Honors & Technical Excellence',
    description: 'Mastered advanced data structures, algorithm optimization, cloud computing architectures, and neural network fundamentals while leading engineering projects.',
    badges: ['Data Structures', 'Algorithms', 'Cloud Computing', 'Machine Learning'],
    color: '#ff4444',
  },
];

const Timeline = ({ lowSpecMode }) => {
  return (
    <section id="timeline" style={{ width: '100%', position: 'relative', background: '#0c0c0c' }}>
      <FlowArt aria-label="Experience timeline scroll">
        {timelineEvents.map((item, index) => (
          <FlowSection key={item.id} className="bg-[#0c0c0c]">
            {/* Top Left Header (Large Text) */}
            <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '80px' }}>
              <h2
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                }}
              >
                TIMELINE <span style={{ color: item.color }}>// {item.year}</span>
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                MILESTONE 0{index + 1} OF 0{timelineEvents.length}
              </span>
            </div>

            {/* Main Open Content (No Card Box) */}
            <div
              style={{
                width: '100%',
                maxWidth: '1000px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingTop: '10px',
              }}
            >
              <div
                style={{
                  borderLeft: `3px solid ${item.color}`,
                  paddingLeft: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <h3
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {item.title}
                </h3>
                <span
                  style={{
                    fontSize: '0.92rem',
                    color: item.color,
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.subtitle}
                </span>
                <p
                  style={{
                    fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)',
                    color: 'rgba(255, 255, 255, 0.82)',
                    lineHeight: 1.7,
                    margin: '6px 0 0 0',
                    fontFamily: 'var(--font-sans)',
                    maxWidth: '850px',
                  }}
                >
                  {item.description}
                </p>
              </div>

              {/* Competencies Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingLeft: '24px', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontWeight: 700, marginRight: '4px' }}>
                  SKILLS:
                </span>
                {item.badges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      padding: '6px 16px',
                      borderRadius: '99px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${item.color}50`,
                      color: '#ffffff',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Footer */}
            <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>
                FLOW-ART ROTATION PINNING
              </span>
              <span style={{ fontSize: '0.7rem', color: item.color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
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
