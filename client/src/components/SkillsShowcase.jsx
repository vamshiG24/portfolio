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

const SkillsShowcase = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState('All');

  const filteredSkills = activeTab === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeTab);

  return (
    <section
      id="skills"
      ref={containerRef}
      style={{
        width: '100%',
        padding: '100px 24px',
        background: 'transparent',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
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
            marginBottom: '40px' 
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
                  border: isActive ? '1px solid var(--yellow-dark)' : '1px solid rgba(234, 179, 8, 0.15)',
                  background: isActive ? 'var(--yellow)' : 'var(--card-bg)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 4px 10px rgba(234, 179, 8, 0.1)' : 'var(--shadow-sm)',
                }}
                className="category-tab-btn"
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px',
            minHeight: '200px'
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} isInView={isInView} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        .skill-card-wrapper {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .skill-card-wrapper:hover {
          transform: translateY(-5px) scale(1.02) !important;
          border-color: var(--yellow-dark) !important;
          box-shadow: 0 12px 30px -5px rgba(202, 138, 4, 0.15), 0 0 20px rgba(250, 204, 21, 0.08) !important;
        }
        .skill-card-wrapper:hover .skill-icon {
          color: var(--yellow-dark) !important;
          transform: scale(1.15) rotate(5deg);
        }
        .skill-card-wrapper:hover .skill-corner-accent {
          opacity: 1 !important;
        }
        .category-tab-btn:hover {
          border-color: var(--yellow-dark) !important;
          color: var(--yellow-deep) !important;
          background: var(--bg-secondary);
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
};

export default SkillsShowcase;
