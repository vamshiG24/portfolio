import { useRef, useState } from "react";
import { Github, Linkedin, Send, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [ripples, setRipples] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create ripple effect inside button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
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
      const res = await fetch("http://localhost:5000/send-email", {
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

  return (
    <section
      id="contact"
      style={{
        width: '100%',
        padding: '100px 24px',
        background: 'var(--bg-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'start',
        }}
        className="contact-grid"
      >
        {/* Left Side: Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
              Let’s Connect & Build <br />
              <span style={{ color: 'var(--yellow-dark)' }}>Something Amazing</span> 🚀
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Have an idea, a project, or want to discuss full-stack & AI opportunities? Send a message and let's start talking.
            </p>
          </div>

          {/* Quick Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.06)', border: '1px solid rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--yellow-dark)' }}>
                <Mail size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Email</h4>
                <a href="mailto:vamshigowniv26@gmail.com" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>vamshigowniv26@gmail.com</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.06)', border: '1px solid rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--yellow-dark)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Location</h4>
                <span style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>India</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { icon: <Github size={20} />, link: "https://github.com/vamshiG24" },
              { icon: <Linkedin size={20} />, link: "https://www.linkedin.com/in/vamshi-gowni-8bba28322" }
            ].map((soc, i) => (
              <a
                key={i}
                href={soc.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--card-bg)',
                  border: '1px solid rgba(234, 179, 8, 0.25)',
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
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ width: '100%' }}
        >
          <form
            ref={form}
            onSubmit={handleSubmit}
            className="glass-card"
            style={{
              padding: '36px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Top golden border line */}
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
                    background: 'var(--bg-primary)',
                    border: '1px solid rgba(234, 179, 8, 0.15)',
                    color: 'var(--text-primary)',
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
                    background: 'var(--bg-primary)',
                    border: '1px solid rgba(234, 179, 8, 0.15)',
                    color: 'var(--text-primary)',
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
                  background: 'var(--bg-primary)',
                  border: '1px solid rgba(234, 179, 8, 0.15)',
                  color: 'var(--text-primary)',
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
                  background: 'var(--bg-primary)',
                  border: '1px solid rgba(234, 179, 8, 0.15)',
                  color: 'var(--text-primary)',
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
              }}
            >
              {ripples.map(r => (
                <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
              ))}
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <>
                  <Send size={16} /> Send Message
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
          </form>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .social-btn {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .social-btn:hover {
          color: var(--text-primary) !important;
          border-color: var(--yellow-dark) !important;
          background: var(--yellow) !important;
          transform: translateY(-5px) rotate(8deg) !important;
          box-shadow: 0 8px 20px rgba(234, 179, 8, 0.25) !important;
        }
        .form-input {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .form-input:focus {
          border-color: var(--yellow-dark) !important;
          box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.15), 0 4px 12px rgba(234, 179, 8, 0.05) !important;
          background: #FFFFFF !important;
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
