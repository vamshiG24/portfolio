import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

const logs = [
  {
    title: "BioSecure Access - Multimodal Biometric Integration",
    challenge: "Integrating voice (ECAPA-TDNN) and face (DeepFace) authentication in real-time was complex, especially handling audio from the browser and ensuring smooth verification.",
    solution: "Pre-processed browser WebM audio to 16kHz WAV for the model. Set up separate pipelines for voice and face recognition using Flask. Tested the integration to achieve a working real-time authentication prototype.",
    date: "Mar 2026"
  },
  {
    title: "Secure Digital Evidence Management - Cryptographic Hash Integrity",
    challenge: "Ensuring evidence files were tamper-proof using SHA-256 hashing while storing them securely in the cloud.",
    solution: "Implemented SHA-256 hashing for uploaded evidence files. Stored evidence files in Cloudinary and linked their hashes in MongoDB.",
    date: "Feb 2026"
  },
  {
    title: "EEG Seizure Detection - CNN Model Overfitting",
    challenge: "CNN model overfitted on training EEG data (high training accuracy but low validation accuracy), making it hard to generalize to new EEG patterns.",
    solution: "Added dropout layers and batch normalization to the CNN model. Used data augmentation to improve generalization. Monitored validation metrics to ensure the model learned meaningful patterns.",
    date: "Nov 2025"
  }
];

const LogCard = ({ log, index, isInView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="glass-card"
      style={{
        padding: '32px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)',
        background: 'var(--card-bg)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{log.title}</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--yellow-dark)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{log.date}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="log-card-content">
        {/* Challenge */}
        <div 
          className="log-card-challenge" 
          style={{ 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'flex-start', 
            background: 'rgba(220, 38, 38, 0.02)', 
            padding: '16px', 
            borderRadius: '10px', 
            border: '1px solid rgba(220, 38, 38, 0.08)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <AlertCircle size={18} style={{ color: '#DC2626', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#DC2626', marginBottom: '4px', fontWeight: 700 }}>Challenge</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{log.challenge}</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: 'rgba(234, 179, 8, 0.08)' }} />

        {/* Solution */}
        <div 
          className="log-card-solution" 
          style={{ 
            display: 'flex', 
            gap: '12px', 
            alignItems: 'flex-start', 
            background: 'rgba(202, 138, 4, 0.02)', 
            padding: '16px', 
            borderRadius: '10px', 
            border: '1px solid rgba(202, 138, 4, 0.08)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <CheckCircle size={18} style={{ color: 'var(--yellow-dark)', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--yellow-dark)', marginBottom: '4px', fontWeight: 700 }}>Solution</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{log.solution}</p>
          </div>
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
        padding: '100px 24px',
        background: 'var(--bg-primary)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}
          >
            Build <span style={{ color: 'var(--yellow-dark)' }}>Logs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}
          >
            A technical diary of challenges faced and architectural decisions made
          </motion.p>
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {logs.map((log, index) => (
            <LogCard key={index} log={log} index={index} isInView={isInView} />
          ))}
        </div>
      </div>

      <style>{`
        .glass-card:hover .log-card-challenge {
          background: rgba(220, 38, 38, 0.04) !important;
          border-color: rgba(220, 38, 38, 0.15) !important;
          transform: scale(1.005) translateY(-1px);
        }
        .glass-card:hover .log-card-solution {
          background: rgba(202, 138, 4, 0.05) !important;
          border-color: rgba(202, 138, 4, 0.15) !important;
          transform: scale(1.005) translateY(-1px);
        }
      `}</style>
    </section>
  );
};

export default BuildLogs;
