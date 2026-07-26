import React from 'react';
import FullScreenScrollFX from './FullScreenScrollFX';
import { AlertCircle, Sparkles, Terminal, ShieldCheck, Cpu, ArrowDown } from 'lucide-react';

const logsData = [
  {
    id: "log-intro",
    isIntro: true,
    leftLabelText: "00 INTRO",
    rightLabelText: "ARCHITECTURE",
    bgImage: "/images/buildlog_bg_intro.png",
    color: "#ff4444",
  },
  {
    id: "log-1",
    indexStr: "LOG::01",
    leftLabelText: "01 BIOSECURE AI",
    rightLabelText: "BIOMETRICS 2026",
    title: "BioSecure Access - Multimodal Biometric Integration",
    category: "AI & MULTIMODAL VERIFICATION",
    date: "Mar 2026",
    bgImage: "/images/buildlog_bg_biosecure.png",
    color: "#a855f7",
    icon: <Cpu size={16} />,
    challenge: "Integrating real-time ECAPA-TDNN voice & DeepFace neural embeddings without audio latency or web buffer stalls.",
    solution: "Pre-processed browser WebM audio to 16kHz WAV. Configured Flask parallel pipeline processing with async queues.",
    tech: ["Flask", "React", "Python", "Deep Learning", "PyTorch"],
  },
  {
    id: "log-2",
    indexStr: "LOG::02",
    leftLabelText: "02 HASH LEDGER",
    rightLabelText: "SECURITY 2026",
    title: "Secure Digital Evidence Management - Hash Ledger",
    category: "SECURITY & IMMUTABLE LEDGERS",
    date: "Feb 2026",
    bgImage: "/images/buildlog_bg_ledger.png",
    color: "#06b6d4",
    icon: <ShieldCheck size={16} />,
    challenge: "Ensuring evidence files are completely tamper-proof while executing instant SHA-256 cloud validations.",
    solution: "Computed SHA-256 cryptographic hashes on upload stream and linked immutable records in MongoDB.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "SHA-256"],
  },
  {
    id: "log-3",
    indexStr: "LOG::03",
    leftLabelText: "03 SEIZURE AI",
    rightLabelText: "NEURAL NET 2025",
    title: "EEG Seizure Detector - CNN Model Optimization",
    category: "DEEP LEARNING MODEL OPTIMIZATION",
    date: "Nov 2025",
    bgImage: "/images/buildlog_bg_eeg.png",
    color: "#22c55e",
    icon: <Terminal size={16} />,
    challenge: "CNN overfitted on training EEG signal data, yielding high train accuracy but failing on test frequencies.",
    solution: "Applied batch normalization, dropout layers, and fast Fourier transform signal matrices to boost generalization.",
    tech: ["Flask", "TensorFlow", "Keras", "SciPy", "NumPy"],
  }
];

const Buildlogs = ({ lowSpecMode }) => {
  const sections = logsData.map((log) => ({
    id: log.id,
    background: "",
    renderBackground: () => (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#0c0c0c" }}>
        <img
          src={log.bgImage}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.22) contrast(1.15)",
            opacity: 0.75,
            transition: "transform 10s ease, opacity 0.8s ease",
          }}
        />
        {/* Low-light vignette & gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, rgba(12,12,12,0.35) 0%, #0c0c0c 85%)`,
            pointerEvents: "none",
          }}
        />
      </div>
    ),
    leftLabel: (
      <span style={{ color: log.isIntro ? "rgba(255,255,255,0.4)" : "#ffffff", fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
        {log.leftLabelText}
      </span>
    ),
    title: log.isIntro ? (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <span
          className="stagger-text-item"
          style={{
            fontSize: "0.85rem",
            color: "#ff4444",
            fontFamily: "var(--font-mono)",
            fontWeight: 800,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          // TECHNICAL SYSTEM ARCHITECTURE
        </span>
        <h2
          className="stagger-text-item"
          style={{
            fontSize: "clamp(3rem, 6.5vw, 5.5rem)",
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Build <span className="shimmer-gowni">Logs</span>
        </h2>
        <p
          className="stagger-text-item"
          style={{
            fontSize: "clamp(0.95rem, 1.8vw, 1.25rem)",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--font-sans)",
            maxWidth: "640px",
            margin: "8px 0 0 0",
            lineHeight: 1.6,
          }}
        >
          Real-time biometric neural pipelines, cryptographic hash ledgers, and deep learning model optimizations.
        </p>
        <div
          className="stagger-text-item"
          style={{
            marginTop: "24px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 24px",
            borderRadius: "99px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            fontSize: "0.78rem",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          <span>SCROLL DOWN TO EXPLORE LOGS</span>
          <ArrowDown size={14} />
        </div>
      </div>
    ) : (
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Large Open Display Title */}
        <h3
          className="stagger-text-item"
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-display)",
            lineHeight: 1.15,
            textShadow: `0 0 35px ${log.color}50`,
            willChange: "transform, opacity",
          }}
        >
          {log.title}
        </h3>

        {/* Separate Open Panels for Challenge & Solution */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            textAlign: "left",
          }}
          className="buildlog-open-grid"
        >
          {/* Challenge Column */}
          <div
            className="stagger-text-item"
            style={{
              paddingTop: "16px",
              borderTop: "2px solid #ff4444",
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ff4444",
                marginBottom: "10px",
              }}
            >
              <AlertCircle size={15} />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                OBSTACLE // CHALLENGE
              </span>
            </div>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "0.92rem",
                lineHeight: 1.65,
                margin: 0,
                fontFamily: "var(--font-sans)",
              }}
            >
              {log.challenge}
            </p>
          </div>

          {/* Solution Column */}
          <div
            className="stagger-text-item"
            style={{
              paddingTop: "16px",
              borderTop: `2px solid ${log.color}`,
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: log.color,
                marginBottom: "10px",
              }}
            >
              <Sparkles size={15} />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                ENGINEERED // SOLUTION
              </span>
            </div>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "0.92rem",
                lineHeight: 1.65,
                margin: 0,
                fontFamily: "var(--font-sans)",
              }}
            >
              {log.solution}
            </p>
          </div>
        </div>

        {/* Separate Floating Tech Stack Bar */}
        <div
          className="stagger-text-item"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            paddingTop: "10px",
            willChange: "transform, opacity",
          }}
        >
          {log.tech.map((t, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                padding: "6px 16px",
                borderRadius: "99px",
                background: "rgba(255, 255, 255, 0.06)",
                border: `1px solid ${log.color}70`,
                color: "#ffffff",
                letterSpacing: "0.06em",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    rightLabel: (
      <span style={{ color: log.isIntro ? "rgba(255,255,255,0.4)" : "#ffffff", fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
        {log.rightLabelText}
      </span>
    ),
  }));

  return (
    <section id="buildlogs" style={{ width: "100%", position: "relative" }}>
      <FullScreenScrollFX
        sections={sections}
        header={
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "0.75rem", color: "#ff0000", fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              SYSTEM ARCHITECTURE
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "6px 0 0 0", fontFamily: "var(--font-display)" }}>
              Build <span className="shimmer-gowni">Logs</span>
            </h2>
          </div>
        }
        footer={
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}>
            GSAP SCROLLTRIGGER ENGINE
          </span>
        }
        durations={{ change: 0.85, snap: 900 }}
        bgTransition="fade"
      />

      <style>{`
        @media (max-width: 768px) {
          .buildlog-open-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Buildlogs;
