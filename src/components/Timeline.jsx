import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const timelineData = [
  {
    year: "2021",
    title: "Started Learning C & Basics of Programming",
    description: "Got introduced to the world of logic and loops. Built basic console apps.",
  },
  {
    year: "2022",
    title: "Discovered Web Dev",
    description: "Started HTML, CSS, JavaScript, built my first landing page.",
  },
  {
    year: "2023",
    title: "MERN Stack Magic",
    description: "Built full-stack apps using React, Node, Express, MongoDB.",
  },
  {
    year: "2024",
    title: "Deep Dive into Projects & AI",
    description: "Focused on creating smart apps, began learning ML & Blender integration.",
  },
];

const Timeline = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="bg-gray-100 py-16 px-4" id="timeline">
      <h2 className="text-3xl text-center font-bold mb-12">📜 My Dev Journey</h2>
      <div className="relative border-l-2 border-blue-500 max-w-3xl mx-auto">
        {timelineData.map((item, index) => (
          <div key={index} className="mb-10 ml-6" data-aos="fade-up">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-1.5"></div>
            <p className="text-sm text-gray-500">{item.year}</p>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;