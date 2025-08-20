import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Lottie from "lottie-react";
import AboutProject from "../assets/lottie/About-Project.json";

const projects = [
  {
    title: "SmartLife AI - PhotoCleaner",
    description: "Automatically filters blurry and waste photos using AI. Upload a folder and it gives you clean images.",
    tech: ["React", "Node.js", "Python", "OpenCV"],
    github: "https://github.com/yourusername/smartlife-photocleaner",
    demo: "https://smartlife-photocleaner.vercel.app",
    image: "https://via.placeholder.com/600x300",
  },
  {
    title: "Resume Builder App",
    description: "Build modern CVs from templates dynamically using user input. Download ready-made resumes.",
    tech: ["React", "Express", "MongoDB"],
    github: "https://github.com/yourusername/resume-builder",
    demo: "https://vamshi-resumebuilder.netlify.app",
    image: "https://via.placeholder.com/600x300",
  },
];

const Projects = () => {
  const lottieRef = useRef();
  const sectionRef = useRef();
  const [playAnimation, setPlayAnimation] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    // IntersectionObserver to detect when section is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayAnimation(false); // reset
          setTimeout(() => setPlayAnimation(true), 50); // restart after small delay
        }
      },
      { threshold: 0.5 } // 50% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white min-h-screen pt-14 px-4"
      id="projects"
    >
      {/* Lottie Animation */}
      <div className="flex justify-center mb-8 bg-amber-400">
        {playAnimation && (
          <Lottie
            lottieRef={lottieRef}
            animationData={AboutProject}
            loop={true}
            autoplay={true}
            style={{ height: 200, width: 200 }}
          />
        )}
      </div>

      <h2 className="text-3xl text-center font-bold mb-12">🚀 Projects</h2>

      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max px-2 pb-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="min-w-[320px] bg-gray-100 rounded-lg shadow-lg overflow-hidden"
              data-aos="fade-up"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-sm">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:underline"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;