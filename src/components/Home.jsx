import React, { useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import Lottie from "lottie-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Typewriter from "react-typewriter-effect";
import codingAnimation from "../assets/lottie/coding.json";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

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
      className="w-full min-h-[90vh] flex items-center justify-center relative overflow-hidden"
    >
      {/* Decorative Gradient Blob */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Glowing Quotes Box - Floating */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-10 right-10 hidden lg:block text-sm max-w-sm glass-card rounded-xl p-4 border-l-4 border-cyan-400"
      >
        <Typewriter
          textStyle={{ color: "#e2e8f0", fontSize: "0.95rem", fontFamily: "monospace" }}
          startDelay={1000}
          cursorColor="#00d2ff"
          multiText={quotes}
          loop
          typeSpeed={50}
        />
      </motion.div>

      {/* Main Content */}
      <div
        className="z-10 flex flex-col md:flex-row items-center justify-between gap-16 w-full max-w-6xl"
      >
        {/* Left Section - Text */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-cyan-400 font-medium text-lg tracking-wide mb-2 uppercase">Welcome to my world</h2>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white mb-4">
              Hello, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Vamshi
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed md:mx-0 mx-auto"
          >
            A passionate <span className="text-white font-semibold">Full Stack MERN Developer</span> & <span className="text-white font-semibold">AI Enthusiast</span> crafting beautiful and intelligent web experiences.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center justify-center md:justify-start gap-6 pt-4"
          >
            <MagneticButton
              href="/Vamshi_Resume.pdf"
              download
              className="relative px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FaDownload /> Resume
            </MagneticButton>

            <MagneticButton
              href='#projects'
              className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white font-medium backdrop-blur-sm transition-all duration-300"
            >
              See Projects
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right Section - Lottie */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 w-full max-w-lg relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl rounded-full -z-10" />
          <Lottie animationData={codingAnimation} loop={true} className="drop-shadow-2xl" />
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 text-sm flex flex-col items-center gap-2"
      >
        <span>Scroll Down</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-cyan-400 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Home;