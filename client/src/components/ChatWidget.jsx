import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm **ARIA** ✨ — Vamshi's personal AI assistant. Ask me anything about him — his projects, skills, experience, or availability!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newHistory,
        }),
      });
      const data = await res.json();
      
      if (data.success && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message || 'Sorry, I encountered an issue. Please make sure the backend server and Gemini API keys are configured correctly! 🔌',
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I couldn't connect to Vamshi's AI core right now. Check if the server is running on port 5000 🔌",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (content) => {
    return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full shadow-lg cursor-pointer"
        whileHover={{ 
          scale: 1.15, 
          rotate: 8,
          borderRadius: '12px',
          boxShadow: '0 0 35px 10px rgba(250, 204, 21, 0.85), 0 0 60px 20px rgba(234, 179, 8, 0.55)',
          filter: 'brightness(1.18) contrast(1.05)',
        }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'tween', duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%)',
          border: '1px solid rgba(202, 138, 4, 0.65)',
          color: '#1C1917',
          boxShadow: isOpen 
            ? '0 0 35px 10px rgba(250, 204, 21, 0.85), 0 0 60px 20px rgba(234, 179, 8, 0.55)'
            : '0 8px 28px -2px rgba(202, 138, 4, 0.45), 0 0 15px rgba(250, 204, 21, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
          filter: isOpen ? 'brightness(1.18) contrast(1.05)' : 'none',
        }}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="aria-chat"
            style={{
              position: 'absolute',
              bottom: '72px',
              right: '0',
              width: '380px',
              maxHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-lg), 0 0 40px rgba(234, 179, 8, 0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div className="aria-chat__header" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(250, 204, 21, 0.08)', borderBottom: '1px solid rgba(234, 179, 8, 0.15)' }}>
              <div className="aria-chat__avatar" style={{ position: 'relative', width: '38px', height: '38px' }}>
                <div className="avatar-orb" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #FFFFFF, var(--yellow), var(--yellow-dark))', boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)' }} />
                <div className="avatar-ring" style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', border: '1px solid rgba(234, 179, 8, 0.3)' }} />
              </div>
              <div className="aria-chat__info" style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>ARIA AI</h3>
                <span className="aria-status" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span className="status-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  {loading ? 'Thinking...' : 'Online'}
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="aria-chat__messages" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '350px', minHeight: '280px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`chat-bubble chat-bubble--${msg.role}`}
                  style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
                >
                  {msg.role === 'assistant' && (
                    <div className="bubble-avatar" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '0.85rem' }}>✨</div>
                  )}
                  <div
                    className="bubble-text"
                    style={msg.role === 'assistant' ? {
                      padding: '10px 14px',
                      borderRadius: '4px 14px 14px 14px',
                      fontSize: '0.83rem',
                      lineHeight: '1.55',
                      background: 'var(--bg-secondary)',
                      border: '1px solid rgba(234, 179, 8, 0.1)',
                      color: 'var(--text-secondary)'
                    } : {
                      padding: '10px 14px',
                      borderRadius: '14px 4px 14px 14px',
                      fontSize: '0.83rem',
                      lineHeight: '1.55',
                      background: 'var(--yellow)',
                      border: '1px solid var(--yellow-dark)',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      marginLeft: 'auto'
                    }}
                    dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
                  />
                </motion.div>
              ))}
              {loading && (
                <div className="chat-bubble chat-bubble--assistant" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', maxWidth: '85%' }}>
                  <div className="bubble-avatar" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '0.85rem' }}>✨</div>
                  <div className="bubble-typing" style={{ padding: '12px 14px', borderRadius: '4px 14px 14px 14px', background: 'var(--bg-secondary)', border: '1px solid rgba(234, 179, 8, 0.1)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className="dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--yellow-dark)', animation: 'typing-pulse 1s infinite alternate' }} />
                    <span className="dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--yellow-dark)', animation: 'typing-pulse 1s infinite alternate 0.2s' }} />
                    <span className="dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--yellow-dark)', animation: 'typing-pulse 1s infinite alternate 0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="aria-chat__input" style={{ display: 'flex', gap: '8px', padding: '12px 14px', borderTop: '1px solid rgba(234, 179, 8, 0.12)' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me about Vamshi..."
                className="aria-input"
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'var(--bg-primary)',
                  border: '1px solid rgba(234, 179, 8, 0.18)',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.83rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="aria-send-btn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--yellow)',
                  border: '1px solid var(--yellow-dark)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes typing-pulse {
          from { opacity: 0.3; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.1); }
        }
        @media (max-width: 480px) {
          .aria-chat {
            width: calc(100vw - 48px) !important;
            max-height: 460px !important;
            right: -12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
