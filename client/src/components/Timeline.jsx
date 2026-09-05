import React from 'react';
import { motion } from 'framer-motion';
import { FlowArt, FlowSection } from './FlowArt';
import { Briefcase, Sparkles, Award, GraduationCap, ExternalLink } from 'lucide-react';


const timelineEvents = [
  {
    id: 'tl-1',
    year: 'MAY 2026 – JUL 2026',
    title: 'Research Intern',
    subtitle: 'Indian Institute of Technology Madras (Chennai, India)',
    researchTitle: 'Study of LLM Watermarking via Pseudorandom Codes',
    description: 'Conducted advanced research on Large Language Model (LLM) watermarking using Pseudorandom Codes (PRCs), focusing on secure and robust text watermarking techniques. Studied Reed–Solomon and Folded Reed–Solomon codes, list recovery algorithms, and cryptographic security proofs involving soundness, undetectability, and adaptive robustness.',
    badges: ['LLM Watermarking', 'Pseudorandom Codes', 'Reed-Solomon Codes', 'Security Proofs', 'Cryptography'],
    certificateUrl: 'https://drive.google.com/file/d/1BPo9zB2vY3gcm5fuC1HL5trjYJcy7Ls2/view?usp=drive_link',
    color: '#a855f7',
    icon: <Briefcase size={16} />,
  },
  {
    id: 'tl-2',
    year: '2026 – 2027',
    title: 'B.Tech Final Year Exchange Program (MoU)',
    subtitle: 'Indian Institute of Technology Madras (Chennai, India)',
    description: 'Selected for the prestigious final year academic exchange program in Computer Science and Engineering under institutional MoU at IIT Madras, engaging in advanced research and cutting-edge engineering curriculum.',
    badges: ['Computer Science', 'Exchange Program', 'MoU', 'IIT Madras', 'Advanced Systems'],
    color: '#ff4444',
    icon: <GraduationCap size={16} />,
  },
  {
    id: 'tl-3',
    year: '2023 – 2027',
    title: 'B.Tech in Computer Science & Engineering (AI & Data Science)',
    subtitle: 'Indian Institute of Information Technology Manipur (CPI: 8.10)',
    description: 'Pursuing B.Tech with specialization in Artificial Intelligence & Data Science, maintaining a strong academic CPI of 8.10. Focused on MERN stack architectures, machine learning pipelines, scalable backend engineering, and algorithmic problem solving.',
    badges: ['AI & Data Science', 'CPI: 8.10', 'MERN Stack', 'Algorithms', 'Data Structures', 'Deep Learning'],
    color: '#06b6d4',
    icon: <Sparkles size={16} />,
  },
  {
    id: 'tl-4',
    year: '2021 – 2023',
    title: 'Intermediate (Class XII) — 97%',
    subtitle: 'Sri Chaitanya Junior College (Vijayawada, Andhra Pradesh)',
    description: 'Completed higher secondary education with a stellar score of 97%, building a rigorous analytical foundation in Mathematics, Physics, and quantitative analysis.',
    badges: ['Score: 97%', 'Mathematics', 'Physics', 'Analytical Problem Solving'],
    color: '#22c55e',
    icon: <Award size={16} />,
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

            {/* Top Left Header with Horizontal Slide & Neon Laser Wipe Scroll Animation */}
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
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                    display: 'inline-block',
                  }}
                >
                  MILESTONE 0{index + 1} / 0{timelineEvents.length}
                </motion.span>
              </div>

              <motion.h2
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  textShadow: `0 0 40px ${item.color}25`,
                  position: 'relative',
                }}
              >
                TIMELINE <span style={{ color: item.color }}>// {item.year}</span>

                {/* Laser Accent Glow Line that expands from left */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'block',
                    height: '2px',
                    width: '180px',
                    marginTop: '8px',
                    background: `linear-gradient(90deg, ${item.color}, transparent)`,
                    transformOrigin: 'left',
                    boxShadow: `0 0 10px ${item.color}`,
                  }}
                />
              </motion.h2>
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

                    {item.certificateUrl && (
                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          background: `${item.color}25`,
                          border: `1px solid ${item.color}80`,
                          borderRadius: '8px',
                          padding: '4px 12px',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-mono)',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = item.color;
                          e.currentTarget.style.color = '#000000';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${item.color}25`;
                          e.currentTarget.style.color = '#ffffff';
                        }}
                      >
                        <span>[View Certificate]</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {item.researchTitle && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.88rem',
                        color: 'rgba(255, 255, 255, 0.95)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderLeft: `3px solid ${item.color}`,
                        padding: '6px 12px',
                        borderRadius: '0 6px 6px 0',
                        fontFamily: 'var(--font-mono)',
                        marginTop: '2px',
                      }}
                    >
                      <span style={{ color: item.color, fontWeight: 700 }}>Research Title:</span>
                      <span>{item.researchTitle}</span>
                    </div>
                  )}
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
