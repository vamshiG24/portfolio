import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { FaGraduationCap, FaCode, FaBrain, FaRocket } from "react-icons/fa";

const timelineData = [
  {
    year: "2023",
    title: "Foundations & Frontend",
    description: "Started with C, then moved to HTML, CSS, and JavaScript. Built static websites and understood core programming concepts.",
    icon: <FaGraduationCap />,
    color: "from-blue-400 to-cyan-500",
    achievements: ["Mastered C fundamentals", "Built 10+ static websites", "Learned responsive design"]
  },
  {
    year: "2024",
    title: "Full Stack & Smart Development",
    description: "Gained expertise in the MERN stack and developed full-stack web applications with interactive UI and smooth animations.",
    icon: <FaCode />,
    color: "from-purple-400 to-pink-500",
    achievements: ["MERN stack mastery", "5+ full-stack projects", "RESTful API design"]
  },
  {
    year: "2025",
    title: "AI & Machine Learning",
    description: "Started exploring AI and ML, learning core concepts, Python libraries, and building small projects to understand practical applications.",
    icon: <FaBrain />,
    color: "from-orange-400 to-red-500",
    achievements: ["TensorFlow & PyTorch", "3 ML projects deployed", "Deep learning fundamentals"]
  },
  {
    year: "Future",
    title: "Innovation & Beyond",
    description: "Aiming to build cutting-edge AI-powered applications and contribute to open-source projects that make a real-world impact.",
    icon: <FaRocket />,
    color: "from-green-400 to-emerald-500",
    achievements: ["Open-source contributions", "AI product development", "Tech leadership"]
  },
];

const TimelineCard = ({ item, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`flex items-center gap-8 mb-20 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content Card */}
      <div className="flex-1">
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="glass-card p-8 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 preserve-3d relative overflow-hidden group"
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

          {/* Year badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
            className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${item.color} text-white font-bold text-sm mb-4 shadow-lg`}
          >
            {item.year}
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
            <span className={`text-3xl bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
              {item.icon}
            </span>
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 mb-4 leading-relaxed">{item.description}</p>

          {/* Achievements */}
          <div className="space-y-2">
            {item.achievements.map((achievement, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.2 + 0.4 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`}></div>
                {achievement}
              </motion.div>
            ))}
          </div>

          {/* Glow effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}></div>
        </motion.div>
      </div>

      {/* Center Timeline Dot */}
      <div className="relative flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.2 + 0.2, type: "spring" }}
          className={`w-6 h-6 rounded-full bg-gradient-to-r ${item.color} shadow-lg relative z-10`}
          style={{
            boxShadow: `0 0 20px rgba(0,210,255,0.6)`,
          }}
        >
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${item.color} animate-ping opacity-75`}></div>
        </motion.div>
      </div>

      {/* Empty space for alternating layout */}
      <div className="flex-1"></div>
    </motion.div>
  );
};

const Timeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-20 px-4 min-h-screen relative" id="timeline">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              📜 My Journey
            </span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From foundations to innovation - a timeline of growth and learning
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(0,210,255,0.5)]"
            ></motion.div>
          </div>

          {/* Timeline Items */}
          <div className="relative">
            {timelineData.map((item, index) => (
              <TimelineCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;