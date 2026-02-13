import { motion } from "framer-motion";

const logs = [
  {
    title: "PhotoCleaner - Blurry Image Detection",
    challenge: "Detecting and removing blurry images wasn't accurate using just OpenCV's Laplacian.",
    solution: "Tuned the threshold and added a variance check with scikit-image, boosting accuracy by 30%.",
    date: "Feb 2024"
  },
  {
    title: "Resume Builder - PDF Rendering",
    challenge: "React-PDF wasn't applying Tailwind styles, leading to broken layouts in downloads.",
    solution: "Switched to using html2canvas + jsPDF for pixel-perfect rendering, fixing the responsive layout issues.",
    date: "Jan 2024"
  },
  {
    title: "Portfolio Timeline - Mobile Overflow",
    challenge: "Timeline content was getting cut off and overlapping on smaller mobile screens.",
    solution: "Refactored to a vertical flex layout with specific media queries in Tailwind to ensure responsiveness.",
    date: "Dec 2023"
  },
];

const BuildLogs = () => {
  return (
    <section className="relative min-h-screen py-20 px-4" id="buildlogs">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-3 text-white">
            Build Logs
          </h2>
          <p className="text-gray-400">
            Challenges I faced and how I solved them
          </p>
        </motion.div>

        <div className="space-y-6">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-white">
                  {log.title}
                </h3>
                <span className="text-base text-gray-500 font-mono">
                  {log.date}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-medium text-red-400 mb-2">
                    Challenge
                  </h4>
                  <p className="text-gray-300 text-base">
                    {log.challenge}
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-medium text-green-400 mb-2">
                    Solution
                  </h4>
                  <p className="text-gray-300 text-base">
                    {log.solution}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildLogs;