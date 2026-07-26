import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Check if we are at the bottom of the page
      const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 80;
      if (isAtBottom) {
        setActiveSection('contact');
        return;
      }

      const sections = ['home', 'timeline', 'skills', 'projects', 'buildlogs', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Timeline', href: '#timeline', id: 'timeline' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Build Logs', href: '#buildlogs', id: 'buildlogs' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navStyle = {
    position: 'fixed',
    top: scrolled ? '16px' : '0px',
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: scrolled ? '0 24px' : '0',
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 1000,
    pointerEvents: 'none',
  };

  const containerStyle = scrolled
    ? {
      width: '100%',
      maxWidth: '960px',
      borderRadius: '50px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      background: 'rgba(12, 12, 12, 0.65)',
      backdropFilter: 'blur(24px) saturate(190%)',
      WebkitBackdropFilter: 'blur(24px) saturate(190%)',
      padding: '10px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'auto',
    }
    : {
      width: '100%',
      maxWidth: '1400px',
      borderRadius: '0px',
      border: '1px solid transparent',
      boxShadow: 'none',
      background: 'transparent',
      backdropFilter: 'blur(0px) saturate(100%)',
      WebkitBackdropFilter: 'blur(0px) saturate(100%)',
      padding: '24px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'auto',
    };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          style={{
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        >
          vamshi<span style={{ color: '#ff0000', textShadow: '0 0 10px rgba(255, 0, 0, 0.8)' }}>.dev</span>
        </a>

        {/* Desktop Navigation */}
        <ul className="desktop-menu" style={{ gap: '28px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
          {navLinks.map((link, index) => {
            const isActive = activeSection === link.id;
            return (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.5 }}
              >
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  style={{
                    position: 'relative',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isActive ? '#ff0000' : 'var(--text-secondary)',
                    textShadow: isActive ? '0 0 10px rgba(255, 0, 0, 0.6)' : 'none',
                    transition: 'all 0.3s ease',
                    padding: '8px 0',
                    display: 'inline-block',
                    fontFamily: 'var(--font-display)',
                  }}
                  className="nav-hover-link"
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-underline"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        width: '100%',
                        height: '3px',
                        backgroundColor: '#ff0000',
                        borderRadius: '99px',
                        boxShadow: '0 0 10px #ff0000, 0 0 20px rgba(255, 0, 0, 0.8)',
                        zIndex: 1,
                      }}
                    />
                  )}
                </a>
              </motion.li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <div className="mobile-toggle-wrapper">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-toggle-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              left: '16px',
              width: 'calc(100% - 32px)',
              background: 'rgba(12, 12, 12, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'var(--shadow-lg), 0 0 20px rgba(255, 0, 0, 0.05)',
              overflow: 'hidden',
            }}
            className="md:hidden"
          >
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', listStyle: 'none' }}>
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textDecoration: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: isActive ? '#ffffff' : 'var(--text-primary)',
                        fontFamily: 'var(--font-display)',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        backgroundColor: isActive ? 'rgba(255, 0, 0, 0.15)' : 'transparent',
                        border: isActive ? '1px solid rgba(255, 0, 0, 0.35)' : '1px solid transparent',
                        boxShadow: isActive ? '0 0 10px rgba(255, 0, 0, 0.2)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {link.label}
                      {isActive && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff0000', boxShadow: '0 0 8px #ff0000' }} />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS overrides for desktop display flex hide rules */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-toggle-wrapper { display: none !important; }
          .desktop-menu { display: flex !important; }
        }
        @media (max-width: 767px) {
          .mobile-toggle-wrapper { display: block !important; }
          .desktop-menu { display: none !important; }
        }
        .nav-hover-link:hover {
          color: #ff0000 !important;
          text-shadow: 0 0 10px rgba(255, 0, 0, 0.6);
        }
        .mobile-toggle-btn {
          transition: color 0.3s ease;
        }
        .mobile-toggle-btn:hover {
          color: #ff0000 !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
