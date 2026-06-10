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
    padding: '0 24px',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 1000,
    pointerEvents: 'none',
  };

  const containerStyle = scrolled
    ? {
      width: '100%',
      maxWidth: '960px',
      borderRadius: '50px',
      border: '1px solid rgba(234, 179, 8, 0.22)',
      boxShadow: '0 12px 30px -10px rgba(234, 179, 8, 0.18), 0 0 15px rgba(250, 204, 21, 0.04)',
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '12px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'auto',
    }
    : {
      width: '100%',
      maxWidth: '1200px',
      borderRadius: '0px',
      border: '1px solid transparent',
      borderBottom: '1px solid transparent',
      boxShadow: 'none',
      background: 'transparent',
      padding: '24px 8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'auto',
    };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold cursor-pointer"
          style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}
          onClick={(e) => handleLinkClick(e, 'home')}
        >
          <span style={{ color: 'var(--text-primary)' }}>Vamshi</span>
          <span style={{ color: 'var(--yellow-dark)' }}>.dev</span>
        </motion.h1>

        {/* Desktop Navigation */}
        <ul className="desktop-menu" style={{ gap: '32px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
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
                    color: isActive ? 'var(--yellow-dark)' : 'var(--text-secondary)',
                    transition: 'color 0.3s ease',
                    padding: '6px 0',
                    fontFamily: 'var(--font-display)',
                  }}
                  className="nav-hover-link"
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'var(--yellow-dark)',
                        borderRadius: '99px',
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
              top: scrolled ? 'calc(100% + 12px)' : '100%',
              left: scrolled ? '0px' : '0px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: scrolled ? '24px' : '0px',
              border: scrolled ? '1px solid rgba(234, 179, 8, 0.22)' : 'none',
              borderBottom: scrolled ? '1px solid rgba(234, 179, 8, 0.22)' : '1px solid rgba(234, 179, 8, 0.12)',
              boxShadow: scrolled ? 'var(--shadow-lg)' : 'none',
              overflow: 'hidden',
            }}
            className="md:hidden"
          >
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', listStyle: 'none' }}>
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
                        color: isActive ? 'var(--yellow-dark)' : 'var(--text-primary)',
                        fontFamily: 'var(--font-display)',
                        padding: '6px 0',
                      }}
                    >
                      {link.label}
                      {isActive && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--yellow-dark)', boxShadow: '0 0 8px var(--yellow-glow-strong)' }} />
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
          color: var(--yellow-dark) !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
