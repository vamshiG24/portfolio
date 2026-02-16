import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const projects = [
  {
    title: "Secure Digital Evidence Management System",
    description: "Enterprise-grade evidence management platform with cryptographic hashing for data integrity, role-based access control (RBAC) for secure multi-user workflows, and comprehensive audit logging for compliance and chain-of-custody tracking.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "JWT", "Bcrypt"],
    github: "https://github.com/vamshiG24/secure-digital-evidence",
    demo: "https://secure-digital-evidence.vercel.app",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "BiteBot",
    description: "AI-powered food ordering platform featuring an intelligent chatbot for personalized recommendations, real-time order tracking, and seamless restaurant management. Integrates Gemini API for natural language processing and context-aware customer interactions.",
    tech: ["MongoDB", "Express.js", "React", "Node.js", "Gemini API", "Socket.io"],
    github: "https://github.com/vamshiG24/BITEBOT",
    demo: "https://github.com/vamshiG24/BITEBOT",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Speaker Identification System",
    description: "Deep learning-based voice authentication system utilizing mel-frequency cepstral coefficients (MFCCs) and neural networks for real-time speaker verification. Achieves high accuracy in multi-speaker environments for security applications.",
    tech: ["Python", "TensorFlow", "Librosa", "NumPy", "scikit-learn"],
    github: "https://github.com/vamshiG24/speaker-recognition",
    demo: "#",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "EEG Seizure Detection Web App",
    description: "Medical AI application leveraging convolutional neural networks (CNN) to analyze EEG signals and predict epileptic seizures with high precision. Features a Flask-based REST API for real-time inference and clinical decision support.",
    tech: ["Flask", "TensorFlow", "Keras", "Pandas", "Matplotlib", "React"],
    github: "https://github.com/vamshiG24/Seizure-Detection-project-main",
    demo: "#",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    color: "from-emerald-500 to-teal-500"
  },
];

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
        delayChildren: 0.3 + index * 0.2
      }
    }
  };

  // Content animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group project-card relative rounded-2xl overflow-hidden glass-card h-[480px] flex flex-col cursor-pointer"
    >
      {/* Animated gradient border on hover */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 z-0`}
      />

      {/* Image with parallax effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/40"
          animate={{
            opacity: isHovered ? 0.95 : 1,
          }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end p-6">
        {/* Animated accent line */}
        <motion.div
          variants={itemVariants}
          className={`h-1 rounded-full mb-4 bg-gradient-to-r ${project.color}`}
          animate={{
            width: isHovered ? 80 : 48,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Title with stagger animation */}
        <motion.h3
          variants={itemVariants}
          className="text-2xl font-bold text-white mb-3 leading-tight"
        >
          {project.title}
        </motion.h3>

        {/* Description with fade-in */}
        <motion.p
          variants={itemVariants}
          className="text-gray-300 text-sm mb-4 leading-relaxed"
          animate={{
            height: isHovered ? "auto" : "3rem",
          }}
          style={{ overflow: "hidden" }}
        >
          {project.description}
        </motion.p>

        {/* Tech stack with stagger */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-2 mb-5"
        >
          {project.tech.map((tech, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + index * 0.2 + idx * 0.05,
              }}
              whileHover={{
                scale: 1.1,
                y: -3,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-white/10 text-gray-200 border border-white/20 backdrop-blur-sm"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Action buttons with smooth reveal */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4"
          animate={{
            opacity: isHovered ? 1 : 0.7,
            y: isHovered ? 0 : 5,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.08, x: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <FaGithub size={20} />
            <span className="text-sm font-semibold">Code</span>
          </motion.a>
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.08, x: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <FaExternalLinkAlt size={18} />
            <span className="text-sm font-semibold">Live Demo</span>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section className="py-20 px-4 min-h-screen relative" id="projects">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Featured Projects
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A selection of my recent work in Web Development and AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;