import { useEffect } from 'react';

const JourneyThemeStyles = () => {
  useEffect(() => {
    const styleId = 'journey-theme-premium-styles';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        /* Sticky Timeline Navigation Left Panel */
        .sticky-timeline-nav {
          width: 140px;
          flex-shrink: 0;
          display: block;
        }

        /* 3D Orbiting Orbs/Icons Around the central dot */
        .orbit-item {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          animation: orbit-spin var(--orbit-duration, 16s) linear infinite;
        }

        .orbit-item-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: orbit-spin-counter var(--orbit-duration, 16s) linear infinite;
        }

        /* Hover states: double speed */
        .timeline-row:hover {
          --orbit-duration: 7s;
        }

        @keyframes orbit-spin {
          from {
            transform: rotate(var(--orbit-angle, 0deg)) translateX(44px);
          }
          to {
            transform: rotate(calc(var(--orbit-angle, 0deg) + 360deg)) translateX(44px);
          }
        }

        @keyframes orbit-spin-counter {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        /* Main Grid Alternating Layout */
        .timeline-row {
          grid-template-columns: 1fr 70px 1fr;
          align-items: center;
        }

        .row-left .timeline-panel {
          grid-column: 1;
        }
        .row-left .timeline-badge-container {
          grid-column: 2;
        }
        .row-right .timeline-panel {
          grid-column: 3;
        }
        .row-right .timeline-badge-container {
          grid-column: 2;
        }

        .timeline-badge-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .timeline-badge-dot {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ----------------------------------------------------
           PREMIUM MOUSE GLOW & TILT CONTAINER
           ---------------------------------------------------- */
        .mouse-glow-wrapper {
          transform: perspective(1200px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) translate3d(var(--translate-x, 0px), var(--translate-y, 0px), 0px);
          will-change: transform, box-shadow;
        }

        /* 1. Frosted Glass Depth Blur Layer */
        .frosted-glass-blur {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          background: rgba(255, 255, 255, 0.78);
          z-index: 0;
          transition: backdrop-filter 0.5s ease, background 0.5s ease;
        }
        .mouse-glow-wrapper:hover .frosted-glass-blur {
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          background: rgba(255, 255, 255, 0.82);
        }

        /* 2. Shifting Aurora Background Layer */
        .aurora-bg {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: 0;
          opacity: 0.06;
          background: linear-gradient(135deg, #f97316, #0ea5e9, #8b5cf6);
          background-size: 200% 200%;
          animation: aurora-shift 14s ease infinite, bg-pulse 4.5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes aurora-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes bg-pulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.10; }
        }

        /* 3. Noise Overlay Layer (Vintage Film Filmgrain) */
        .noise-overlay {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
        }

        /* 4. Expanding Ambient Ring */
        .ambient-ring {
          position: absolute;
          inset: 0;
          border: 2px solid var(--border-glow-color);
          border-radius: inherit;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }
        .mouse-glow-wrapper:hover .ambient-ring {
          animation: ring-expand 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes ring-expand {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.08); opacity: 0; }
        }

        /* 5. Dynamic Cursor Spotlight (Follows mouse) */
        .mouse-glow-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.4s ease;
          background: radial-gradient(
            220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
            var(--glow-color, rgba(204, 0, 0, 0.15)),
            transparent 80%
          );
          border-radius: inherit;
        }
        .mouse-glow-wrapper:hover .mouse-glow-overlay {
          opacity: 1;
        }

        /* 6. Multi-layer Glow & Shadows + Lift */
        .mouse-glow-wrapper:hover {
          transform: translateY(-10px) scale(1.02) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg)) rotateZ(0.5deg) !important;
          box-shadow: 
            0 4px 6px -1px rgba(0,0,0,0.04),
            0 10px 20px -5px rgba(0,0,0,0.06),
            0 20px 30px -10px var(--glow-color),
            0 40px 60px -20px var(--glow-color) !important;
        }

        /* 7. Holographic Reflection diagonal swipe */
        .dashboard-timeline-card::after {
          content: "";
          position: absolute;
          top: -60%;
          left: -80%;
          width: 35%;
          height: 220%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.14) 30%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(255, 255, 255, 0.14) 70%,
            transparent
          );
          transform: rotate(32deg);
          transition: none;
          opacity: 0;
          z-index: 3;
          pointer-events: none;
        }
        .mouse-glow-wrapper:hover .dashboard-timeline-card::after {
          left: 170%;
          opacity: 1;
          transition: left 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
        }

        /* 8. Neon Corner Accents ( tl / tr / bl / br ) */
        .neon-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid transparent;
          pointer-events: none;
          z-index: 5;
          opacity: 0.85;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .corner-tl { top: -1px; left: -1px; border-top-color: var(--border-glow-color); border-left-color: var(--border-glow-color); }
        .corner-tr { top: -1px; right: -1px; border-top-color: var(--border-glow-color); border-right-color: var(--border-glow-color); }
        .corner-bl { bottom: -1px; left: -1px; border-bottom-color: var(--border-glow-color); border-left-color: var(--border-glow-color); }
        .corner-br { bottom: -1px; right: -1px; border-bottom-color: var(--border-glow-color); border-right-color: var(--border-glow-color); }

        .mouse-glow-wrapper:hover .neon-corner {
          opacity: 0;
          transform: scale(0.85);
        }

        /* 9. Animated Tech Pills Staggered Lift */
        .tech-pill-badge {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .timeline-row:hover .tech-pill-badge:nth-child(1) { transition-delay: 0.02s; transform: translateY(-4px); border-color: var(--border-glow-color); box-shadow: 0 4px 8px rgba(0,0,0,0.03); }
        .timeline-row:hover .tech-pill-badge:nth-child(2) { transition-delay: 0.06s; transform: translateY(-4px); border-color: var(--border-glow-color); box-shadow: 0 4px 8px rgba(0,0,0,0.03); }
        .timeline-row:hover .tech-pill-badge:nth-child(3) { transition-delay: 0.10s; transform: translateY(-4px); border-color: var(--border-glow-color); box-shadow: 0 4px 8px rgba(0,0,0,0.03); }
        .timeline-row:hover .tech-pill-badge:nth-child(4) { transition-delay: 0.14s; transform: translateY(-4px); border-color: var(--border-glow-color); box-shadow: 0 4px 8px rgba(0,0,0,0.03); }
        .timeline-row:hover .tech-pill-badge:nth-child(5) { transition-delay: 0.18s; transform: translateY(-4px); border-color: var(--border-glow-color); box-shadow: 0 4px 8px rgba(0,0,0,0.03); }
        .timeline-row:hover .tech-pill-badge:nth-child(6) { transition-delay: 0.22s; transform: translateY(-4px); border-color: var(--border-glow-color); box-shadow: 0 4px 8px rgba(0,0,0,0.03); }
        .timeline-row:hover .tech-pill-badge:nth-child(7) { transition-delay: 0.26s; transform: translateY(-4px); border-color: var(--border-glow-color); box-shadow: 0 4px 8px rgba(0,0,0,0.03); }

        /* 10. Card Sub-sections individual lighting on focus */
        .card-sub-section {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 8px;
        }
        .card-sub-section:hover {
          border-color: rgba(204, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 0 4px 15px rgba(204, 0, 0, 0.03);
          transform: scale(1.005);
        }

        /* 11. Custom CSS keyframe shifts */
        .dashboard-timeline-card {
          border-radius: var(--radius-lg);
          transition: border-color 0.5s ease;
          position: relative;
        }

        .card-columns-grid {
          display: flex;
          gap: 28px;
          flex-direction: row;
        }

        /* 11. Border Beam and Lightning Flicker Animation */
        .border-beam-rect {
          stroke-dashoffset: 0;
        }

        @keyframes beam-loop {
          0% { stroke-dashoffset: 900; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes lightning-flicker {
          0%, 100% {
            opacity: 0.9;
            filter: drop-shadow(0 0 5px var(--border-glow-color)) brightness(1.1);
          }
          15% {
            opacity: 0.3;
            filter: drop-shadow(0 0 1px var(--border-glow-color)) brightness(0.6);
          }
          18% {
            opacity: 1;
            filter: drop-shadow(0 0 16px var(--border-glow-color)) brightness(1.8);
          }
          30% { opacity: 0.6; }
          32% { opacity: 0.95; }
          40% { opacity: 0.25; }
          43% {
            opacity: 1;
            filter: drop-shadow(0 0 14px var(--border-glow-color)) brightness(1.5);
          }
          70% { opacity: 0.7; }
          75% {
            opacity: 0.35;
            filter: drop-shadow(0 0 2px var(--border-glow-color)) brightness(0.7);
          }
          78% {
            opacity: 1;
            filter: drop-shadow(0 0 18px var(--border-glow-color)) brightness(1.9);
          }
        }

        .mouse-glow-wrapper:hover .border-beam-rect {
          opacity: 1 !important;
          animation: beam-loop 4s linear infinite, lightning-flicker 2s ease-in-out infinite !important;
        }

        .mouse-glow-wrapper:hover .mouse-glow-overlay {
          animation: lightning-flicker 4s ease-in-out infinite !important;
        }

        /* Mobile Collapses */
        @media (max-width: 1024px) {
          .sticky-timeline-nav {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .timeline-center-line {
            left: 22px !important;
            transform: none !important;
          }
          .timeline-row {
            display: flex !important;
            flex-direction: row !important;
            gap: 16px !important;
            margin-bottom: 48px !important;
          }
          .timeline-badge-container {
            width: 44px !important;
            flex-shrink: 0 !important;
            justify-content: center !important;
            height: auto !important;
            align-items: flex-start !important;
            padding-top: 6px !important;
          }
          .timeline-panel {
            flex: 1 !important;
            width: auto !important;
            text-align: left !important;
          }
          .card-columns-grid {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .row-left .timeline-panel, .row-right .timeline-panel {
            grid-column: unset !important;
            transform: none !important;
          }
          .row-left .timeline-badge-container, .row-right .timeline-badge-container {
            grid-column: unset !important;
          }
          @keyframes orbit-spin {
            from {
              transform: rotate(var(--orbit-angle, 0deg)) translateX(36px);
            }
            to {
              transform: rotate(calc(var(--orbit-angle, 0deg) + 360deg)) translateX(36px);
            }
          }
        }
      `;
      document.head.appendChild(styleEl);
    }

    return () => {
      const existing = document.getElementById(styleId);
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return null;
};

export default JourneyThemeStyles;
export { JourneyThemeStyles };
