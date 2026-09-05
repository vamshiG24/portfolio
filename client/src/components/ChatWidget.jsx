import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Bot, Copy, Check, Maximize2, Minimize2,
  Mic, MicOff, Volume2, VolumeX, ThumbsUp, ThumbsDown
} from 'lucide-react';

// Web Audio API Sound Synthesizer (Zero static assets needed)
const playSynthSound = (type, isMuted) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'swoosh') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === 'chime') {
      // Warm, digital chord for AI responses
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.025);

        gain.gain.setValueAtTime(0.03, ctx.currentTime + idx * 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5 + idx * 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.025);
        osc.stop(ctx.currentTime + 0.6 + idx * 0.04);
      });
    }
  } catch (e) {
    console.warn('Synth sound error:', e);
  }
};

// Canvas AI Neural Core Visualization
const NeuralCoreCanvas = ({ loading, isListening }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const numParticles = 48;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.25,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let mouse = { x: null, y: null, active: false };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const coreBaseRadius = Math.min(width, height) * 0.16;

      // Glow pulse depends on states (idle vs. thinking vs. listening)
      let coreGlowSize = coreBaseRadius + Math.sin(tick * 0.025) * 8;
      if (loading) {
        coreGlowSize += Math.sin(tick * 0.12) * 6;
      }
      if (isListening) {
        coreGlowSize += Math.sin(tick * 0.22) * 12;
      }

      // Draw beautiful central energy gradient
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        coreGlowSize
      );
      coreGrad.addColorStop(0, 'rgba(255, 68, 68, 0.22)');
      coreGrad.addColorStop(0.35, 'rgba(255, 68, 68, 0.07)');
      coreGrad.addColorStop(1, 'rgba(255, 68, 68, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreGlowSize, 0, Math.PI * 2);
      ctx.fill();

      // Render connected constellation
      particles.forEach((p, idx) => {
        let vx = p.vx;
        let vy = p.vy;

        // Vibrate more during listening mode
        if (isListening) {
          vx *= 2.8;
          vy *= 2.8;
        }

        p.x += vx;
        p.y += vy;

        // Boundary reflection
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive mouse push/pull logic
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const force = (110 - dist) / 1100;
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        // Periodic node fade-pulsing
        const alphaPulse = p.alpha + Math.sin(tick * p.pulseSpeed + p.pulseOffset) * 0.12;

        ctx.fillStyle = `rgba(255, 68, 68, ${alphaPulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Trace connections between nearby nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            let lineAlpha = (1 - dist / 90) * 0.1;
            if (loading) {
              lineAlpha *= 1.6 + Math.sin(tick * 0.08 + idx) * 0.45;
            }

            ctx.strokeStyle = `rgba(255, 68, 68, ${lineAlpha})`;
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw light ripples running along connection wires towards center when AI calculates
        if (loading && idx % 5 === 0) {
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const progress = (tick * 0.008 + p.pulseOffset) % 1.0;
          const rx = p.x + dx * progress;
          const ry = p.y + dy * progress;

          ctx.fillStyle = `rgba(255, 255, 255, ${0.35 * (1 - progress)})`;
          ctx.beginPath();
          ctx.arc(rx, ry, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Subtle minimalist framing line
      ctx.strokeStyle = 'rgba(255, 68, 68, 0.04)';
      ctx.lineWidth = 1;
      ctx.strokeRect(12, 12, width - 24, height - 24);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [loading, isListening]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block cursor-crosshair opacity-80"
    />
  );
};

// Premium Interactive Code Block Component
const CodeBlock = ({ lang, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border border-white/5 bg-[#0a0a0c]/40 backdrop-blur-md rounded-xl my-3 overflow-hidden text-xs font-mono">
      <div className="flex items-center justify-between px-4 py-2 bg-white/2 border-b border-white/5 text-white/40 select-none">
        <span className="text-[10px] uppercase tracking-wider font-semibold">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer text-[11px]"
        >
          {copied ? (
            <>
              <Check size={11} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-white/90 leading-normal scrollbar-thin">
        <pre className="whitespace-pre">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
};

// Custom Safe Markdown Parser
const parseMessageContent = (text) => {
  if (!text) return null;

  const blocks = [];
  const lines = text.split('\n');
  let currentBlockType = 'text'; // 'text', 'code', 'list'
  let currentCodeLang = '';
  let currentCodeLines = [];
  let currentListItems = [];
  let currentTextLines = [];

  const flushText = () => {
    if (currentTextLines.length > 0) {
      blocks.push({
        type: 'text',
        content: currentTextLines.join('\n')
      });
      currentTextLines = [];
    }
  };

  const flushList = () => {
    if (currentListItems.length > 0) {
      blocks.push({
        type: 'list',
        items: [...currentListItems]
      });
      currentListItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect code blocks
    if (line.trim().startsWith('```')) {
      if (currentBlockType === 'code') {
        blocks.push({
          type: 'code',
          lang: currentCodeLang,
          content: currentCodeLines.join('\n')
        });
        currentCodeLines = [];
        currentCodeLang = '';
        currentBlockType = 'text';
      } else {
        flushText();
        flushList();
        currentBlockType = 'code';
        currentCodeLang = line.trim().slice(3).toLowerCase() || 'javascript';
      }
      continue;
    }

    if (currentBlockType === 'code') {
      currentCodeLines.push(line);
      continue;
    }

    // Detect lists
    const listMatch = line.match(/^(\s*)[-*+]\s+(.*)/);
    if (listMatch) {
      flushText();
      currentBlockType = 'list';
      currentListItems.push(listMatch[2]);
      continue;
    }

    const numListMatch = line.match(/^(\s*)\d+\.\s+(.*)/);
    if (numListMatch) {
      flushText();
      currentBlockType = 'list';
      currentListItems.push(numListMatch[2]);
      continue;
    }

    if (line.trim() === '') {
      flushText();
      flushList();
      currentBlockType = 'text';
    } else {
      if (currentBlockType === 'list') {
        flushList();
        currentBlockType = 'text';
      }
      currentTextLines.push(line);
    }
  }

  flushText();
  flushList();

  const parseInline = (str) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /(\*\*|`)(.*?)\1/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
      const index = match.index;
      const type = match[1];
      const textVal = match[2];

      if (index > lastIndex) {
        parts.push(str.substring(lastIndex, index));
      }

      if (type === '**') {
        parts.push(
          <strong key={index} className="font-bold text-[#ff4444] tracking-wide" style={{ textShadow: '0 0 10px rgba(255, 68, 68, 0.1)' }}>
            {textVal}
          </strong>
        );
      } else if (type === '`') {
        parts.push(
          <code key={index} className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-xs text-[#ff5555] font-mono">
            {textVal}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  return (
    <div className="space-y-2.5">
      {blocks.map((block, idx) => {
        if (block.type === 'text') {
          return (
            <p key={idx} className="text-sm leading-relaxed text-white/85">
              {parseInline(block.content)}
            </p>
          );
        } else if (block.type === 'list') {
          return (
            <ul key={idx} className="list-disc list-inside space-y-1 pl-1 text-sm text-white/85">
              {block.items.map((item, listIdx) => (
                <li key={listIdx} className="leading-relaxed">
                  {parseInline(item)}
                </li>
              ))}
            </ul>
          );
        } else if (block.type === 'code') {
          return (
            <CodeBlock
              key={idx}
              lang={block.lang}
              content={block.content}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

// Main Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('ivy_chat_muted') === 'true');
  const [isListening, setIsListening] = useState(false);
  const [clickRipples, setClickRipples] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm **IVY** ✨ — Vamshi's personal AI assistant. Ask me anything about him — his IIT Madras research, key projects like BioSecure and Secure Digital Evidence, skills, or verified credentials!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Voice Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setInput(transcript);
          sendMessage(transcript.trim());
        }
      };

      rec.onerror = (err) => {
        console.warn('SpeechRecognition error:', err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleMute = () => {
    const nextVal = !isMuted;
    setIsMuted(nextVal);
    localStorage.setItem('ivy_chat_muted', String(nextVal));
    playSynthSound('click', nextVal);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    playSynthSound('click', isMuted);
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech synthesis start fail:', err);
      }
    }
  };

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      playSynthSound('click', isMuted);
    }
    const id = Date.now();
    setClickRipples(prev => [...prev, id]);
    setTimeout(() => {
      setClickRipples(prev => prev.filter(r => r !== id));
    }, 850);
  };

  const sendMessage = async (overrideInput) => {
    const textToSend = (overrideInput !== undefined && typeof overrideInput === 'string')
      ? overrideInput
      : input.trim();

    if (!textToSend || loading) return;

    playSynthSound('swoosh', isMuted);

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);

    if (overrideInput === undefined) {
      setInput('');
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://portfolio-umtu.onrender.com');
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      if (data.success && data.reply) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        playSynthSound('chime', isMuted);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.message || "I encountered an issue connecting to my logic core. Let's try again in a bit! 🔌",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        playSynthSound('chime', isMuted);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I couldn't reach Vamshi's AI core right now. Check if the server is running on port 5000 🔌",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      playSynthSound('chime', isMuted);
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

  const handleFeedback = (msgId, action) => {
    playSynthSound('click', isMuted);
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, feedback: m.feedback === action ? null : action };
      }
      return m;
    }));
  };

  const quickPrompts = [
    { text: "🔍 Tell me about Vamshi", query: "Who is Vamshi Gowni?" },
    { text: "🚀 What are his projects?", query: "What are Vamshi's key projects?" },
    { text: "💻 Technical stack", query: "What tools and technologies does he use?" },
    { text: "✉️ How can I contact him?", query: "What are Vamshi's contact details and availability?" }
  ];

  const isVoiceSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Immersive Welcome Tooltip Pill */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 25, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 15, scale: 0.85 }}
            transition={{ delay: 2.2, type: 'spring', stiffness: 300, damping: 22 }}
            onClick={handleToggleClick}
            className="hidden sm:flex items-center gap-2.5 cursor-pointer border hover:border-white/10 select-none group"
            style={{
              position: 'absolute',
              right: '72px',
              top: '8px',
              padding: '10px 16px',
              background: 'rgba(10, 10, 14, 0.45)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderColor: 'rgba(255, 68, 68, 0.2)',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(255, 68, 68, 0.04)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="text-[11.5px] font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">
              Want to know about Vamshi? <span className="text-[#ff4444] font-bold group-hover:text-[#ff5555]">Ask IVY!</span> 🤖✨
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4444] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4444]"></span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={handleToggleClick}
        className="flex items-center justify-center rounded-full cursor-pointer border"
        whileHover={{ 
          scale: 1.05,
        }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        style={{
          width: '56px',
          height: '56px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
      >


        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={20} style={{ color: '#ffffff' }} />
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Bot size={22} style={{ color: '#ff3333' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop overlay for Maximized Mode */}
      <AnimatePresence>
        {isOpen && isMaximized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playSynthSound('click', isMuted);
              setIsMaximized(false);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9990,
              background: 'rgba(4, 4, 6, 0.35)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Chat Box Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMaximized
              ? { opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }
              : { opacity: 0, scale: 0.88, y: 40, x: 10 }
            }
            animate={isMaximized
              ? { opacity: 1, scale: 1, x: '-50%', y: '-50%' }
              : { opacity: 1, scale: 1, y: 0, x: 0 }
            }
            exit={isMaximized
              ? { opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }
              : { opacity: 0, scale: 0.88, y: 40, x: 10 }
            }
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            style={isMaximized ? {
              position: 'fixed',
              left: '50%', top: '50%', zIndex: 9995,
              width: 'min(920px, 92vw)', height: 'min(640px, 82vh)',
              display: 'flex',
              background: 'rgba(10, 10, 20, 0.45)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
              overflow: 'hidden',
            } : {
              position: 'absolute', bottom: '76px', right: '0',
              width: '400px', height: '560px',
              display: 'flex', flexDirection: 'column',
              background: 'rgba(10, 10, 20, 0.48)',
              backdropFilter: 'blur(36px) saturate(180%)',
              WebkitBackdropFilter: 'blur(36px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderTop: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Left Column: AI Neural Core (Maximized Only) */}
            {isMaximized && (
              <div
                className="hidden md:flex flex-col relative items-center justify-center"
                style={{
                  width: '42%',
                  background: 'rgba(0, 0, 0, 0.12)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.03)'
                }}
              >
                {/* Dynamic canvas backdrop */}
                <div className="absolute inset-0 z-0">
                  <NeuralCoreCanvas loading={loading} isListening={isListening} />
                </div>

                {/* Text overlays in neural core area */}
                <div className="relative z-10 text-center px-8 select-none pointer-events-none">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-white/2 border border-white/5 shadow-inner">
                    <Bot size={28} className="text-[#ff4444]" />
                  </div>
                  <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-1">IVY Core Interface</h4>
                  <p className="text-[11px] text-white/35 font-mono">
                    {loading ? 'CALCULATING PATHS...' : isListening ? 'DICTATING SIGNAL...' : 'NEURAL LINK ACTIVE'}
                  </p>
                </div>
              </div>
            )}

            {/* Right Column: Chat Console */}
            <div className="flex flex-col flex-1 h-full min-w-0">
              {/* Chat Header */}
              {/* Chat Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px 18px',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                minHeight: '66px', flexShrink: 0,
              }}>


                {/* Name only */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                    <span style={{ color: '#ff3333' }}>IVY</span>
                    <span style={{ color: '#ffffff' }}> AI</span>
                  </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[
                    { icon: isMuted ? <VolumeX size={14}/> : <Volume2 size={14}/>, onClick: toggleMute, title: isMuted ? 'Unmute' : 'Mute' },
                    { icon: isMaximized ? <Minimize2 size={14}/> : <Maximize2 size={14}/>, onClick: () => { playSynthSound('click', isMuted); setIsMaximized(!isMaximized); }, title: isMaximized ? 'Minimize' : 'Expand' },
                    { icon: <X size={14}/>, onClick: () => { playSynthSound('click', isMuted); setIsOpen(false); }, title: 'Close' },
                  ].map((btn, i) => (
                    <button key={i} onClick={btn.onClick} title={btn.title} style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >{btn.icon}</button>
                  ))}
                </div>
              </div>

              {/* Chat Message Area */}
              <div
                className="scrollbar-thin"
                style={{
                  flex: 1, overflowY: 'auto',
                  padding: '20px 16px',
                  display: 'flex', flexDirection: 'column', gap: '14px',
                  background: 'transparent',
                }}
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: 'flex', alignItems: 'flex-end', gap: '8px',
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      maxWidth: '86%',
                    }}
                  >
                    {/* Avatar */}
                    {msg.role === 'assistant' && (
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '2px',
                      }}>
                        <Bot size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {/* Bubble */}
                      <div
                        className="relative group"
                        style={msg.role === 'user' ? {
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '18px 4px 18px 18px',
                          color: '#ffffff',
                          fontSize: '13.5px', lineHeight: '1.55',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        } : {
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px 18px 18px 18px',
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: '13.5px', lineHeight: '1.55',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      >
                        {parseMessageContent(msg.content)}

                        {/* Feedback toolbar */}
                        {msg.role === 'assistant' && (
                          <div className="absolute right-2 -bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 rounded-full px-1.5 py-0.5 z-20" style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}>
                            <button onClick={() => handleFeedback(msg.id, 'up')} className="cursor-pointer" style={{ padding: '3px', borderRadius: '50%', color: msg.feedback === 'up' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}><ThumbsUp size={10} /></button>
                            <button onClick={() => handleFeedback(msg.id, 'down')} className="cursor-pointer" style={{ padding: '3px', borderRadius: '50%', color: msg.feedback === 'down' ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}><ThumbsDown size={10} /></button>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span style={{
                        fontSize: '10px', color: 'rgba(255,255,255,0.3)',
                        fontFamily: 'var(--font-mono)',
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                        paddingLeft: '4px', paddingRight: '4px',
                      }}>{msg.timestamp}</span>
                    </div>
                  </motion.div>
                ))}

                {/* AI thinking bubble */}
                {loading && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', alignSelf: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={12} style={{ color: 'rgba(255,255,255,0.75)' }} />
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.18)', padding: '12px 16px', borderRadius: '4px 18px 18px 18px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                      {[0, 0.18, 0.36].map((delay, i) => (
                        <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', display: 'inline-block', animation: `bounce 1s ${delay}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              {messages.length === 1 && !loading && (
                <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
                  <div className="scrollbar-none" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                    {quickPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(prompt.query)}
                        style={{
                          padding: '5px 12px', fontSize: '11px', whiteSpace: 'nowrap', flexShrink: 0,
                          color: 'rgba(255,255,255,0.6)',
                          background: 'rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '99px', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      >{prompt.text}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Dock */}
              <div style={{
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '14px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    transition: 'border-color 0.2s',
                  }}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Ask me about Vamshi..."
                      disabled={loading}
                      style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: '#ffffff', fontSize: '13.5px', caretColor: '#ffffff',
                      }}
                    />
                    {isVoiceSupported && (
                      <button onClick={toggleListening} disabled={loading} title="Voice dictation" style={{
                        padding: '4px', borderRadius: '8px', flexShrink: 0,
                        background: 'transparent',
                        color: isListening ? '#ffffff' : 'rgba(255,255,255,0.3)',
                        border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      }}>
                        {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    style={{
                      width: '42px', height: '42px', borderRadius: '13px', flexShrink: 0,
                      background: input.trim() && !loading ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid ' + (input.trim() && !loading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)'),
                      color: input.trim() && !loading ? '#fff' : 'rgba(255,255,255,0.25)',
                      cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 99px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ChatWidget;
