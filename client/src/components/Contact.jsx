import { useRef, useState } from "react";
import { Github, Linkedin, Send, Mail, MapPin, Phone, Globe } from "lucide-react";
import { motion } from "framer-motion";

const AnimatedButtonText = ({ text }) => {
  const letters = text.split("");
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', position: 'relative' }}>
      {letters.map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            position: 'relative',
            whiteSpace: 'pre',
          }}
        >
          <span
            className="letter-top"
            style={{
              display: 'inline-block',
              transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
              transitionDelay: `${i * 0.02}s`,
            }}
          >
            {char}
          </span>
          <span
            className="letter-bottom"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: 'translateY(100%)',
              transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
              transitionDelay: `${i * 0.02}s`,
            }}
          >
            {char}
          </span>
        </span>
      ))}
    </span>
  );
};

const Contact = () => {
  const form = useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [ripples, setRipples] = useState([]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create ripple effect inside button
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const newRipple = { x: rippleX, y: rippleY, id: Date.now() };
    setRipples([...ripples, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    setLoading(true);
    setStatus(null);

    const formData = new FormData(form.current);
    const data = {
      name: formData.get("user_name"),
      email: formData.get("user_email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setLoading(false);

      if (result.success) {
        setStatus('success');
        form.current.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setLoading(false);
      setStatus('error');
    }
  };

  // Staggered Title variants
  const headingWords = "Let’s Connect & Build Something Amazing 🚀".split(" ");

  const titleContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 35, rotateX: 70 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: 'spring', stiffness: 200, damping: 18 }
    }
  };

  // Staggered info items
  const infoContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const infoItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section
      id="contact"
      style={{
        width: '100%',
        padding: '120px 24px',
        background: '#0c0c0c',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Grid Accent overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.005) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.005) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        opacity: 0.6,
      }} />

      {/* Glowing Pulsating Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 0, 0, 0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 0, 0, 0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
        className="contact-grid"
      >
        {/* Left Side: Contact Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          <div>
            <motion.div
              variants={titleContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              style={{ 
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', 
                fontWeight: 800, 
                marginBottom: '16px', 
                color: 'var(--text-primary)', 
                fontFamily: 'var(--font-display)', 
                lineHeight: 1.25,
                perspective: '800px',
              }}
            >
              {headingWords.map((word, index) => (
                <motion.span
                  key={index}
                  variants={wordVariants}
                  style={{ display: 'inline-block', marginRight: '8px', transformOrigin: 'bottom center', transformStyle: 'preserve-3d' }}
                >
                  {word.includes("Amazing") ? (
                    <span className="shimmer-gowni">Amazing</span>
                  ) : word}
                </motion.span>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: false, amount: 0.3 }}
              style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '480px' }}
            >
              Have an idea, a project, or want to discuss full-stack & AI opportunities? Send a message and let's start talking.
            </motion.p>
          </div>

          {/* Quick Info */}
          <motion.div
            variants={infoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <motion.div variants={infoItemVariants} className="info-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="info-icon-container" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 0, 0, 0.04)', border: '1px solid rgba(255, 0, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--yellow)' }}>
                <Mail size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>Email</h4>
                <a href="mailto:vamshigowniv26@gmail.com" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>vamshigowniv26@gmail.com</a>
              </div>
            </motion.div>

            <motion.div variants={infoItemVariants} className="info-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="info-icon-container" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 0, 0, 0.04)', border: '1px solid rgba(255, 0, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--yellow)' }}>
                <Phone size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>Phone</h4>
                <a href="tel:6301675616" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>+91 6301675616</a>
              </div>
            </motion.div>

            <motion.div variants={infoItemVariants} className="info-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="info-icon-container" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 0, 0, 0.04)', border: '1px solid rgba(255, 0, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--yellow)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>Location</h4>
                <span style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Bengaluru, India</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={infoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'flex', gap: '16px' }}
          >
            {[
              { icon: <Github size={20} />, link: "https://github.com/vamshiG24", label: "GitHub" },
              { icon: <Linkedin size={20} />, link: "https://www.linkedin.com/in/vamshi-gowni-8bba28322", label: "LinkedIn" },
              { icon: <Globe size={20} />, link: "https://portfolio-seven-chi-z8v6hmlert.vercel.app/", label: "Portfolio" }
            ].map((soc, i) => (
              <motion.a
                variants={infoItemVariants}
                key={i}
                href={soc.link}
                target="_blank"
                rel="noopener noreferrer"
                title={soc.label}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--card-bg)',
                  border: '1px solid rgba(255, 0, 0, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  transition: 'all 0.3s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="social-btn"
              >
                {soc.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div style={{ width: '100%' }}>
          <motion.form
            ref={form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{
              y: -4,
              borderColor: 'rgba(255, 0, 0, 0.6)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45), 0 0 30px rgba(255, 0, 0, 0.5)',
            }}
            style={{
              padding: '36px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 0, 0, 0.12)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 0, 0, 0.03)',
            }}
          >
            {/* Top red accent border line */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, var(--yellow), var(--yellow-dark))' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</label>
                <input
                  type="text"
                  name="user_name"
                  required
                  placeholder="Your Name"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.9rem',
                  }}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
                <input
                  type="email"
                  name="user_email"
                  required
                  placeholder="name@email.com"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.9rem',
                  }}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Subject</label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Project Inquiry"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Message</label>
              <textarea
                name="message"
                required
                rows="5"
                placeholder="Describe your idea or message..."
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.9rem',
                  resize: 'none',
                }}
                className="form-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {ripples.map(r => (
                <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
              ))}
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <>
                  <Send size={16} className="send-icon" style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  <AnimatedButtonText text="Send Message" />
                </>
              )}
            </button>

            {/* Status alerts */}
            {status === 'success' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#10B981', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                ✅ Message sent successfully! I'll get back to you shortly.
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#EF4444', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                ❌ Failed to send message. Please check the backend connection.
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .info-card {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid transparent;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .info-card:hover {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 0, 0, 0.1);
          transform: translateX(6px);
        }
        .info-icon-container {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .info-card:hover .info-icon-container {
          transform: scale(1.1) rotate(5deg);
          border-color: var(--yellow) !important;
          background: rgba(255, 0, 0, 0.12) !important;
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.2);
        }

        .social-btn {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .social-btn:hover {
          color: #ffffff !important;
          border-color: var(--yellow) !important;
          background: var(--yellow) !important;
          transform: translateY(-5px) rotate(8deg) !important;
          box-shadow: 0 8px 20px rgba(255, 0, 0, 0.25) !important;
        }
        
        .form-input {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .form-input:focus {
          border-color: var(--yellow) !important;
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.22) !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }

        .btn-primary:hover {
          transform: translateY(-2px) !important;
          filter: none !important;
          box-shadow: 0 4px 12px rgba(204, 0, 0, 0.2), 0 0 20px rgba(255, 0, 0, 0.38) !important;
          border-color: rgba(255, 0, 0, 0.6) !important;
        }

        .btn-primary:hover .letter-top {
          transform: translateY(-100%);
        }
        
        .btn-primary:hover .letter-bottom {
          transform: translateY(0%);
        }

        .btn-primary:hover .send-icon {
          transform: translateX(4px) scale(1.05);
        }

        @media (max-width: 767px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
