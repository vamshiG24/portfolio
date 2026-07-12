import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
    category: "AI/ML",
  },
  {
    title: "Secure Digital Evidence Management",
    subtitle: "Data Integrity Case Log",
    description: "A secure MERN platform designed for law enforcement to catalog digital evidence. Features cryptographic SHA-256 integrity validation, role-based access logs, and secure cloud assets storage.",
    tech: ["MongoDB", "Express.js", "React", "Node.js"],
    github: "https://github.com/vamshiG24/secure-digital-evidence",
    demo: "https://secure-digital-evidence.vercel.app",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80",
    category: "MERN Stack",
  },
  {
    title: "EEG Seizure Detection Web App",
    subtitle: "Medical AI Predictor",
    description: "Medical imaging tool running real-time inference on EEG signals using a deep convolutional neural network (CNN) to predict epileptic seizures. Includes decision dashboards.",
    tech: ["Flask", "TensorFlow", "Keras", "Pandas", "React"],
    github: "https://github.com/vamshiG24/Seizure-Detection-project-main",
    demo: "#",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    category: "AI/ML",
  }
];

const ProjectRow = ({ project, index }) => {
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, margin: "-120px" });
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const leftColAnim = {
    initial: { opacity: 0, x: -60, y: 0 },
    animate: isInView ? { opacity: 1, x: 0, y: 0 } : {},
    transition: {
      duration: 0.8,
      type: 'spring',
      stiffness: 80,
      damping: 15,
      delay: 0.1,
      y: { type: 'spring', stiffness: 300, damping: 20, delay: 0 },
      scale: { type: 'spring', stiffness: 300, damping: 20, delay: 0 }
    }
  };

  const rightColAnim = {
    initial: { opacity: 0, x: 60, y: 0 },
    animate: isInView ? { opacity: 1, x: 0, y: 0 } : {},
    transition: {
      duration: 0.8,
      type: 'spring',
      stiffness: 80,
      damping: 15,
      delay: 0.2,
      y: { type: 'spring', stiffness: 300, damping: 20, delay: 0 },
      scale: { type: 'spring', stiffness: 300, damping: 20, delay: 0 }
    }
  };

  const imageElement = (
    <motion.div
      {...(!isEven ? rightColAnim : leftColAnim)}
      whileHover={{ y: -8, scale: 1.01 }}
      className="project-image-wrapper"
      style={{
        flex: '1',
        minWidth: '320px',
        height: '340px',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid rgba(234, 179, 8, 0.16)',
        background: 'var(--card-bg)',
      }}
    >
      {/* Category Tag Overlay */}
      <span style={{
        position: 'absolute',
        top: '18px',
        left: '18px',
        background: 'rgba(28, 25, 22, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(250, 204, 21, 0.3)',
        color: '#FACC15',
        fontSize: '0.72rem',
        fontWeight: '700',
        fontFamily: 'var(--font-mono)',
        padding: '5px 14px',
        borderRadius: '99px',
        zIndex: 5,
        letterSpacing: '0.05em',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
      }}>
        {project.category}
      </span>

      {/* Sheen sweep overlay */}
      <div className="card-sheen" />

      <motion.img
        src={project.image}
        alt={project.title}
        style={{
          width: '100%',
          height: '120%',
          objectFit: 'cover',
          y: yTransform,
          position: 'absolute',
          top: '-10%',
        }}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="project-row-image"
      />

      <div className="project-image-overlay" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent, rgba(133, 77, 14, 0.2))',
        pointerEvents: 'none'
      }} />

      {/* Bottom glowing accent bar */}
      <div className="accent-bar" />
    </motion.div>
  );

  const contentElement = (
    <motion.div
      {...(isEven ? rightColAnim : leftColAnim)}
      className="project-info-wrapper"
      style={{
        flex: '1',
        minWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
      }}
    >
      <div>
        <span
          style={{
            fontSize: '0.78rem',
            color: 'var(--yellow-dark)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px'
          }}
        >
          {project.subtitle}
        </span>
        <h3
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            margin: 0,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}
        >
          {project.title}
        </h3>
      </div>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.98rem',
          lineHeight: '1.75',
          margin: 0
        }}
      >
        {project.description}
      </p>

      {/* Tech tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {project.tech.map((tag, idx) => (
          <span
            key={idx}
            className="tech-tag"
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              background: 'var(--bg-tertiary)',
              border: '1px solid rgba(202, 138, 4, 0.12)',
              padding: '5px 12px',
              borderRadius: '8px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="proj-row-btn btn-outline"
        >
          <Github size={16} /> Source Code
        </a>
        {project.demo !== '#' && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-row-btn btn-solid"
          >
            <ExternalLink size={16} /> Live Demo
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      ref={rowRef}
      layout
      exit={{ opacity: 0, scale: 0.95, y: 30 }}
      transition={{ duration: 0.6 }}
      className={`project-row-container ${isEven ? 'even-row' : 'odd-row'}`}
      style={{
        display: 'flex',
        gap: '64px',
        marginBottom: '120px',
        alignItems: 'center',
      }}
    >
      {isEven ? (
        <>
          {imageElement}
          {contentElement}
        </>
      ) : (
        <>
          {contentElement}
          {imageElement}
        </>
      )}
    </motion.div>
  );
};

const Projects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "AI/ML", "MERN Stack"];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        width: '100%',
        padding: '120px 24px',
        background: 'var(--bg-secondary)',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span
            style={{
              color: 'var(--yellow-dark)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-mono)',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            PORTFOLIO SHOWCASE
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '16px', color: 'var(--text-primary)', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
          >
            Featured <span style={{ color: 'var(--yellow-dark)' }}>Projects</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}
          >
            A curated selection of my research, Deep Learning implementations, and Full-Stack MERN applications.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '60px',
          flexWrap: 'wrap'
        }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '99px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-display)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--yellow-dark)' : 'rgba(234, 179, 8, 0.16)',
                  background: isActive ? 'linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)' : 'rgba(255, 255, 255, 0.75)',
                  color: '#1C1917',
                  opacity: isActive ? 1 : 0.82,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 8px 20px -6px rgba(202, 138, 4, 0.4), 0 0 15px rgba(250, 204, 21, 0.15)' : 'none',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  outline: 'none',
                }}
                className="filter-tab-btn"
              >
                {cat === 'All' ? '📂 All Projects' : cat === 'AI/ML' ? '🧠 AI / Machine Learning' : '💻 Full Stack MERN'}
              </button>
            );
          })}
        </div>

        {/* Rows Container */}
        <motion.div
          layout
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px'
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectRow
                key={project.title}
                project={project}
                index={idx}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        .filter-tab-btn:hover {
          transform: translateY(-2px);
          opacity: 1;
          border-color: var(--yellow-dark);
          box-shadow: 0 6px 14px -4px rgba(202, 138, 4, 0.25);
        }
        @media (max-width: 768px) {
          .project-row-container {
            flex-direction: column !important;
            gap: 32px !important;
            margin-bottom: 70px !important;
          }
          .even-row {
            flex-direction: column !important;
          }
          .odd-row {
            flex-direction: column !important;
          }
          .project-image-wrapper {
            width: 100% !important;
            height: 260px !important;
          }
          .project-info-wrapper {
            width: 100% !important;
          }
        }
        .project-image-wrapper {
          transition: border-color 0.4s ease, box-shadow 0.4s ease !important;
        }
        .project-image-wrapper:hover {
          border-color: rgba(250, 204, 21, 0.55) !important;
          box-shadow: 0 20px 40px -10px rgba(202, 138, 4, 0.35), 0 0 30px 5px rgba(250, 204, 21, 0.2) !important;
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
        .project-image-wrapper:hover .card-sheen {
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
        .project-image-wrapper:hover .accent-bar {
          height: 5px;
          filter: drop-shadow(0 0 8px var(--yellow));
        }
        .tech-tag:hover {
          background: var(--yellow-light) !important;
          color: var(--yellow-deep) !important;
          transform: translateY(-2px);
          border-color: var(--yellow-dark) !important;
        }
        .proj-row-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 0.88rem;
          font-weight: 700;
          font-family: var(--font-display);
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .btn-outline {
          color: var(--text-secondary);
          background: rgba(234, 179, 8, 0.02);
          border: 1px solid rgba(234, 179, 8, 0.16);
        }
        .btn-outline:hover {
          color: var(--text-primary) !important;
          background: rgba(250, 204, 21, 0.08) !important;
          border-color: var(--yellow-dark) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px -4px rgba(202, 138, 4, 0.15);
        }
        .btn-solid {
          color: #1C1917;
          background: linear-gradient(135deg, #FEF08A 0%, #FDE047 100%);
          border: 1px solid rgba(202, 138, 4, 0.4);
          box-shadow: 0 4px 12px rgba(202, 138, 4, 0.15);
        }
        .btn-solid:hover {
          background: linear-gradient(135deg, #FFF59D 0%, #FACC15 100%) !important;
          border-color: var(--yellow-dark) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(202, 138, 4, 0.3), 0 0 12px rgba(250, 204, 21, 0.15);
        }
      `}</style>
    </section>
  );
};

export default Projects;
