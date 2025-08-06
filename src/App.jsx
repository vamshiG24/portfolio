import React from 'react';
import Home from './components/Home';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Buildlogs from './components/Buildlogs';
import MindSetSection from './components/MindSetSection';
import Contact from './components/Contact';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="text-amber-600 bg-black scroll-smooth">
      <Navbar />

      {/* Adds spacing below fixed navbar */}
      <div className="pt-16">
        <section id="home" className="min-h-screen scroll-section">
          <Home />
        </section>

        <section id="timeline" className="min-h-screen scroll-section">
          <Timeline />
        </section>

        <section id="projects" className="min-h-screen scroll-section">
          <Projects />
        </section>

        <section id="buildlogs" className="min-h-screen scroll-section">
          <Buildlogs />
        </section>

        <section id="mindset" className="min-h-screen scroll-section">
          <MindSetSection />
        </section>

        <section id="contact" className="min-h-screen scroll-section">
          <Contact />
        </section>
      </div>
    </div>
  );
};

export default App;