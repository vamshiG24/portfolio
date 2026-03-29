import { useRef, useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loaderAnim from "../assets/lottie/Loading.json";

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [ripples, setRipples] = useState([]);

  const sendEmail = async (e) => {
    e.preventDefault();

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    setShowLoader(true);
    setLoading(true);

    const formData = new FormData(form.current);
    const data = {
      name: formData.get("user_name"),
      email: formData.get("user_email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("https://backend-portfolio-s2ey.onrender.com/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      setLoading(false);
      setTimeout(() => {
        setShowLoader(false);
        if (result.success) {
          alert("✅ Message sent successfully!");
          form.current.reset();
        } else {
          alert("❌ Failed to send message, please try again.");
        }
      }, 400);
    } catch (error) {
      setLoading(false);
      setTimeout(() => {
        setShowLoader(false);
        alert("❌ Failed to send message, please try again.");
      }, 400);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen py-20 px-4 flex items-center justify-center overflow-hidden"
    >
      {/* Loader Overlay */}
      {showLoader && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0"
            }`}
        >
          <Lottie animationData={loaderAnim} loop={true} className="w-40 h-40" />
        </div>
      )}

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center z-10">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
            Let’s Build Something <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Amazing</span> 🚀
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
            Have a project idea, or just want to connect?
            I’d love to hear from you. Let’s make something incredible together.
          </p>

          <div className="flex gap-6">
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
                className="p-4 bg-white/5 border border-white/10 rounded-full text-white text-xl hover:bg-teal-500 hover:border-teal-500 transition-all duration-300 hover:scale-110 shadow-lg shadow-teal-500/20"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right Side Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <form
            ref={form}
            onSubmit={sendEmail}
            className="glass-card p-10 rounded-2xl space-y-6 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-600"></div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  name="user_name"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  name="user_email"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Subject</label>
              <input
                type="text"
                name="subject"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                placeholder="Project Inquiry"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Message</label>
              <textarea
                name="message"
                rows="4"
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none"
                placeholder="Tell me about your project..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="relative w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
            >
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                  }}
                />
              ))}
              <FaPaperPlane /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;