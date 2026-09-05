import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaReact, FaNode, FaPython, FaBrain, FaShieldAlt } from 'react-icons/fa';
import {
  SiMongodb, SiTailwindcss, SiExpress, SiTensorflow, SiJavascript, SiGit,
  SiCplusplus, SiDocker, SiRedis, SiNginx, SiKeras, SiOpenai, SiAnthropic
} from 'react-icons/si';
import { Sparkles, Terminal, Network, KeyRound, Cpu, ShieldCheck } from 'lucide-react';

const skills = [
  // Programming Languages
  { name: 'Python', category: 'Languages', icon: <FaPython /> },
  { name: 'C++', category: 'Languages', icon: <SiCplusplus /> },
  { name: 'JavaScript', category: 'Languages', icon: <SiJavascript /> },

  // Web Technologies
  { name: 'React.js', category: 'Web & Backend', icon: <FaReact /> },
  { name: 'Node.js', category: 'Web & Backend', icon: <FaNode /> },
  { name: 'Express.js', category: 'Web & Backend', icon: <SiExpress /> },
  { name: 'MongoDB', category: 'Web & Backend', icon: <SiMongodb /> },
  { name: 'Tailwind CSS', category: 'Web & Backend', icon: <SiTailwindcss /> },

  // Backend & Architecture
  { name: 'Microservices', category: 'Web & Backend', icon: <Network size={28} /> },
  { name: 'REST APIs', category: 'Web & Backend', icon: <Terminal size={28} /> },
  { name: 'Authentication', category: 'Web & Backend', icon: <KeyRound size={28} /> },
  { name: 'RBAC & ABAC', category: 'Web & Backend', icon: <ShieldCheck size={28} /> },

  // DevOps & Infrastructure
  { name: 'Docker', category: 'DevOps & Infra', icon: <SiDocker /> },
  { name: 'Redis', category: 'DevOps & Infra', icon: <SiRedis /> },
  { name: 'Nginx', category: 'DevOps & Infra', icon: <SiNginx /> },
  { name: 'Git', category: 'DevOps & Infra', icon: <SiGit /> },

  // AI/ML
  { name: 'Machine Learning', category: 'AI & Machine Learning', icon: <FaBrain /> },
  { name: 'Deep Learning', category: 'AI & Machine Learning', icon: <Cpu size={28} /> },
  { name: 'TensorFlow', category: 'AI & Machine Learning', icon: <SiTensorflow /> },
  { name: 'Keras', category: 'AI & Machine Learning', icon: <SiKeras /> },
  { name: 'Generative AI', category: 'AI & Machine Learning', icon: <Sparkles size={28} /> },

  // AI Tools
  { name: 'ChatGPT', category: 'AI Tools', icon: <SiOpenai /> },
  { name: 'Claude', category: 'AI Tools', icon: <SiAnthropic /> },
  { name: 'AntiGravity', category: 'AI Tools', icon: <Sparkles size={28} /> },
  { name: 'Prompt Engineering', category: 'AI Tools', icon: <Terminal size={28} /> },
];

const categories = ['All', 'Languages', 'Web & Backend', 'DevOps & Infra', 'AI & Machine Learning', 'AI Tools'];

const getSkillGlowColor = (name) => {
  const brandColors = {
    'Python': '#3b82f6',
    'C++': '#00599c',
    'JavaScript': '#f7df1e',
    'React.js': '#61dafb',
    'Node.js': '#22c55e',
    'MongoDB': '#10b981',
    'Express.js': '#a8a8a8',
    'Tailwind CSS': '#06b6d4',
    'Microservices': '#6366f1',
    'REST APIs': '#14b8a6',
    'Authentication': '#f59e0b',
    'RBAC & ABAC': '#ef4444',
    'Docker': '#2496ed',
    'Redis': '#dc382d',
    'Nginx': '#009639',
    'Git': '#f05032',
    'Machine Learning': '#38bdf8',
    'Deep Learning': '#a855f7',
    'TensorFlow': '#ff6f00',
    'Keras': '#d00000',
    'Generative AI': '#ec4899',
    'ChatGPT': '#10a37f',
    'Claude': '#d97706',
    'AntiGravity': '#ff4444',
    'Prompt Engineering': '#8b5cf6',
  };
  return brandColors[name] || '#ff4444';
};

const SkillsMarqueeRow = ({ data, reverse = false, speed = 20 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  if (data.length === 0) return null;
  const items = data.length < 8 ? [...data, ...data, ...data, ...data] : [...data, ...data];

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
        {/* Header with 3D Holographic Perspective Flip Scroll Animation */}
        <div style={{ textAlign: 'center', marginBottom: '48px', perspective: '1000px' }}>
          <motion.span
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: '#ff4444',
              background: 'rgba(255, 68, 68, 0.08)',
              border: '1px solid rgba(255, 68, 68, 0.22)',
              padding: '6px 16px',
              borderRadius: '99px',
              fontFamily: 'var(--font-mono)',
              display: 'inline-block',
              marginBottom: '16px',
              transformOrigin: 'center',
            }}
          >
            TECHNICAL CAPABILITIES & TOOLING
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, rotateX: -75, y: -35 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              marginBottom: '16px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
            }}
          >
            Skills & <span style={{ color: '#ff4444' }}>Technologies</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}
          >
            My current tech stack, frameworks, and engineering tools
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
        <div className="relative w-full flex flex-col gap-7 overflow-hidden py-4">
          {/* Left fading edge overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: '15%',
            background: 'linear-gradient(to right, #0c0c0c, transparent)',
            zIndex: 2, pointerEvents: 'none'
          }} />
          {/* Right fading edge overlay */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '15%',
            background: 'linear-gradient(to left, #0c0c0c, transparent)',
            zIndex: 2, pointerEvents: 'none'
          }} />

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
