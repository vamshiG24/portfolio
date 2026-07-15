import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, useInView } from 'framer-motion';

const StatsCounter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    // Animate from 0 to the target value when the component comes into view
    const controls = animate(count, value, { 
      duration: 1.8, 
      ease: [0.16, 1, 0.3, 1] // premium easeOut
    });
    return () => controls.stop();
  }, [value, count, isInView]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [rounded]);

  return <span ref={ref} style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>0</span>;
};

export default StatsCounter;
