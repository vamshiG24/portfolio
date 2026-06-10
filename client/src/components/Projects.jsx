import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: "BioSecure Access System",
    subtitle: "Voice + Face Biometric Authentication",
    description: "A secure, dual-factor biometric verification system. Employs ECAPA-TDNN for speaker voice validation and DeepFace for facial recognition. Integrated with a Flask REST API and React client.",
    tech: ["Flask", "React", "Python", "Deep Learning"],
    github: "https://github.com/vamshiG24/BioSecure-Access",
    demo: "https://github.com/vamshiG24/BioSecure-Access",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Secure Digital Evidence Management",
    subtitle: "Data Integrity Case Log",
    description: "A secure MERN platform designed for law enforcement to catalog digital evidence. Features cryptographic SHA-256 integrity validation, role-based access logs, and secure cloud assets storage.",
    tech: ["MongoDB", "Express.js", "React", "Node.js"],
    github: "https://github.com/vamshiG24/secure-digital-evidence",
    demo: "https://secure-digital-evidence.vercel.app",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "EEG Seizure Detection Web App",
    subtitle: "Medical AI Predictor",
    description: "Medical imaging tool running real-time inference on EEG signals using a deep convolutional neural network (CNN) to predict epileptic seizures. Includes decision dashboards.",
    tech: ["Flask", "TensorFlow", "Keras", "Pandas", "React"],
    github: "https://github.com/vamshiG24/Seizure-Detection-project-main",
    demo: "#",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
  }
];

const ProjectCard = ({ project, index, isInView }) => {
  const getInitialStyle = () => {
    if (index === 0) return { opacity: 0, x: -60, y: 0 };
    if (index === 2) return { opacity: 0, x: 60, y: 0 };
    return { opacity: 0, x: 0, y: 60 };
  };

  const getAnimateStyle = () => {
    if (isInView) {
      return { opacity: 1, x: 0, y: 0 };
    }
    return {};
  };

  return (
    <motion.div
      initial={getInitialStyle()}
      animate={getAnimateStyle()}
      transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 15, delay: index * 0.15 }}
      className="glass-card project-card-custom"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        background: 'var(--card-bg)',
      }}
    >
      {/* Sheen sweep overlay */}
      <div className="card-sheen" />

      {/* Image container */}
      <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={project.image}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          className="project-card-image"
        />
        {/* Soft elegant overlay */}
        <div className="project-image-overlay" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent, rgba(133, 77, 14, 0.15))',
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none'
        }} />
        {/* Accent bar */}
        <div className="accent-bar" />
      </div>

      {/* Content */}
      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{project.title}</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--yellow-dark)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{project.subtitle}</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, flex: 1, margin: 0 }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '4px 0' }}>
          {project.tech.map((tag, idx) => (
            <span
              key={idx}
              className="tech-tag"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-tertiary)',
                border: '1px solid rgba(202, 138, 4, 0.12)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 500,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', paddingTop: '12px', borderTop: '1px solid rgba(234, 179, 8, 0.08)' }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="proj-link"
          >
            <Github size={16} /> Code
          </a>
          {project.demo !== '#' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="proj-link"
            >
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
        </div>
      </div>
      
      <style>{`
        .project-card-custom {
          transition: border-color 0.5s ease, box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .project-card-custom:hover {
          transform: translateY(-12px) scale(1.02) !important;
          border-color: rgba(250, 204, 21, 0.55) !important;
          box-shadow: 0 20px 40px -10px rgba(202, 138, 4, 0.35), 0 0 30px 5px rgba(250, 204, 21, 0.25) !important;
        }
        .project-card-image {
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .project-card-custom:hover .project-card-image {
          transform: scale(1.08);
        }
        .project-card-custom:hover .project-image-overlay {
          opacity: 0.25;
        }
        .card-sheen {
          position: absolute;
          top: 0;
          left: -150%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.45),
            transparent
          );
          transform: skewX(-25deg);
          pointer-events: none;
          z-index: 10;
          transition: none;
        }
        .project-card-custom:hover .card-sheen {
          left: 150%;
          transition: left 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .accent-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--yellow), var(--yellow-dark));
          transition: height 0.3s ease, filter 0.3s ease;
        }
        .project-card-custom:hover .accent-bar {
          height: 5px;
          filter: drop-shadow(0 0 8px var(--yellow));
        }
        .tech-tag:hover {
          background: var(--yellow-light) !important;
          color: var(--yellow-deep) !important;
          transform: translateY(-2px);
          border-color: var(--yellow-dark) !important;
        }
        .proj-link:hover {
          color: var(--yellow-dark) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </motion.div>
  );
};

const Projects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        width: '100%',
        padding: '100px 24px',
        background: 'var(--bg-secondary)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}
          >
            Featured <span style={{ color: 'var(--yellow-dark)' }}>Projects</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}
          >
            A selection of my recent research, Web Development and AI projects
          </motion.p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
