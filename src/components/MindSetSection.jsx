import React, { useEffect } from "react";
import Aos from "aos";

const MindsetSection = () => {

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <section id="mindset" className="min-h-screen pt-14 px-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-indigo-400">🧠 Mindset</h2>
        <blockquote className="italic text-xl mb-8 text-gray-300">
          “I learn independently, act decisively, and grow continuously.”
        </blockquote>
        <p className="text-lg leading-relaxed text-gray-300 mb-6">
          I thrive on self-driven learning, mastering concepts quickly, and applying them in real-world scenarios. I embrace challenges as opportunities to develop <span className="text-indigo-300 font-semibold">problem-solving skills</span> and resilience.
        </p>
        <p className="text-lg leading-relaxed text-gray-300 mb-6">
          Adaptability is my strength — I pick up new technologies and frameworks efficiently, execute projects with precision, and learn from every outcome. I focus on delivering results rather than waiting for guidance.
        </p>
        <p className="text-lg leading-relaxed text-gray-300 mb-6">
          I embody a <span className="text-indigo-300 font-semibold">growth-oriented mindset</span> — prioritizing continuous improvement, disciplined focus, and strategic action. I value learning through doing and optimizing processes over perfectionism.
        </p>
        <p className="text-lg leading-relaxed text-indigo-400 font-semibold">
          I’m not just building projects; I’m building <span className="underline">my expertise and professional identity</span>.
        </p>
      </div>
    </section>
  );
};

export default MindsetSection;