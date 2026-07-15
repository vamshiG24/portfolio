import { motion } from 'framer-motion';

const TimelinePath = ({ scrollYProgress }) => {
  // Transform scroll progress for drawing the path
  const pathLength = scrollYProgress;

  return (
    <div 
      className="timeline-center-line"
      style={{
        position: 'absolute',
        top: '40px',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '20px', // slightly wider container for glow layers
        height: 'calc(100% - 80px)',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 20 100" 
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Main Shifting Gradient Path */}
          <linearGradient id="timeline-gradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#f97316" />   {/* 2023: Coral Orange */}
            <stop offset="33%" stopColor="#0ea5e9" />  {/* 2024: Sky Blue */}
            <stop offset="66%" stopColor="#10b981" />  {/* 2025: Emerald Green */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* Future: Violet Purple */}
          </linearGradient>

          {/* Glow Gradient */}
          <linearGradient id="timeline-glow-grad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(249, 115, 22, 0.4)" />
            <stop offset="33%" stopColor="rgba(14, 165, 233, 0.4)" />
            <stop offset="66%" stopColor="rgba(16, 185, 129, 0.4)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.4)" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Glow Layer (Underneath base) */}
        <path
          d="M 10 0 L 10 100"
          stroke="url(#timeline-glow-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.25"
          filter="url(#glow-filter)"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />

        {/* 2. Gradient Base Track (Passive) */}
        <path
          d="M 10 0 L 10 100"
          stroke="url(#timeline-glow-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.12"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />

        {/* 3. Progress Layer (Active Scroll-Linked drawing) */}
        <motion.path
          d="M 10 0 L 10 100"
          stroke="url(#timeline-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ 
            pathLength: pathLength,
            vectorEffect: 'non-scaling-stroke',
            filter: 'drop-shadow(0px 0px 4px rgba(255, 0, 0, 0.4))'
          }}
        />

        {/* 4. Moving Particles Layer (Ascending Dashes) */}
        <motion.path
          d="M 10 100 L 10 0" // Drawn bottom-to-top so dashoffset shifts energy upwards
          stroke="url(#timeline-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="6, 15"
          animate={{ strokeDashoffset: [0, 42] }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "linear"
          }}
          style={{ 
            pathLength: pathLength,
            vectorEffect: 'non-scaling-stroke',
            mixBlendMode: 'screen',
            opacity: 0.85
          }}
        />
      </svg>
    </div>
  );
};

export default TimelinePath;
