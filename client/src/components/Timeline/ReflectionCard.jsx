import { useState, useEffect, useRef } from 'react';
import { motion, useInView, steps } from 'framer-motion';

const ReflectionCard = ({ text, theme }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-60px" });
  const [showCaret, setShowCaret] = useState(true);

  // Split text into characters
  const characters = Array.from(text);

  // Tab configurations based on year themes
  let tabName = "takeaway.txt";
  let promptText = "guest@vamshi:~$ ";
  
  if (theme.type === "learning") {
    tabName = "complexity.cpp";
    promptText = "student@dsa:~$ ";
  } else if (theme.type === "building") {
    tabName = "app.js";
    promptText = "developer@mern:~$ ";
  } else if (theme.type === "research") {
    tabName = "train.py";
    promptText = "researcher@ai:~$ ";
  } else if (theme.type === "vision") {
    tabName = "roadmap.sh";
    promptText = "architect@future:~$ ";
  }

  // Hide caret after typing duration + blink period
  useEffect(() => {
    if (!isInView) return;
    
    const charDelay = 0.015; // 15ms stagger per character
    const typingDuration = characters.length * charDelay * 1000;
    const blinkDuration = 3000; // 3 seconds of blinking at the end
    
    const timer = setTimeout(() => {
      setShowCaret(false);
    }, typingDuration + blinkDuration);

    return () => clearTimeout(timer);
  }, [isInView, characters.length]);

  // Framer Motion Stagger Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.015, // 15ms stagger between characters
      }
    }
  };

  const charVariants = {
    hidden: { 
      opacity: 0, 
      display: 'none' 
    },
    visible: { 
      opacity: 1, 
      display: 'inline',
      transition: { 
        duration: 0.01 // instant appearance once triggered
      } 
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        marginTop: '24px', 
        paddingTop: '20px', 
        borderTop: `1px solid rgba(204, 0, 0, 0.08)`
      }}
    >
      {/* Terminal Console Window */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid rgba(28, 25, 23, 0.12)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          background: 'rgba(28, 25, 23, 0.94)' // Dark IDE background
        }}
      >
        {/* Terminal Header Bar */}
        <div 
          style={{
            background: 'rgba(28, 25, 23, 0.98)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '32px',
            userSelect: 'none'
          }}
        >
          {/* OS Windows Dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff0000', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
          </div>

          {/* Active File Tab */}
          <div 
            style={{
              fontSize: '0.72rem',
              color: 'rgba(255, 255, 255, 0.55)',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 500
            }}
          >
            {tabName}
          </div>

          <div style={{ width: '42px' }} />
        </div>

        {/* Terminal Workspace Area */}
        <div 
          style={{
            padding: '16px 20px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.8rem',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.85)',
            textAlign: 'left',
            minHeight: '80px'
          }}
        >
          {/* CLI Terminal Prompt */}
          <span style={{ color: theme.color, fontWeight: 700, marginRight: '8px' }}>
            {promptText}
          </span>

          {/* Typed characters block */}
          <motion.span 
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ color: '#ffffff', letterSpacing: '0.01em' }}
          >
            {characters.map((char, idx) => (
              <motion.span 
                key={idx} 
                variants={charVariants}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>

          {/* Glowing Caret Blinker */}
          {showCaret && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: steps(2) }}
              style={{
                display: 'inline-block',
                width: '7px',
                height: '13px',
                backgroundColor: theme.color,
                marginLeft: '3px',
                verticalAlign: 'middle',
                boxShadow: `0 0 6px ${theme.color}`
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReflectionCard;
