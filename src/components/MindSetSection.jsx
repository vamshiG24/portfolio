import React from "react";

const MindsetSection = () => {
  return (
    <section id="mindset" className="min-h-screen pt-14 px-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-indigo-400">🧠 Mindset</h2>
        <blockquote className="italic text-xl mb-8 text-gray-300">
          “I learn solo, fast, and with a purpose.”
        </blockquote>
        <p className="text-lg leading-relaxed text-gray-300 mb-6">
          I’m not here to follow the crowd — I’m here to lead my own path. I learn things on my own, not because it’s easy, but because it builds <span className="text-indigo-300 font-semibold">true confidence</span>. I dive deep, break things, fix them, and repeat — that’s how I grow.
        </p>
        <p className="text-lg leading-relaxed text-gray-300 mb-6">
          I pick up skills quickly and apply them immediately. I don’t wait for someone to teach me — I seek, I build, and I execute. Whether it's a new tech stack or a complex problem, I move fast and adapt faster.
        </p>
        <p className="text-lg leading-relaxed text-gray-300 mb-6">
          I carry a <span className="text-indigo-300 font-semibold">sigma mindset</span> — quiet focus, relentless improvement, and zero distractions. I believe in progress over perfection and action over overthinking.
        </p>
        <p className="text-lg leading-relaxed text-indigo-400 font-semibold">
          I’m not just building projects. I’m building <span className="underline">myself</span>.
        </p>
      </div>
    </section>
  );
};

export default MindsetSection;