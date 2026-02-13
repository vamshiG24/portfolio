import { useEffect, useRef } from 'react';

const ModernBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create subtle floating dots
        const dots = [];
        const dotCount = 40;

        for (let i = 0; i < dotCount; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            dots.forEach(dot => {
                dot.y += dot.speedY;

                // Wrap around
                if (dot.y > canvas.height) dot.y = 0;
                if (dot.y < 0) dot.y = canvas.height;

                ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
            {/* Animated dots canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

            {/* Subtle gradient orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/[0.015] blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/[0.015] blur-[120px]" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-80" />
        </div>
    );
};

export default ModernBackground;
