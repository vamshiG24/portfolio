import { useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Aos from 'aos';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_wlydo98', // Replace with EmailJS Service ID
        'template_3sz6ymh', // Replace with EmailJS Template ID
        form.current,
        '6eC8d4gCqPggsi5Hl'   // Replace with EmailJS Public Key
      )
      .then(
        (result) => {
          console.log(result.text);
          alert('Message sent successfully!');
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
          alert('Failed to send message, please try again.');
        }
      );
  };

  return (
    <section
      id="contact"
      className="bg-gray-900 text-white min-h-screen pt-28 px-4 sm:px-10"
      data-aos="fade-up"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">📬 Contact Me</h2>
        <p className="mb-10 text-lg text-gray-300">
          I'm always open to freelance work, collaborations, or just chatting about tech and mindset.
          Drop a message or connect via socials.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
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
              <a
                href="https://github.com/vamshiG24"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/vamshi-gowni-8bba28322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400"
              >
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