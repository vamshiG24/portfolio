import { motion } from 'framer-motion';
import { FaReact, FaNode, FaPython, FaDatabase } from 'react-icons/fa';
import { SiMongodb, SiTailwindcss, SiExpress, SiTensorflow, SiJavascript, SiGit, SiDocker, SiPostgresql } from 'react-icons/si';

const skills = [
    { name: 'React', icon: <FaReact />, color: '#61dafb' },
    { name: 'Node.js', icon: <FaNode />, color: '#68a063' },
    { name: 'MongoDB', icon: <SiMongodb />, color: '#47a248' },
    { name: 'Express', icon: <SiExpress />, color: '#ffffff' },
    { name: 'Python', icon: <FaPython />, color: '#3776ab' },
    { name: 'TensorFlow', icon: <SiTensorflow />, color: '#ff6f00' },
    { name: 'Tailwind', icon: <SiTailwindcss />, color: '#06b6d4' },
    { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#4169e1' },
    { name: 'JavaScript', icon: <SiJavascript />, color: '#f7df1e' },
    { name: 'Git', icon: <SiGit />, color: '#f05032' },
    { name: 'Docker', icon: <SiDocker />, color: '#2496ed' },
    { name: 'SQL', icon: <FaDatabase />, color: '#cc2927' },
];

const SkillCard = ({ skill, index }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{
                opacity: 0,
                x: isEven ? -100 : 100,
                rotateZ: isEven ? -15 : 15
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                rotateZ: 0
            }}
            transition={{
                duration: 0.7,
                delay: index * 0.08,
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
            viewport={{ once: true }}
            whileHover={{
                y: -15,
                rotateZ: isEven ? 5 : -5,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                }
            }}
            className="group relative"
        >
            {/* Outer glow ring */}
            <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"
                style={{
                    background: `linear-gradient(135deg, ${skill.color}40, ${skill.color}10)`
                }}
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-md overflow-hidden">
                {/* Animated particles */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(circle at 30% 50%, ${skill.color}20 0%, transparent 50%)`
                    }}
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                    }}
                />

                {/* Diagonal shine effect */}
                <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                        background: `linear-gradient(45deg, transparent 30%, ${skill.color}30 50%, transparent 70%)`
                    }}
                    animate={{
                        x: ['-200%', '200%']
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                    }}
                />

                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    {/* Icon with orbit animation */}
                    <motion.div
                        className="relative"
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <motion.div
                            className="text-5xl"
                            style={{ color: skill.color }}
                            animate={{
                                rotate: -360,
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                rotate: {
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                },
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: index * 0.1
                                }
                            }}
                            whileHover={{
                                scale: 1.2,
                                filter: "drop-shadow(0 0 20px currentColor)",
                                transition: { duration: 0.3 }
                            }}
                        >
                            {skill.icon}
                        </motion.div>

                        {/* Orbiting dots */}
                        {[0, 120, 240].map((angle, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full opacity-60"
                                style={{
                                    backgroundColor: skill.color,
                                    top: '50%',
                                    left: '50%',
                                }}
                                animate={{
                                    x: [
                                        Math.cos((angle * Math.PI) / 180) * 35,
                                        Math.cos(((angle + 360) * Math.PI) / 180) * 35
                                    ],
                                    y: [
                                        Math.sin((angle * Math.PI) / 180) * 35,
                                        Math.sin(((angle + 360) * Math.PI) / 180) * 35
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: i * 0.3
                                }}
                            />
                        ))}
                    </motion.div>

                    <motion.h3
                        className="text-base font-semibold text-white"
                        whileHover={{
                            scale: 1.1,
                            color: skill.color,
                            transition: { duration: 0.2 }
                        }}
                    >
                        {skill.name}
                    </motion.h3>
                </div>
            </div>
        </motion.div>
    );
};

const SkillsShowcase = () => {
    return (
        <section className="py-24 px-4 min-h-screen flex items-center" id="skills">
            <div className="max-w-6xl mx-auto w-full">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            backgroundImage: 'linear-gradient(90deg, #fff, #06b6d4, #fff)',
                            backgroundSize: '200% 100%',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        Skills & Technologies
                    </motion.h2>
                    <p className="text-gray-400 text-lg">
                        Tools and technologies I work with
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {skills.map((skill, index) => (
                        <SkillCard key={skill.name} skill={skill} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillsShowcase;
