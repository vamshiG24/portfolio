import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        onDone();
      }, 400); // short delay to show 100% progress before transition
      return () => clearTimeout(timer);
    }
  }, [isReady, onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="loading-screen"
    >
      <div className="loading-content">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="loading-logo"
        >
          <div className="loading-orb" />
          <h1 style={{ color: 'var(--text-primary)', background: 'none', WebkitTextFillColor: 'unset', fontWeight: 800 }}>
            Vamshi<span style={{ color: 'var(--yellow-dark)' }}>.dev</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Activating AI Assistant & Systems...</p>
        </motion.div>
 
        {/* Progress bar */}
        <div className="loading-bar-bg">
          <motion.div
            className="loading-bar-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
 
        {/* Status */}
        <p className="loading-status">
          {progress < 30 ? 'Loading Core Systems...' :
           progress < 60 ? 'Preparing Sections...' :
           progress < 99 ? 'Powering ARIA Assistant...' :
           'Systems Activated!'}
        </p>

        {/* Grid decoration */}
        <div className="loading-grid" />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
