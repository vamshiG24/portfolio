import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertCircle, Sparkles } from 'lucide-react';

const logs = [
  {
    title: "BioSecure Access - Multimodal Biometric Integration",
    challenge: "Integrating voice (ECAPA-TDNN) and face (DeepFace) authentication in real-time was complex, especially handling audio from the browser and ensuring smooth verification.",
    solution: "Pre-processed browser WebM audio to 16kHz WAV for the model. Set up separate pipelines for voice and face recognition using Flask. Tested the integration to achieve a working real-time authentication prototype.",
    date: "Mar 2026",
    category: "AI & MULTIMODAL VERIFICATION"
  },
  {
    title: "Secure Digital Evidence Management - Cryptographic Hash Integrity",
    challenge: "Ensuring evidence files were tamper-proof using SHA-256 hashing while storing them securely in the cloud.",
    solution: "Implemented SHA-256 hashing for uploaded evidence files. Stored evidence files in Cloudinary and linked their hashes in MongoDB.",
    date: "Feb 2026",
    category: "SECURITY & IMMUTABLE LEDGERS"
  },
  {
    title: "EEG Seizure Detection - CNN Model Overfitting",
    challenge: "CNN model overfitted on training EEG data (high training accuracy but low validation accuracy), making it hard to generalize to new EEG patterns.",
    solution: "Added dropout layers and batch normalization to the CNN model. Used data augmentation to improve generalization. Monitored validation metrics to ensure the model learned meaningful patterns.",
    date: "Nov 2025",
    category: "DEEP LEARNING MODEL OPTIMIZATION"
  }
];

const LogCard = ({ log, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-120px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 15, delay: index * 0.1 }}
      className="glass-card log-normal-card"
      style={{
        borderRadius: '24px',
        border: '1px solid rgba(234, 179, 8, 0.14)',
        background: 'rgba(255, 255, 255, 0.75)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '28px',
        overflow: 'hidden',
        transition: 'border-color 0.4s ease, background-color 0.4s ease, box-shadow 0.4s ease',
        padding: '32px'
      }}
      whileHover={{ translateY: -4 }}
    >
      {/* Header Area */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '24px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{
            fontSize: '0.72rem',
            color: 'var(--yellow-dark)',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.12em',
          }}>
            {log.category}
          </span>
          <h3 style={{
            fontSize: '1.28rem',
            fontWeight: 800,
            margin: 0,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.01em',
            lineHeight: 1.35
          }}>
            {log.title}
          </h3>
        </div>

        <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          flexShrink: 0
        }}>
          {log.date}
        </span>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.15) 15%, rgba(234, 179, 8, 0.15) 85%, transparent)',
        marginBottom: '24px'
      }} />

      {/* Grid Content */}
      <div 
        className="log-grid-content"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* Challenge Column */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.02)',
          borderLeft: '4px solid #EF4444',
          padding: '24px',
          borderRadius: '16px',
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          border: '1px solid rgba(239, 68, 68, 0.06)',
          borderLeftWidth: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'all 0.3s ease',
        }} className="challenge-col-hover">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} style={{ color: '#EF4444' }} />
            <h4 style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#EF4444',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)'
            }}>
              Technical Challenge
            </h4>
          </div>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.94rem',
            lineHeight: '1.6',
            margin: 0
          }}>
            {log.challenge}
          </p>
        </div>

        {/* Solution Column */}
        <div style={{
          background: 'rgba(202, 138, 4, 0.02)',
          borderLeft: '4px solid var(--yellow-dark)',
          padding: '24px',
          borderRadius: '16px',
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          border: '1px solid rgba(202, 138, 4, 0.06)',
          borderLeftWidth: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'all 0.3s ease',
        }} className="solution-col-hover">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} style={{ color: 'var(--yellow-dark)' }} />
            <h4 style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--yellow-dark)',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)'
            }}>
              Engineering Solution
            </h4>
          </div>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.94rem',
            lineHeight: '1.6',
            margin: 0
          }}>
            {log.solution}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const BuildLogs = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="buildlogs"
      ref={sectionRef}
      style={{
        width: '100%',
        padding: '120px 24px',
        background: 'var(--bg-primary)',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', maxWidth: '950px', margin: '0 auto' }}>
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
            TECHNICAL ARCHITECTURE
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ 
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', 
              marginBottom: '16px', 
              color: 'var(--text-primary)', 
              fontWeight: 800, 
              fontFamily: 'var(--font-display)', 
              letterSpacing: '-0.02em' 
            }}
          >
            Build <span style={{ color: 'var(--yellow-dark)' }}>Logs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ 
              color: 'var(--text-muted)', 
              fontSize: '1.05rem', 
              maxWidth: '600px', 
              margin: '0 auto', 
              lineHeight: 1.6 
            }}
          >
            A technical breakdown of engineering obstacles solved and core model architectures deployed.
          </motion.p>
        </div>

        {/* Normal List */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {logs.map((log, index) => (
            <LogCard 
              key={index} 
              log={log} 
              index={index} 
            />
          ))}
        </div>
      </div>

      <style>{`
        .challenge-col-hover:hover {
          background: rgba(239, 68, 68, 0.04) !important;
          border-color: rgba(239, 68, 68, 0.15) !important;
          transform: translateY(-2px);
        }
        .solution-col-hover:hover {
          background: rgba(202, 138, 4, 0.05) !important;
          border-color: rgba(202, 138, 4, 0.15) !important;
          transform: translateY(-2px);
        }
        .log-normal-card:hover {
          border-color: rgba(234, 179, 8, 0.35) !important;
          box-shadow: 0 20px 40px -10px rgba(202, 138, 4, 0.12), 0 0 25px rgba(250, 204, 21, 0.05) !important;
        }
        @media (max-width: 768px) {
          .log-grid-content {
            grid-template-columns: 1fr !important;
            padding: 0 !important;
            gap: 20px !important;
          }
          .log-normal-card {
            padding: 24px !important;
            border-radius: 18px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default BuildLogs;
