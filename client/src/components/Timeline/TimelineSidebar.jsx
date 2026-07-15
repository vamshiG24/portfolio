import { motion } from 'framer-motion';

const TimelineSidebar = ({ timelineData, activeYear, scrollToCard }) => {
  return (
    <div className="sticky-timeline-nav" style={{ width: '150px', flexShrink: 0 }}>
      <div 
        style={{ 
          position: 'sticky', 
          top: '150px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px',
          paddingLeft: '10px'
        }}
      >
        <span 
          style={{ 
            fontSize: '0.72rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.12em', 
            color: 'var(--text-muted)', 
            marginBottom: '10px',
            fontFamily: 'var(--font-sans)'
          }}
        >
          Journey Map
        </span>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
          {timelineData.map((item, index) => {
            const isActive = activeYear === index;
            return (
              <div
                key={index}
                onClick={() => scrollToCard(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '4px 0'
                }}
              >
                {/* Expanding Dot and Line */}
                <div style={{ position: 'relative', width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Background Track Dot */}
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(204, 0, 0, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  
                  {/* Active Glowing Expanding Dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarDot"
                      style={{
                        position: 'absolute',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: item.theme.color,
                        boxShadow: `0 0 12px ${item.theme.color}, 0 0 4px ${item.theme.color}`,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>

                {/* Year Label */}
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <motion.span
                    animate={{
                      scale: isActive ? 1.15 : 1.0,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: isActive ? 800 : 500,
                      x: isActive ? 4 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-display)',
                      display: 'block'
                    }}
                  >
                    {item.year}
                  </motion.span>

                  {/* Underline for active year */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarUnderline"
                      style={{
                        height: '2px',
                        backgroundColor: item.theme.color,
                        width: '100%',
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        boxShadow: `0 1px 4px ${item.theme.glow}`
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineSidebar;
