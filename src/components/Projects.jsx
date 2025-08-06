import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const projects = [
  {
    title: "SmartLife AI - PhotoCleaner",
    description: "Automatically filters blurry and waste photos using AI. Upload a folder and it gives you clean images.",
    tech: ["React", "Node.js", "Python", "OpenCV"],
    github: "https://github.com/yourusername/smartlife-photocleaner",
    demo: "https://smartlife-photocleaner.vercel.app",
    image: "https://via.placeholder.com/600x300", // replace with your own image URL
  },
  {
    title: "Resume Builder App",
    description: "Build modern CVs from templates dynamically using user input. Download ready-made resumes.",
    tech: ["React", "Express", "MongoDB"],
    github: "https://github.com/yourusername/resume-builder",
    demo: "https://vamshi-resumebuilder.netlify.app",
    image: "https://via.placeholder.com/600x300",
  },
  // Add more projects as needed
];

const Projects = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="bg-white py-16 px-4" id="projects">
      <h2 className="text-3xl text-center font-bold mb-12">🚀 Projects</h2>
      <div className="grid gap-10 max-w-5xl mx-auto md:grid-cols-2">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-100 rounded-lg shadow-lg overflow-hidden" data-aos="fade-up">
            <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, idx) => (
                  <span key={idx} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{tech}</span>
                ))}
              </div>
              <div className="flex justify-between">
                <a href={project.github} target="_blank" className="text-blue-500 hover:underline">GitHub</a>
                <a href={project.demo} target="_blank" className="text-green-500 hover:underline">Live Demo</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;