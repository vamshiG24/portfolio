import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const timelineData = [
  {
    year: "2023",
    title: "Foundations & Frontend",
    description:
      "Started with C, then moved to HTML, CSS, and JavaScript. Built static websites and understood core programming concepts.",
  },
  {
    year: "2024",
    title: "Full Stack & Smart Dev",
    description:
      "Mastered MERN stack, built full-stack apps, explored AI integration and Blender visuals.",
  },
];

const Timeline = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="bg-gray-100 pt-14 px-4 min-h-screen" id="timeline">
      <h2 className="text-4xl text-center font-bold mb-12 text-blue-800">📜 My Dev Journey</h2>
      <div className="relative border-l-4 border-blue-600 max-w-3xl mx-auto">
        {timelineData.map((item, index) => (
          <div key={index} className="mb-12 ml-6" data-aos="fade-up">
            <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-2 top-1.5"></div>
            <p className="text-sm text-gray-500">{item.year}</p>
            <h3 className="text-2xl font-semibold text-blue-900">{item.title}</h3>
            <p className="text-gray-700 text-lg">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;