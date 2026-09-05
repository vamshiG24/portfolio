import { ZoomParallax } from './ui/zoom-parallax';
import { motion } from 'framer-motion';

const Projects = ({ lowSpecMode }) => {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      alt: 'Portfolio Showcase Hub',
      title: 'Featured Engineering Systems',
      description: 'Production-grade Full Stack and AI/ML systems — biometric authentication and forensic evidence management. Scroll to explore.',
      tech: ['React', 'Node.js', 'Flask', 'Gemini AI', 'Docker']
    },
    {
      src: '/images/buildlog_bg_biosecure.png',
      alt: 'BioSecure Multi-Modal Biometric Authentication',
      title: 'BioSecure — Multimodal Biometrics',
      description: 'Multi-modal biometric authentication system using voice, face, and hand geometry recognition with ECAPA-TDNN, VGG-Face, and ORB + BFMatcher. Built with React, Node.js, Flask, and MongoDB.',
      tech: ['React', 'Node.js', 'Flask', 'MongoDB', 'ECAPA-TDNN', 'VGG-Face'],
      github: 'https://github.com/vamshiG24/BioSecure-Access',
      demo: 'https://github.com/vamshiG24/BioSecure-Access'
    },
    {
      src: '/images/buildlog_bg_ledger.png',
      alt: 'Secure Digital Evidence Management Platform',
      title: 'Secure Digital Evidence Platform',
      description: 'Secure digital evidence platform using MERN microservices with SHA-256 tamper-detection hashing, chain-of-custody logging, and Gemini 2.5 Flash multimodal RAG for forensic Q&A.',
      tech: ['React', 'Node.js', 'MongoDB', 'Docker', 'Socket.IO', 'Gemini AI'],
      github: 'https://github.com/vamshiG24/secure-digital-evidence',
      demo: 'https://secure-digital-evidence.vercel.app'
    }
  ];

  return (
    <section
      id="projects"
      style={{
        width: '100%',
        backgroundColor: '#0c0c0c',
        position: 'relative',
        // A clipping ancestor prevents the sticky parallax scene from painting
        // for its full scroll range.
        overflow: 'visible',
        borderTop: '1px solid rgba(255, 0, 0, 0.05)',
      }}
    >
      {/* Header Details with Cinematic Blur-In & Track-In Scroll Animation */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 0px 24px', textAlign: 'center', zIndex: 10, position: 'relative' }}>
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.4em', y: -15 }}
          whileInView={{ opacity: 1, letterSpacing: '0.2em', y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            color: '#ff0000', 
            background: 'rgba(255,0,0,0.06)', 
            border: '1px solid rgba(255,0,0,0.18)', 
            padding: '6px 16px', 
            borderRadius: '99px',
            fontFamily: 'var(--font-mono)',
            display: 'inline-block',
          }}
        >
          FEATURED PORTFOLIO
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, filter: 'blur(16px)', scale: 1.15, y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'white', marginTop: '20px', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}
        >
          Innovative <span className="shimmer-gowni">Projects</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '680px', margin: '15px auto 0 auto', lineHeight: 1.6 }}
        >
          Production-grade multimodal biometric authentication, MERN microservices, cryptographic SHA-256 evidence ledgers, and Gemini 2.5 Flash RAG systems.
        </motion.p>
      </div>

      <ZoomParallax images={images} lowSpecMode={lowSpecMode} />
    </section>
  );
};

export default Projects;
