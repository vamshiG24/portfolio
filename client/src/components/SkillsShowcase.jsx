import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { FaReact, FaNode, FaPython, FaDatabase } from 'react-icons/fa';
import { SiMongodb, SiTailwindcss, SiExpress, SiTensorflow, SiJavascript, SiGit, SiPandas, SiNumpy } from 'react-icons/si';

const skills = [
  { name: 'React', level: '90%', category: 'Frontend', icon: <FaReact /> },
  { name: 'Node.js', level: '85%', category: 'Backend', icon: <FaNode /> },
  { name: 'MongoDB', level: '80%', category: 'Database', icon: <SiMongodb /> },
  { name: 'Express.js', level: '85%', category: 'Backend', icon: <SiExpress /> },
  { name: 'Python', level: '75%', category: 'AI/ML', icon: <FaPython /> },
  { name: 'TensorFlow', level: '70%', category: 'AI/ML', icon: <SiTensorflow /> },
  { name: 'Tailwind CSS', level: '90%', category: 'Frontend', icon: <SiTailwindcss /> },
  { name: 'NumPy', level: '75%', category: 'AI/ML', icon: <SiNumpy /> },
  { name: 'JavaScript', level: '90%', category: 'Languages', icon: <SiJavascript /> },
  { name: 'Git', level: '80%', category: 'Tools', icon: <SiGit /> },
  { name: 'Pandas', level: '75%', category: 'AI/ML', icon: <SiPandas /> },
  { name: 'SQL', level: '70%', category: 'Database', icon: <FaDatabase /> },
];

const categories = ['All', 'Frontend', 'Backend', 'AI/ML', 'Database', 'Languages', 'Tools'];

const SkillCard = ({ skill, index, isInView }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="glass-card skill-card-wrapper"
      style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'relative',
        background: 'var(--card-bg)',
        overflow: 'hidden',
      }}
    >
      <div className="skill-icon" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {skill.icon}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', transition: 'color 0.3s ease' }}>{skill.name}</h3>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>{skill.category}</span>
      </div>
      
      {/* Decorative accent element in the corner */}
      <div className="skill-corner-accent" style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '4px',
        height: '100%',
        background: 'linear-gradient(to bottom, var(--yellow), var(--yellow-dark))',
        opacity: 0,
        transition: 'opacity 0.3s ease'
      }} />
    </motion.div>
  );
};
const getSkillGlowColor = (name) => {
  const brandColors = {
    'React': '#61dafb',
    'Node.js': '#22c55e',
    'MongoDB': '#10b981',
    'Express.js': '#a8a8a8',
    'Python': '#3b82f6',
    'TensorFlow': '#f97316',
    'Tailwind CSS': '#06b6d4',
    'NumPy': '#4d77cf',
    'JavaScript': '#eab308',
    'Git': '#ef4444',
    'Pandas': '#130654',
    'SQL': '#00bcd4',
  };
  return brandColors[name] || '#eab308';
};

const SkillsMarqueeRow = ({ data, reverse = false, speed = 20 }) => {
  if (data.length === 0) return null;
  const items = data.length < 8 ? [...data, ...data, ...data, ...data] : [...data, ...data];
  const [hoveredIdx, setHoveredIdx] = useState(null);
  
  return (
    <div className="relative w-full overflow-hidden py-2" style={{ display: 'flex' }}>
      <div
        className="flex transform-gpu"
        style={{
          display: 'flex',
          gap: '20px',
          animation: `marqueeScroll ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          width: 'max-content',
        }}
      >
        {items.map((skill, idx) => {
          const isHovered = hoveredIdx === idx;
          const brandColor = getSkillGlowColor(skill.name);
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="skill-marquee-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 32px',
                background: 'var(--card-bg)',
                border: isHovered ? `1px solid ${brandColor}` : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                boxShadow: isHovered 
                  ? `0 12px 30px -5px ${brandColor}30, 0 0 20px ${brandColor}15`
                  : '0 6px 24px rgba(0,0,0,0.18)',
                transform: isHovered ? 'translateY(-6px) scale(1.04)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
              }}
            >
              <div 
                className="skill-marquee-icon" 
                style={{ 
                  fontSize: '2.2rem', 
                  color: isHovered ? brandColor : 'var(--text-muted)', 
                  transition: 'all 0.3s', 
                  display: 'flex', 
                  alignItems: 'center',
                  transform: isHovered ? 'scale(1.1) rotate(6deg)' : 'none'
                }}
              >
                {skill.icon}
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillsShowcase = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState('All');

  const filteredSkills = activeTab === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeTab);

  // Split filtered skills into two rows
  const half = Math.ceil(filteredSkills.length / 2);
  const row1 = filteredSkills.slice(0, half);
  const row2 = filteredSkills.slice(half);

  return (
    <section
      id="skills"
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px 24px',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Intense Ambient Glow Blobs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '5%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,68,68,0.04) 0%, transparent 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}
          >
            Skills & <span style={{ color: 'var(--yellow-dark)' }}>Technologies</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}
          >
            My current tech stack and development tools
          </motion.p>
        </div>

        {/* Categories Tab Swapper */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px', 
            flexWrap: 'wrap', 
            marginBottom: '48px' 
          }}
        >
          {categories.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '99px',
                  border: isActive ? '1px solid var(--yellow-dark)' : '1px solid rgba(204, 0, 0, 0.15)',
                  background: isActive ? 'var(--yellow)' : 'var(--card-bg)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 4px 10px rgba(204, 0, 0, 0.1)' : 'var(--shadow-sm)',
                }}
                className="category-tab-btn"
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Sliding Skills Marquee Container */}
        <div className="relative w-full flex flex-col gap-7 overflow-hidden py-4" style={{
          maskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
        }}>
          <SkillsMarqueeRow data={row1} reverse={false} speed={25} />
          {row2.length > 0 && <SkillsMarqueeRow data={row2} reverse={true} speed={25} />}
        </div>

      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .skill-marquee-card:hover {
          transform: translateY(-4px) scale(1.03) !important;
          border-color: var(--yellow-dark) !important;
          box-shadow: 0 10px 25px -5px rgba(202, 138, 4, 0.18) !important;
        }
        .skill-marquee-card:hover .skill-marquee-icon {
          color: var(--yellow-dark) !important;
          transform: scale(1.15) rotate(5deg);
        }
        .category-tab-btn:hover {
          border-color: #ff0000 !important;
          color: #ffffff !important;
          background: rgba(255, 0, 0, 0.12) !important;
          box-shadow: 0 4px 12px rgba(255, 0, 0, 0.25) !important;
          transform: translateY(-2px) !important;
        }
      `}</style>
    </section>
  );
};

export default SkillsShowcase;
