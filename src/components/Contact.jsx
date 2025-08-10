import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Aos from "aos";
import "aos/dist/aos.css";
import emailjs from "@emailjs/browser";
import Lottie from "lottie-react";
import loaderAnim from "../assets/lottie/Loading.json";

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setShowLoader(true);
    setLoading(true);

    emailjs
      .sendForm(
        "service_wlydo98",
        "template_3sz6ymh",
        form.current,
        "6eC8d4gCqPggsi5Hl"
      )
      .then(() => {
        setLoading(false); // Start fade-out
        setTimeout(() => {
          setShowLoader(false); // Remove from DOM
          alert("✅ Message sent successfully!");
          form.current.reset();
        }, 400); // matches fade duration
      })
      .catch(() => {
        setLoading(false);
        setTimeout(() => {
          setShowLoader(false);
          alert("❌ Failed to send message, please try again.");
        }, 400);
      });
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center px-6 py-16 text-white overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Background Animated Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-teal-500/30 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-2000"></div>

      {/* Loader Overlay with Fade */}
      {showLoader && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-lg z-50 transition-opacity duration-400 ${
            loading ? "opacity-100" : "opacity-0"
          }`}
        >
          <Lottie animationData={loaderAnim} loop={true} className="w-40 h-40" />
        </div>
      )}

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-14 items-center z-10">
        {/* Left Side */}
        <div data-aos="fade-right" className="space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight">
            Let’s Build Something <span className="text-teal-400">Amazing</span> 🚀
          </h2>
          <p className="text-gray-300 text-lg">
            Have a project idea, or just want to connect?
            I’d love to hear from you. Let’s make something incredible together.
          </p>

          <div className="flex space-x-6 text-4xl">
            {[
              { icon: <FaGithub />, link: "https://github.com/vamshiG24" },
              { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/vamshi-gowni-8bba28322" },
              { icon: <FaTwitter />, link: "#" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 rounded-full 
                          hover:bg-teal-400 hover:text-gray-900 
                          transition-all duration-300 transform 
                          hover:scale-110 active:scale-90 
                          active:shadow-[0_0_8px_2px_rgba(20,184,166,0.5)] 
                          shadow-lg"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side Form */}
        <form ref={form} onSubmit={sendEmail} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              name="user_name"
              className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              name="user_email"
              className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              name="subject"
              className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <textarea
              placeholder="Your Message"
              name="message"
              rows="5"
              className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-teal-500 
                        hover:bg-teal-600 
                        hover:shadow-[0_0_10px_2px_rgba(20,184,166,0.5)] 
                        hover:text-white 
                        text-white font-bold 
                        py-3 px-6 rounded 
                        transition-all duration-300 
                        active:scale-95 active:bg-teal-700 active:shadow-[0_0_6px_1px_rgba(20,184,166,0.4)]"
            >
              Send Message
            </button>
          </form>
      </div>
    </section>
  );
};

export default Contact;