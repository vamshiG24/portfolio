import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SkillsShowcase from './components/SkillsShowcase';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import BuildLogs from './components/Buildlogs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import { VolumeX } from 'lucide-react';

let activeSpeechUtterance = null;

const App = () => {
  const [voiceActive, setVoiceActive] = useState(false);
  const [lowSpecMode, setLowSpecMode] = useState(() => {
    return localStorage.getItem('lowSpecMode') === 'true';
  });
  const hasSpokenRef = useRef(false);

  const toggleLowSpecMode = useCallback(() => {
    setLowSpecMode(prev => {
      const next = !prev;
      localStorage.setItem('lowSpecMode', String(next));
      return next;
    });
  }, []);

  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      activeSpeechUtterance = null;
      setVoiceActive(false);
    }
  }, []);

  const triggerSpeech = useCallback(() => {
    if (hasSpokenRef.current) return;
    if ('speechSynthesis' in window) {
      hasSpokenRef.current = true;
      window.speechSynthesis.cancel();

      const introText = "Hello! I am IVY, Vamshi Gowni's personal AI assistant. Welcome to his portfolio! I can guide you through his work and skills. Feel free to scroll down to view his timeline, projects, and contact form, or chat with me directly using the assistant drawer in the bottom right corner!";

      const utterance = new SpeechSynthesisUtterance(introText);
      activeSpeechUtterance = utterance; // prevent garbage collection by referencing globally

      // Find a female voice
      const voices = window.speechSynthesis.getVoices();
      let femaleVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        return v.lang.startsWith('en') &&
          (name.includes('female') || name.includes('zira') || name.includes('hazel') || name.includes('samantha') || name.includes('victoria') || name.includes('karen') || name.includes('moira') || name.includes('google uk english female') || name.includes('google us english') || name.includes('ivy'));
      });

      // Fallback: search for any english voice that isn't known to be male
      if (!femaleVoice) {
        femaleVoice = voices.find(v => {
          const name = v.name.toLowerCase();
          return v.lang.startsWith('en') &&
            !name.includes('male') && !name.includes('david') && !name.includes('mark') && !name.includes('george') && !name.includes('daniel');
        });
      }

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onstart = () => setVoiceActive(true);
      utterance.onend = () => {
        setVoiceActive(false);
        activeSpeechUtterance = null;
      };
      utterance.onerror = () => {
        setVoiceActive(false);
        activeSpeechUtterance = null;
      };

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const toggleSpeech = useCallback(() => {
    if (voiceActive) {
      stopSpeech();
    } else {
      triggerSpeech();
    }
  }, [voiceActive, stopSpeech, triggerSpeech]);

  useEffect(() => {
    // Reset scroll to top on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    if (window.location.hash && window.location.hash !== '#home') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.getVoices().length > 0) {
        triggerSpeech();
      } else {
        window.speechSynthesis.onvoiceschanged = triggerSpeech;
      }
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        activeSpeechUtterance = null;
      }
    };
  }, [triggerSpeech]);

  return (
    <div className="app-root" style={{ width: '100%', minHeight: '100vh', backgroundColor: 'transparent' }}>
      <div className="portfolio-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        {/* Floating Speaking Wave */}
        {voiceActive && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="voice-indicator voice-indicator-active"
            onClick={stopSpeech}
            style={{
              position: 'fixed',
              top: '92px',
              right: '5%',
              zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(204, 0, 0, 0.35)',
              borderRadius: '24px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="voice-waves" style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', width: '32px', height: '18px' }}>
              <span className="wave-bar bar-1"></span>
              <span className="wave-bar bar-2"></span>
              <span className="wave-bar bar-3"></span>
              <span className="wave-bar bar-4"></span>
              <span className="wave-bar bar-5"></span>
              <span className="wave-bar bar-6"></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="voice-recording-dot"></span>
              <span style={{ fontWeight: 600 }}>IVY Speaking...</span>
            </div>
            <VolumeX size={14} style={{ color: 'var(--yellow-dark)' }} />
          </motion.div>
        )}

        {/* Main sections */}
        <main style={{ flex: '1 0 auto' }}>
          <div id="home">
            <Home voiceActive={voiceActive} toggleSpeech={toggleSpeech} lowSpecMode={lowSpecMode} />
          </div>
          <div>
            <Timeline lowSpecMode={lowSpecMode} />
          </div>
          <div id="skills">
            <SkillsShowcase />
          </div>
          <div>
            <Projects lowSpecMode={lowSpecMode} />
          </div>
          <div id="buildlogs">
            <BuildLogs lowSpecMode={lowSpecMode} />
          </div>
          <div id="contact">
            <Contact />
          </div>
        </main>

        <ChatWidget lowSpecMode={lowSpecMode} />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default App;