import React, { useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import { Link } from "react-scroll";
import Lottie from "lottie-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Typewriter from "react-typewriter-effect";

import codingAnimation from "../assets/lottie/coding.json"; // You need to download this from lottiefiles.com

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
      {/* Background Quotes */}
      <div className="absolute top-5 left-5 text-sm opacity-30 max-w-sm">
        <Typewriter
          textStyle={{ color: "#ffffff", fontSize: "1rem" }}
          startDelay={100}
          cursorColor="#fff"
          multiText={quotes}
          loop
          typeSpeed={50}
        />
      </div>

      {/* Main Content */}
      <div
        className="z-10 flex flex-col md:flex-row items-center justify-between gap-10 w-full"
        data-aos="fade-up"
      >
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Hello, I'm <span className="text-teal-400">Vamshi</span>
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-lg">
            A passionate Full Stack MERN Developer & AI Enthusiast crafting beautiful and intelligent web experiences.
          </p>

          {/* Resume + Scroll Button */}
          <div className="flex items-center justify-center md:justify-start gap-4">
            <a
              href="/Vamshi_Resume.pdf" // Make sure the file exists in your public folder
              download
              className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-full flex items-center gap-2 transition duration-300"
            >
              <FaDownload /> Resume
            </a>

            <Link
              to="projects"
              smooth={true}
              duration={500}
              className="cursor-pointer border border-white py-2 px-4 rounded-full hover:bg-white hover:text-black transition duration-300"
            >
              See Projects
            </Link>
          </div>
        </div>

        {/* Right Section - Lottie Animation */}
        <div className="flex-1 w-full max-w-md" data-aos="fade-left">
          <Lottie animationData={codingAnimation} loop={true} />
        </div>
      </div>

      {/* Overlay Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-10 pointer-events-none"></div>
    </section>
  );
};

export default Home;