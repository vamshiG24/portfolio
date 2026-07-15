import { useEffect, useRef } from 'react';

const TimelineParticles = ({ activeYear }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const activeYearRef = useRef(activeYear);

  useEffect(() => {
    activeYearRef.current = activeYear;
  }, [activeYear]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.clientHeight || window.innerHeight);

    // Reduced motion media query
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Track mouse movement for parallax shifts
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;
      mouseRef.current.targetX = (relativeX - width / 2) * 0.05; // parallax scale
      mouseRef.current.targetY = (relativeY - height / 2) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      width = canvas.width = canvas.clientWidth || window.innerWidth;
      height = canvas.height = canvas.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Core Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // distribute initial particles
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 3 + 1;
        const heightScale = Math.max(1, height / 900);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = -(Math.random() * 0.8 + 0.4) * (heightScale * 0.8);
        this.life = 0;
        this.maxLife = (200 + Math.random() * 200) * heightScale;
        this.alpha = 0;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;

        // Visual theme based on current year index
        // 0: Orange, 1: Blue, 2: Green, 3: Purple
        const curYear = activeYearRef.current;
        if (curYear === 0) {
          this.color = `rgba(${249 + Math.floor(Math.random() * 6)}, ${115 + Math.floor(Math.random() * 40)}, 22, `; // Warm orange/amber
          this.char = ['{', '}', 'C++', 'f()', 'dsa'][Math.floor(Math.random() * 5)];
        } else if (curYear === 1) {
          this.color = `rgba(14, ${165 + Math.floor(Math.random() * 40)}, 233, `; // Sky blue
          this.char = ['react', 'node', 'api', 'db', '</div>'][Math.floor(Math.random() * 5)];
        } else if (curYear === 2) {
          this.color = `rgba(16, ${185 + Math.floor(Math.random() * 40)}, 129, `; // Green emerald
          this.char = ['w', 'b', '1', '0', 'cnn', 'ai'][Math.floor(Math.random() * 6)];
        } else {
          this.color = `rgba(${139 + Math.floor(Math.random() * 40)}, 92, 246, `; // Violet/Purple
          this.char = ['★', '✦', 'llm', 'system', 'agent'][Math.floor(Math.random() * 5)];
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.life++;

        // Fade in and fade out logic
        if (this.life < 40) {
          this.alpha = this.life / 40;
        } else if (this.life > this.maxLife - 40) {
          this.alpha = (this.maxLife - this.life) / 40;
        } else {
          this.alpha = 1;
        }

        if (this.life >= this.maxLife || this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw(mode) {
        ctx.fillStyle = this.color + this.alpha * 0.15 + ')';
        ctx.font = `${this.size * 3.5 + 8}px monospace`;

        if (mode === 0) {
          // 2023 - Learning: Floating bubbles
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (mode === 1) {
          // 2024 - Building: Floating text code tokens
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.fillText(this.char, 0, 0);
          ctx.restore();
        } else if (mode === 2) {
          // 2025 - Research: Floating nodes
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Future - Vision: Starfield stars
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.fillText('✦', 0, 0);
          ctx.restore();
        }
      }
    }

    // Initialize particles array
    const maxParticles = prefersReducedMotion ? 15 : 60;
    const particles = Array.from({ length: maxParticles }, () => new Particle());

    // Generate dynamic grid nodes for 2025 Node graph rendering
    const maxNodes = 15;
    const nodes = Array.from({ length: maxNodes }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1
    }));

    // Animation loop
    const animate = () => {
      // Smooth mouse coordinates (inertia)
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const mode = activeYearRef.current;

      // Clear canvas (letting global FluidCanvas remain fully visible)
      ctx.clearRect(0, 0, width, height);

      // Render mode-specific graphics
      if (!prefersReducedMotion) {
        if (mode === 1) {
          // No grid lines, keeping it extremely clean. Just points!
        } else if (mode === 2) {
          // 2025 - Draw network graphs (connecting nodes)
          ctx.save();
          ctx.translate(mouse.x * 0.3, mouse.y * 0.3);
          nodes.forEach((n, i) => {
            n.x += n.vx;
            n.y += n.vy;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fill();

            // Connect neighboring nodes
            for (let j = i + 1; j < nodes.length; j++) {
              const other = nodes[j];
              const dx = n.x - other.x;
              const dy = n.y - other.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 180) {
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.05 * (1 - dist / 180)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            }
          });
          ctx.restore();
        }
      }

      // Draw and update active particles
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.update();
        }
        p.draw(mode);
      });

      // Draw Noise texture overlay for a vintage film/premium look
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      for (let i = 0; i < 20; i++) {
        const size = Math.random() * 2 + 1;
        ctx.fillRect(Math.random() * width, Math.random() * height, size, size);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default TimelineParticles;
