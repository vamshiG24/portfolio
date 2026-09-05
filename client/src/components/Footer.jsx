import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Heart, Sparkles, Terminal } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Build Logs', href: '#buildlogs' },
    { label: 'Honors', href: '#credentials' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer
      style={{
        width: '100%',
        background: '#0a0a0e',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        zIndex: 10,
        color: '#ffffff',
        padding: '60px 24px 32px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(255, 0, 0, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Top Grid Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255, 68, 68, 0.15)',
                  border: '1px solid rgba(255, 68, 68, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff4444',
                }}
              >
                <Terminal size={18} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                Vamshi <span className="shimmer-gowni">Gowni</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0, maxWidth: '360px' }}>
              MERN Stack & AI/ML engineer. Research Intern at IIT Madras working on LLM watermarking using Pseudorandom Codes, scalable backends, and AI-powered systems.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
              <span style={{ fontSize: '0.72rem', color: '#22c55e', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.1em' }}>
                AVAILABLE FOR NEW OPPORTUNITIES
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '0.75rem', color: '#ff4444', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              NAVIGATION
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  style={{
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    transition: 'color 0.25s ease, transform 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Connect & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '0.75rem', color: '#ff4444', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              CONNECT & SOCIAL
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://github.com/vamshiG24"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label="GitHub Profile"
              >
                <Github size={18} />
              </a>

              <a
                href="https://www.linkedin.com/in/vamshi-gowni-8bba28322"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0077b5',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 119, 181, 0.2)';
                  e.currentTarget.style.borderColor = '#0077b5';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="mailto:vamshigowniv26@gmail.com"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff4444',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = '#ff4444';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                aria-label="Send Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back To Top */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.82rem', margin: 0, fontFamily: 'var(--font-mono)' }}>
            &copy; {new Date().getFullYear()} Vamshi Gowni. Engineered with MERN, GSAP & PyTorch.
          </p>

          <button
            onClick={scrollToTop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '99px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
