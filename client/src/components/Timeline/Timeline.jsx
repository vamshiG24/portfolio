import { useState, useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';
import TimelineSidebar from './TimelineSidebar';
import TimelinePath from './TimelinePath';
import TimelineBead from './TimelineBead';
import TimelineCard from './TimelineCard';
import TimelineParticles from './TimelineParticles';
import JourneyThemeStyles from './JourneyTheme';
import { timelineData } from './timelineData';

const Timeline = () => {
  const containerRef = useRef(null);
  const [activeYear, setActiveYear] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Detect which timeline section is in focus
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(index)) {
            setActiveYear(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.timeline-card-wrapper');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scrollToCard = (index) => {
    const element = document.getElementById(`timeline-card-${index}`);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveYear(index);
    }
  };

  return (
    <section
      id="timeline"
      ref={containerRef}
      style={{
        width: '100%',
        padding: '120px 0',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 1. Global CSS Injector */}
      <JourneyThemeStyles />

      {/* 2. Interactive Canvas Particles Background */}
      {/* <TimelineParticles activeYear={activeYear} /> */}

      {/* 3. Main Section Layout Grid */}
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          gap: '40px', 
          position: 'relative', 
          zIndex: 2,
          padding: '0 24px'
        }}
      >
        
        {/* Sticky sidebar year links */}
        <TimelineSidebar 
          timelineData={timelineData} 
          activeYear={activeYear} 
          scrollToCard={scrollToCard} 
        />

        {/* Main timeline streams */}
        <div style={{ flex: 1 }}>
          
          {/* Header titles */}
          <div style={{ textAlign: 'left', marginBottom: '80px' }}>
            <h2 
              style={{ 
                fontSize: '3rem', 
                marginBottom: '16px', 
                color: 'var(--text-primary)', 
                fontFamily: 'var(--font-display)', 
                fontWeight: 800 
              }}
            >
              My Technical <span style={{ color: 'var(--yellow-dark)' }}>Journey</span>
            </h2>
            <p 
              style={{ 
                color: 'var(--text-muted)', 
                fontSize: '1.1rem', 
                maxWidth: '650px', 
                lineHeight: 1.6,
                margin: 0
              }}
            >
              Explore my timeline tracking core software development, deep learning research, and vector AI biometrics.
            </p>
          </div>

          {/* Timeline center track wrapper */}
          <div style={{ position: 'relative', marginTop: '20px' }}>
            
            {/* SVG energy track */}
            <TimelinePath scrollYProgress={scrollYProgress} />

            {/* Glowing orbital bead */}
            <TimelineBead 
              scrollYProgress={scrollYProgress} 
              activeYear={activeYear} 
              timelineData={timelineData} 
            />

            {/* Cards stream */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', position: 'relative' }}>
              {timelineData.map((item, index) => (
                <TimelineCard key={index} item={item} index={index} />
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Timeline;
