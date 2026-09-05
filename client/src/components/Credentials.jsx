import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, ExternalLink, Sparkles, CheckCircle2, FileCheck, ShieldCheck } from 'lucide-react';

const credentialsData = [
  {
    id: 'gate-qual',
    type: 'ACHIEVEMENT',
    title: 'GATE Qualified — CS & IT',
    subtitle: 'Graduate Aptitude Test in Engineering',
    organization: 'Computer Science & Engineering',
    year: '2026',
    description: 'Qualified the prestigious national Graduate Aptitude Test in Engineering (GATE) in Computer Science & Engineering, demonstrating rigorous mastery of algorithmic analysis, operating systems, compiler design, discrete mathematics, and computer architecture.',
    tags: ['National Examination', 'Algorithms & DS', 'Theory of Computation', 'Computer Systems'],
    proofUrl: 'https://drive.google.com/file/d/18Qm-6iXfkg0gXYS5jLaWOfxoju0GXJxX/view?usp=drive_link',
    buttonText: 'View GATE Proof',
    color: '#ff4444',
    icon: <Award size={22} />,
    featured: true,
  },
  {
    id: 'iitm-cert',
    type: 'RESEARCH CERTIFICATION',
    title: 'Research Internship Certification',
    subtitle: 'Indian Institute of Technology Madras',
    organization: 'IIT Madras — Chennai, India',
    year: 'May – Jul 2026',
    description: 'Certified research tenure investigating LLM Watermarking via Pseudorandom Codes (PRCs), Reed-Solomon and Folded Reed-Solomon list recovery, and cryptographic security proofs under faculty mentorship.',
    tags: ['IIT Madras', 'LLM Watermarking', 'Pseudorandom Codes', 'Cryptography'],
    proofUrl: 'https://drive.google.com/file/d/1BPo9zB2vY3gcm5fuC1HL5trjYJcy7Ls2/view?usp=drive_link',
    buttonText: 'View IITM Certificate',
    color: '#a855f7',
    icon: <Sparkles size={22} />,
    featured: false,
  },
  {
    id: 'python-cert',
    type: 'TECHNICAL CERTIFICATION',
    title: 'Python Certification',
    subtitle: 'Spoken Tutorial, IIT Bombay',
    organization: 'National Mission on Education through ICT (MHRD)',
    year: 'Certified',
    description: 'Certified in Python development, object-oriented system design, algorithmic scripting, and numerical computations by Spoken Tutorial project, IIT Bombay.',
    tags: ['IIT Bombay', 'Python Core & OOP', 'Data Processing', 'Spoken Tutorial'],
    proofUrl: 'https://drive.google.com/file/d/1B-ugd1JLz8kTLnvBM1YXPJjGEwdbVfrt/view?usp=drivesdk',
    buttonText: 'View IITB Certificate',
    color: '#3b82f6',
    icon: <CheckCircle2 size={22} />,
    featured: false,
  },
  {
    id: 'cpp-cert',
    type: 'TECHNICAL CERTIFICATION',
    title: 'C++ Certification',
    subtitle: 'Spoken Tutorial, IIT Bombay',
    organization: 'National Mission on Education through ICT (MHRD)',
    year: 'Certified',
    description: 'Certified in modern C++ programming, memory management, Standard Template Library (STL), and computational efficiency through rigorous IIT Bombay examination.',
    tags: ['IIT Bombay', 'C++ & STL', 'Memory Architecture', 'OOP Design'],
    proofUrl: 'https://drive.google.com/file/d/1v4IqAtm-2CU2NrHLrqj3hvQVUFG9HRU3/view?usp=drivesdk',
    buttonText: 'View IITB Certificate',
    color: '#00c7b7',
    icon: <FileCheck size={22} />,
    featured: false,
  },
];

// Interactive 3D Tilt Card Component
const TiltCredentialCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, spotlightX: 50, spotlightY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-10 to 10 deg)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const spotlightX = (x / rect.width) * 100;
    const spotlightY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, spotlightX, spotlightY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, spotlightX: 50, spotlightY: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 65, scale: 0.78 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 20,
        delay: (index % 4) * 0.1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isHovered ? 1.02 : 1.0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.5,
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isHovered ? `1px solid ${item.color}80` : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isHovered
            ? `0 20px 45px -10px ${item.color}35, 0 0 30px ${item.color}15`
            : '0 10px 30px rgba(0, 0, 0, 0.3)',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Dynamic Cursor Spotlight Effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isHovered
              ? `radial-gradient(circle 280px at ${tilt.spotlightX}% ${tilt.spotlightY}%, ${item.color}18, transparent 70%)`
              : 'none',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Top Accent Glowing Line with Animated Shimmer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: `linear-gradient(90deg, ${item.color}, transparent)`,
            zIndex: 2,
          }}
        />

        {/* Card Header & Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <motion.span
              whileHover={{ scale: 1.05 }}
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: item.color,
                fontFamily: 'var(--font-mono)',
                background: `${item.color}15`,
                border: `1px solid ${item.color}40`,
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ShieldCheck size={12} />
              {item.type}
            </motion.span>

            <motion.div
              animate={{ rotate: isHovered ? 8 : 0, scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: `${item.color}15`,
                border: `1px solid ${item.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                boxShadow: isHovered ? `0 0 15px ${item.color}40` : 'none',
              }}
            >
              {item.icon}
            </motion.div>
          </div>

          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 6px 0',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            {item.title}
          </h3>

          <h4
            style={{
              fontSize: '0.85rem',
              color: item.color,
              fontWeight: 700,
              margin: '0 0 14px 0',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {item.subtitle}
          </h4>

          <p
            style={{
              color: 'rgba(255, 255, 255, 0.72)',
              fontSize: '0.86rem',
              lineHeight: 1.65,
              margin: '0 0 20px 0',
            }}
          >
            {item.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
            {item.tags.map((tag, tIdx) => (
              <motion.span
                key={tIdx}
                whileHover={{ scale: 1.05, borderColor: `${item.color}60` }}
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'default',
                  transition: 'border-color 0.2s',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.a
            href={item.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '11px 16px',
              borderRadius: '10px',
              background: isHovered ? item.color : `${item.color}18`,
              border: `1px solid ${item.color}60`,
              color: isHovered ? '#000000' : '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              boxShadow: isHovered ? `0 4px 18px ${item.color}60` : 'none',
              transition: 'background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease',
              cursor: 'pointer',
            }}
          >
            <span>{item.buttonText}</span>
            <motion.span
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink size={14} />
            </motion.span>
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Credentials = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="credentials"
      ref={sectionRef}
      style={{
        width: '100%',
        padding: '100px 24px',
        background: '#0c0c0c',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Animated Ambient background glows */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.04, 0.08, 0.04],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '25%',
          left: '5%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 68, 68, 0.6) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.04, 0.09, 0.04],
          x: [0, -25, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '5%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Animated Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#ff4444',
              background: 'rgba(255, 68, 68, 0.08)',
              border: '1px solid rgba(255, 68, 68, 0.25)',
              padding: '6px 18px',
              borderRadius: '99px',
              fontFamily: 'var(--font-mono)',
              display: 'inline-block',
            }}
          >
            VERIFIED CREDENTIALS & HONORS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, scale: 0.85, y: 35 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginTop: '18px',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-display)',
            }}
          >
            Honors & <span className="shimmer-gowni">Certifications</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              color: 'var(--text-muted)',
              fontSize: '1rem',
              maxWidth: '620px',
              margin: '14px auto 0 auto',
              lineHeight: 1.6,
            }}
          >
            National competitive qualifications and official technical certifications awarded by IIT Madras and IIT Bombay. Click any credential to inspect the verified document proof.
          </motion.p>
        </div>

        {/* Credentials Grid with Staggered 3D Tilt Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
          className="credentials-grid"
        >
          {credentialsData.map((item, index) => (
            <TiltCredentialCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Credentials;
