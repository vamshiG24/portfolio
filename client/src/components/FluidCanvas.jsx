import { useEffect, useRef } from 'react';

const FluidCanvas = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Simulation settings
    const CELL_SIZE = 36; // Grid cell size in pixels
    const PARTICLE_COUNT = 150; // Decreased for cleaner aesthetics
    const VISCOSITY = 0.96; // Velocity decay factor per frame
    const INJECTION_RADIUS = 3.5; // Grid cells radius for mouse injection
    const MOUSE_FORCE = 1.2; // Force factor for mouse movements
    const CLICK_FORCE = 10.0; // Force factor for mouse clicks
    const CLICK_RADIUS = 7; // Grid cells radius for clicks

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let numCells = 0;
    let currentActiveCount = PARTICLE_COUNT;

    // Grid buffers
    let u = new Float32Array(0); // horizontal velocity
    let v = new Float32Array(0); // vertical velocity
    let uPrev = new Float32Array(0);
    let vPrev = new Float32Array(0);

    // Particle representation
    class Particle {
      constructor(w, h, init = false) {
        this.reset(w, h, init);
      }

      reset(w, h, init = false) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.px = this.x;
        this.py = this.y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 0.7 + 0.3;
        this.life = init ? Math.random() * 200 : 0;
        this.maxLife = 140 + Math.random() * 180;

        // Custom palette matching the blue/cyan cinematic theme:
        const colors = [
          'rgba(164, 244, 253, ', // Neon Cyan
          'rgba(61, 129, 227, ',  // Royal Blue
          'rgba(0, 210, 255, ',   // Electric Blue
          'rgba(11, 37, 81, ',    // Deep Blue Accent
          'rgba(147, 51, 234, '   // Purple accent
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update(w, h) {
        const gx = Math.floor(this.x / CELL_SIZE);
        const gy = Math.floor(this.y / CELL_SIZE);

        let fluidVx = 0;
        let fluidVy = 0;

        // Bilinear sampling of fluid grid velocity
        if (gx >= 1 && gx < cols - 1 && gy >= 1 && gy < rows - 1) {
          // grid indices
          const i00 = gy * cols + gx;
          const i10 = i00 + 1;
          const i01 = (gy + 1) * cols + gx;
          const i11 = i01 + 1;

          // weights
          const tx = (this.x % CELL_SIZE) / CELL_SIZE;
          const ty = (this.y % CELL_SIZE) / CELL_SIZE;

          // lerp
          fluidVx = (u[i00] * (1 - tx) + u[i10] * tx) * (1 - ty) + (u[i01] * (1 - tx) + u[i11] * tx) * ty;
          fluidVy = (v[i00] * (1 - tx) + v[i10] * tx) * (1 - ty) + (v[i01] * (1 - tx) + v[i11] * tx) * ty;
        }

        // Apply fluid force with spring-like physics + tiny brownian noise
        this.vx += (fluidVx - this.vx) * 0.12 + (Math.random() - 0.5) * 0.08;
        this.vy += (fluidVy - this.vy) * 0.12 + (Math.random() - 0.5) * 0.08;

        // Friction/resistance on particle itself
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Save previous coordinates for high-fidelity streamline tracing
        this.px = this.x;
        this.py = this.y;

        // Update positions
        this.x += this.vx;
        this.y += this.vy;

        this.life++;

        // Reset particle if dead, out of bounds, or stagnant
        const isStagnant = Math.abs(this.vx) < 0.01 && Math.abs(this.vy) < 0.01;
        if (
          this.life > this.maxLife ||
          this.x < 0 ||
          this.x > w ||
          this.y < 0 ||
          this.y > h ||
          (isStagnant && Math.random() < 0.015)
        ) {
          this.reset(w, h);
        }
      }

      draw(c) {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        // Base opacity goes up with speed, fades out as particle approaches max life
        const speedFactor = Math.min(1.0, speed * 0.15);
        const lifeFactor = 1.0 - this.life / this.maxLife;
        const alpha = Math.min(0.65, (0.12 + speedFactor * 0.53) * lifeFactor);

        c.strokeStyle = `${this.colorPrefix}${alpha})`;
        c.lineWidth = this.size * (1 + speed * 0.02);
        c.lineCap = 'round';

        c.beginPath();
        c.moveTo(this.px, this.py);
        c.lineTo(this.x, this.y);
        c.stroke();
      }
    }

    let particles = [];

    // Setup dimensions and re-initialize arrays
    const resize = () => {
      const container = containerRef.current;
      if (!container) return;

      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / CELL_SIZE) + 2;
      rows = Math.ceil(height / CELL_SIZE) + 2;
      numCells = cols * rows;

      u = new Float32Array(numCells);
      v = new Float32Array(numCells);
      uPrev = new Float32Array(numCells);
      vPrev = new Float32Array(numCells);

      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(width, height, true));
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Pointer Tracking
    let mouse = { x: 0, y: 0, px: 0, py: 0, isDown: false, active: false };

    const injectForce = (clientX, clientY, isMove = true, isClick = false) => {
      const x = clientX;
      const y = clientY;

      if (!mouse.active) {
        mouse.x = x;
        mouse.y = y;
        mouse.px = x;
        mouse.py = y;
        mouse.active = true;
        return;
      }

      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = x;
      mouse.y = y;

      const mx = mouse.x;
      const my = mouse.y;
      const mpx = mouse.px;
      const mpy = mouse.py;

      const dx = mx - mpx;
      const dy = my - mpy;

      if (isMove && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;

      const gridX = mx / CELL_SIZE;
      const gridY = my / CELL_SIZE;

      const radius = isClick ? CLICK_RADIUS : INJECTION_RADIUS;
      const forceMult = isClick ? CLICK_FORCE : MOUSE_FORCE;

      const startX = Math.max(1, Math.floor(gridX - radius));
      const endX = Math.min(cols - 2, Math.ceil(gridX + radius));
      const startY = Math.max(1, Math.floor(gridY - radius));
      const endY = Math.min(rows - 2, Math.ceil(gridY + radius));

      for (let gy = startY; gy <= endY; gy++) {
        for (let gx = startX; gx <= endX; gx++) {
          const cellIdx = gy * cols + gx;
          const distSq = (gx - gridX) ** 2 + (gy - gridY) ** 2;

          if (distSq < radius * radius) {
            const weight = 1.0 - Math.sqrt(distSq) / radius;

            if (isClick) {
              // Click creates a radial outward burst
              const angle = Math.atan2(gy - gridY, gx - gridX);
              const angleForce = Math.cos(angle);
              const sinForce = Math.sin(angle);
              u[cellIdx] += angleForce * weight * forceMult;
              v[cellIdx] += sinForce * weight * forceMult;
            } else {
              // Drag or movement injects directional inertia
              u[cellIdx] += dx * weight * forceMult * 0.15;
              v[cellIdx] += dy * weight * forceMult * 0.15;
            }
          }
        }
      }
    };

    // Attach listeners to the global window object
    const handleMouseMove = (e) => {
      injectForce(e.clientX, e.clientY, true, false);
    };

    const handleMouseDown = (e) => {
      mouse.isDown = true;
      injectForce(e.clientX, e.clientY, false, true);
    };

    const handleMouseUp = () => {
      mouse.isDown = false;
    };

    const handleMouseEnter = () => {
      mouse.active = false;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.isDown = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        mouse.active = false;
        mouse.isDown = true;
        injectForce(e.touches[0].clientX, e.touches[0].clientY, false, true);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        injectForce(e.touches[0].clientX, e.touches[0].clientY, true, false);
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.isDown = false;
    };

    // window.addEventListener('mousemove', handleMouseMove);
    // window.addEventListener('mousedown', handleMouseDown);
    // window.addEventListener('mouseup', handleMouseUp);
    // window.addEventListener('blur', handleMouseLeave);
    // window.addEventListener('mouseenter', handleMouseEnter);
    // window.addEventListener('mouseleave', handleMouseLeave);
    // window.addEventListener('touchstart', handleTouchStart, { passive: true });
    // window.addEventListener('touchmove', handleTouchMove, { passive: true });
    // window.addEventListener('touchend', handleTouchEnd);

    // Animation Loop
    let animationFrameId = null;

    const updateFluidGrid = () => {
      // 1. Decay velocity (viscous drag of the fluid medium)
      for (let i = 0; i < numCells; i++) {
        u[i] *= VISCOSITY;
        v[i] *= VISCOSITY;
      }

      // 2. Smooth / Diffuse the grid to create fluid dispersion
      uPrev.set(u);
      vPrev.set(v);

      // Perform a Jacobi-style relaxation pass to diffuse velocities
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const idx = y * cols + x;
          u[idx] = uPrev[idx] * 0.75 + (uPrev[idx - 1] + uPrev[idx + 1] + uPrev[idx - cols] + uPrev[idx + cols]) * 0.0625;
          v[idx] = vPrev[idx] * 0.75 + (vPrev[idx - 1] + vPrev[idx + 1] + vPrev[idx - cols] + vPrev[idx + cols]) * 0.0625;
        }
      }

      // 3. Boundary conditions: Keep flows inside or absorb at walls
      for (let x = 0; x < cols; x++) {
        u[x] = u[x + cols] * 0.8;
        v[x] = -Math.abs(v[x + cols]) * 0.5;
        const idxBot = (rows - 1) * cols + x;
        u[idxBot] = u[idxBot - cols] * 0.8;
        v[idxBot] = Math.abs(v[idxBot - cols]) * 0.5;
      }
      for (let y = 0; y < rows; y++) {
        const idxL = y * cols;
        u[idxL] = -Math.abs(u[idxL + 1]) * 0.5;
        v[idxL] = v[idxL + 1] * 0.8;
        const idxR = y * cols + (cols - 1);
        u[idxR] = Math.abs(u[idxR - 1]) * 0.5;
        v[idxR] = v[idxR - 1] * 0.8;
      }
    };

    const animate = () => {
      // Clear canvas with partial opacity to create trail sweep
      ctx.fillStyle = 'rgba(12, 12, 12, 0.085)';
      ctx.fillRect(0, 0, width, height);

      // Solve grid velocities
      updateFluidGrid();

      // Dynamic active particle count based on scroll position (Home vs other sections)
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const isHome = scrollY < window.innerHeight * 0.8;
      const targetCount = isHome ? PARTICLE_COUNT : 700;
      
      currentActiveCount += (targetCount - currentActiveCount) * 0.08;
      const countToDraw = Math.round(currentActiveCount);

      // Update and draw particles
      for (let i = 0; i < countToDraw; i++) {
        const p = particles[i];
        if (p) {
          p.update(width, height);
          p.draw(ctx);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      // window.removeEventListener('mousemove', handleMouseMove);
      // window.removeEventListener('mousedown', handleMouseDown);
      // window.removeEventListener('mouseup', handleMouseUp);
      // window.removeEventListener('blur', handleMouseLeave);
      // window.removeEventListener('mouseenter', handleMouseEnter);
      // window.removeEventListener('mouseleave', handleMouseLeave);
      // window.removeEventListener('touchstart', handleTouchStart);
      // window.removeEventListener('touchmove', handleTouchMove);
      // window.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // below content
        pointerEvents: 'none', // let clicks pass through
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          opacity: 0.85,
        }}
      />
    </div>
  );
};

export default FluidCanvas;
