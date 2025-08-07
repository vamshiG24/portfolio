import {useEffect} from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Aos from 'aos'

const Contact = () => {

  useEffect(()=>{
    Aos.init({ duration: 1000 })
  },[])

  return ( 
    <section id="contact" className="bg-gray-900 text-white min-h-screen pt-28 px-4 sm:px-10" data-aos='fade-up'>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">📬 Contact Me</h2>
        <p className="mb-10 text-lg text-gray-300">
          I'm always open to freelance work, collaborations, or just chatting about tech and mindset.
          Drop a message or connect via socials.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded transition"
            >
              Send Message
            </button>
          </form>

          {/* Social Links */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-2xl font-semibold">Connect With Me</h3>
              <p className="text-gray-400 mt-2">I’m active on these platforms 👇</p>
            </div>
            <div className="flex space-x-6 text-3xl">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;