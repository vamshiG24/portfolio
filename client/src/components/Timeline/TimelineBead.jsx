import { motion, useSpring, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const TimelineBead = ({ scrollYProgress, activeYear, timelineData }) => {
  // Smooth scroll tracking using useSpring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 18,
    mass: 0.2
  });

  // Transform progress [0.1, 0.9] to offset path percentage [0%, 100%]
  const beadY = useTransform(smoothProgress, [0.1, 0.9], ["0%", "100%"]);

  // Dynamically resolve bead theme color based on active section
  const currentTheme = timelineData[activeYear]?.theme || { color: '#FACC15', glow: 'rgba(255, 0, 0, 0.25)' };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: beadY,
        x: '-50%',
        y: '-50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none'
      }}
    >
      {/* 1. Pulse Animation Ring (Infinite breathing wave) */}
      <motion.div
        animate={{
          scale: [0.8, 1.8, 0.8],
          opacity: [0.3, 0.8, 0.3],
          boxShadow: [
            `0 0 12px ${currentTheme.glow}`,
            `0 0 24px ${currentTheme.glow}`,
            `0 0 12px ${currentTheme.glow}`
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: `2px solid ${currentTheme.color}`,
          pointerEvents: 'none'
        }}
      />

      {/* 2. Outer Glowing Ring */}
      <div
        style={{
          position: 'absolute',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          border: `3px solid ${currentTheme.color}`,
          boxShadow: `0 0 14px ${currentTheme.color}, 0 4px 8px rgba(0,0,0,0.12)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2
        }}
      >
        {/* 3. Rotating Star (Inner Compass/Sparkle) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear"
          }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Sparkles size={11} style={{ color: currentTheme.color }} />
        </motion.div>
      </div>

      {/* 4. Tiny orbiting electron-like nodes */}
      {[0, 120, 240].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        const xOffset = Math.cos(rad) * 16;
        const yOffset = Math.sin(rad) * 16;

        return (
          <motion.div
            key={idx}
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: currentTheme.color,
              x: xOffset,
              y: yOffset,
              boxShadow: `0 0 6px ${currentTheme.color}`,
              zIndex: 3
            }}
          />
        );
      })}
    </motion.div>
  );
};

export default TimelineBead;
