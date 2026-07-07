import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

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

const Projects = () => {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(1);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = ["All", "AI/ML", "MERN Stack"];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  // Reset index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredProjects.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredProjects.length, activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    setTilt({ x: 0, y: 0 });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredProjects.length);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseMove = (e, isActive) => {
    if (!isActive) return;
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 6; // max 6 degrees tilt
    const rotateY = (x / (box.width / 2)) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isMobile = windowWidth < 768;
  const cardWidth = isMobile ? '90%' : '750px';
  // Shift value based on screen size
  const xShift = isMobile ? windowWidth * 0.52 : 320;

  const getDiff = (idx) => {
    const len = filteredProjects.length;
    if (len <= 1) return 0;
    
    let diff = idx - activeIndex;
    
    if (len >= 3) {
      if (diff < -1) diff += len;
      if (diff > 1) diff -= len;
    }
    
    return diff;
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        width: '100%',
        padding: '120px 24px',
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden',
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
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '16px', color: 'var(--text-primary)', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            Featured <span style={{ color: 'var(--yellow-dark)' }}>Projects</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            A curated selection of my research, Deep Learning implementations, and Full-Stack MERN applications.
          </p>
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

        {/* 3D Carousel Stage */}
        <div style={{
          position: 'relative',
          height: isMobile ? '500px' : '410px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          marginBottom: '20px',
        }} className="carousel-3d-wrapper">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              const diff = getDiff(idx);
              const isActive = diff === 0;

              return (
                <motion.div
                  key={project.title}
                  style={{
                    position: 'absolute',
                    width: cardWidth,
                    maxWidth: '96vw',
                    borderRadius: '24px',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(250, 204, 21, 0.45)' : 'rgba(234, 179, 8, 0.14)',
                    background: isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.75)',
                    boxShadow: isActive 
                      ? '0 25px 50px -12px rgba(202, 138, 4, 0.25), 0 0 30px rgba(250, 204, 21, 0.08)' 
                      : '0 8px 20px -6px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    overflow: 'hidden',
                    cursor: isActive ? 'default' : 'pointer',
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{
                    x: diff === 0 ? 0 : diff === 1 ? xShift : diff === -1 ? -xShift : diff > 0 ? xShift * 1.5 : -xShift * 1.5,
                    scale: diff === 0 ? 1 : isMobile ? 0.78 : 0.85,
                    rotateY: diff === 0 ? tilt.y : diff === 1 ? (isMobile ? -12 : -22) : (isMobile ? 12 : 22),
                    rotateX: diff === 0 ? tilt.x : 0,
                    zIndex: diff === 0 ? 10 : 5,
                    opacity: diff === 0 ? 1 : isMobile ? 0.25 : 0.5,
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: 30 }}
                  transition={{
                    type: 'spring',
                    stiffness: isActive ? 400 : 260,
                    damping: isActive ? 30 : 24,
                  }}
                  onMouseMove={(e) => handleMouseMove(e, isActive)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => !isActive && setActiveIndex(idx)}
                  className={`project-carousel-card ${isActive ? 'active' : ''}`}
                >
                  {/* Left Side: Image */}
                  <div style={{
                    width: isMobile ? '100%' : '42%',
                    height: isMobile ? '180px' : '380px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'var(--bg-tertiary)',
                  }} className="card-image-section">
                    {/* Category Tag Overlay */}
                    <span style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: 'rgba(28, 25, 22, 0.75)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(250, 204, 21, 0.3)',
                      color: '#FACC15',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 12px',
                      borderRadius: '99px',
                      zIndex: 5,
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}>
                      {project.category}
                    </span>

                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      className="project-carousel-img"
                    />

                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, transparent, rgba(133, 77, 14, 0.15))',
                      pointerEvents: 'none'
                    }} />
                  </div>

                  {/* Right Side: Text details */}
                  <div style={{
                    width: isMobile ? '100%' : '58%',
                    padding: isMobile ? '20px 24px' : '28px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '16px',
                    zIndex: 1,
                  }} className="card-info-section">
                    <div>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--yellow-dark)',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4px'
                      }}>
                        {project.subtitle}
                      </span>
                      <h3 style={{
                        fontSize: isMobile ? '1.35rem' : '1.7rem',
                        fontWeight: 800,
                        margin: 0,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.25
                      }}>
                        {project.title}
                      </h3>
                    </div>

                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: isMobile ? '0.85rem' : '0.94rem',
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      {project.description}
                    </p>

                    {/* Tech badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {project.tech.map((tag, idx) => (
                        <span
                          key={idx}
                          className="tech-tag"
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid rgba(202, 138, 4, 0.12)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-row-btn btn-outline"
                        style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                      >
                        <Github size={14} /> Source
                      </a>
                      {project.demo !== '#' && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="proj-row-btn btn-solid"
                          style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                        >
                          <ExternalLink size={14} /> Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        {filteredProjects.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px',
            alignItems: 'center'
          }}>
            <button
              onClick={handlePrev}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              className="carousel-nav-btn"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Bullet Dot Indicators */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {filteredProjects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    width: activeIndex === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '99px',
                    background: activeIndex === idx ? 'var(--yellow-dark)' : 'rgba(234, 179, 8, 0.24)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    outline: 'none',
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
                outline: 'none',
              }}
              className="carousel-nav-btn"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .filter-tab-btn:hover {
          transform: translateY(-2px);
          opacity: 1;
          border-color: var(--yellow-dark);
          box-shadow: 0 6px 14px -4px rgba(202, 138, 4, 0.25);
        }
        .carousel-nav-btn:hover {
          border-color: var(--yellow-dark) !important;
          color: var(--yellow-deep) !important;
          background: var(--yellow-light) !important;
          transform: scale(1.05);
          box-shadow: 0 6px 14px -4px rgba(202, 138, 4, 0.25);
        }
        .proj-row-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 30px;
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
          box-shadow: 0 8px 20px -4px rgba(202, 138, 4, 0.3), 0 0 12px rgba(250, 202, 21, 0.15);
        }
      `}</style>
    </section>
  );
};

export default Projects;
