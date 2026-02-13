import React, { useEffect, useState } from 'react';
import Home from './components/Home';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Buildlogs from './components/Buildlogs';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import PortfolioIntro from "./components/PortfolioIntro";
import ModernBackground from "./components/ModernBackground";
import CustomCursor from "./components/CustomCursor";
import SkillsShowcase from "./components/SkillsShowcase";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden selection:bg-cyan-500 selection:text-white">

      {/* Modern Background */}
      <ModernBackground />

      {/* Custom Cursor */}
      <CustomCursor />

      {showIntro && <PortfolioIntro />}

      <Navbar />

      <main className="relative pt-20 px-4 md:px-8 max-w-7xl mx-auto space-y-24 pb-24">
        <section id="home" className="min-h-screen scroll-section flex items-center justify-center">
          <Home />
        </section>

        <section id="timeline" className="scroll-section">
          <Timeline />
        </section>

        <section id="skills" className="scroll-section">
          <SkillsShowcase />
        </section>

        <section id="projects" className="scroll-section">
          <Projects />
        </section>

        <section id="buildlogs" className="scroll-section">
          <Buildlogs />
        </section>

        <section id="contact" className="scroll-section">
          <Contact />
        </section>
      </main>
    </div>
  );
};

export default App;