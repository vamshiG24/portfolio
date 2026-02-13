import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const projects = [
  {
    title: "SmartLife AI",
    description: "Automatically filters blurry and waste photos using AI. Upload a folder and it gives you clean images.",
    tech: ["React", "Python", "OpenCV", "Flask"],
    github: "https://github.com/vamshiG24/smartlife-photocleaner",
    demo: "https://smartlife-photocleaner.vercel.app",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    color: "from-purple-500 to-indigo-500"
  },
  {
    title: "Resume Builder",
    description: "Build modern CVs from templates dynamically using user input. Download ready-made resumes.",
    tech: ["React", "Node.js", "MongoDB", "Tailwind"],
    github: "https://github.com/vamshiG24/resume-builder",
    demo: "https://vamshi-resumebuilder.netlify.app",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    color: "from-emerald-500 to-teal-500"
  },
];

const ProjectCard = ({ project, index }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        type: "spring",
        stiffness: 80
      }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="group project-card relative rounded-2xl overflow-hidden glass-card h-[450px] flex flex-col preserve-3d cursor-pointer"
    >
      {/* Image Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10"
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      />

      {/* Image */}
      <motion.img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.7 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-20 h-full flex flex-col justify-end p-6 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"
        initial={{ y: 20 }}
        whileHover={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`w-12 h-1 rounded-full mb-4 bg-gradient-to-r ${project.color}`}
          whileHover={{ width: 60 }}
          transition={{ duration: 0.3 }}
        />

        <motion.h3
          className="text-2xl font-bold text-white mb-2"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          {project.title}
        </motion.h3>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech, idx) => (
            <motion.span
              key={idx}
              whileHover={{ scale: 1.1, y: -2 }}
              className="px-2 py-1 text-xs font-medium rounded-md bg-white/10 text-gray-200 border border-white/5"
            >
              {tech}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaGithub size={20} /> <span className="text-sm font-medium">Code</span>
          </motion.a>
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaExternalLinkAlt size={18} /> <span className="text-sm font-medium">Live Demo</span>
          </motion.a>
        </motion.div>
      </motion.div>
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