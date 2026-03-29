import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' ||
                e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Generate multiple points with different delays
    const points = [
        { delay: 0, size: 8, color: '#00d2ff', blur: 0 },
        { delay: 0.05, size: 6, color: '#3a7bd5', blur: 2 },
        { delay: 0.1, size: 4, color: '#7f00ff', blur: 4 },
        { delay: 0.15, size: 3, color: '#00d2ff', blur: 6 },
    ];

    return (
        <>
            {points.map((point, index) => (
                <motion.div
                    key={index}
                    className="fixed rounded-full pointer-events-none z-[9999]"
                    animate={{
                        x: mousePosition.x - point.size / 2,
                        y: mousePosition.y - point.size / 2,
                        scale: isHovering ? 1.5 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 150 - index * 30,
                        damping: 15 + index * 5,
                        mass: 0.5 + index * 0.2,
                    }}
                    style={{
                        width: point.size,
                        height: point.size,
                        backgroundColor: point.color,
                        filter: `blur(${point.blur}px)`,
                        opacity: 0.8 - index * 0.15,
                    }}
                />
            ))}
        </>
    );
};

export default CustomCursor;
