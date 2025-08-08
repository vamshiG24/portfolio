import React, { useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import Lottie from "lottie-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Typewriter from "react-typewriter-effect";
import codingAnimation from "../assets/lottie/coding.json";

const quotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "Stay hungry, stay foolish.",
  "Simplicity is the soul of efficiency.",
];

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section
      name="home"
      className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-6 md:px-16 relative overflow-hidden"
    >
      {/* Glowing Quotes Box */}
      <div className="absolute top-5 left-5 text-sm max-w-sm backdrop-blur-sm bg-white/5 border border-white/10 rounded-md p-3 shadow-md shadow-white/10">
        <Typewriter
          textStyle={{ color: "#ffffff", fontSize: "1rem" }}
          startDelay={100}
          cursorColor="#00f7ff"
          multiText={quotes}
          loop
          typeSpeed={40}
        />
      </div>

      {/* Main Content */}
      <div
        className="z-10 flex flex-col md:flex-row items-center justify-between gap-12 w-full"
        data-aos="fade-up"
      >
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
            Hello, I'm <span className="text-teal-400">Vamshi</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg leading-relaxed text-gray-200">
            A passionate Full Stack MERN Developer & AI Enthusiast crafting beautiful and intelligent web experiences.
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-5 flex-wrap">
            <a
              href="/Vamshi_Resume.pdf"
              download
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-cyan-600 hover:to-teal-600 text-white py-2.5 px-6 rounded-full font-medium flex items-center gap-2 shadow-lg transition-transform hover:scale-105 duration-300 hover:shadow-teal-200"
            >
              <FaDownload /> Resume
            </a>

            <a
              href='#projects'
              className="cursor-pointer border border-white py-2.5 px-6 rounded-full text-white hover:bg-white hover:text-black transition duration-300 shadow-md hover:shadow-white/30"
            >
              See Projects
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 w-full max-w-md" data-aos="fade-left">
          <Lottie animationData={codingAnimation} loop={true} />
        </div>
      </div>

      {/* Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-10 pointer-events-none"></div>
    </section>
  );
};

export default Home;