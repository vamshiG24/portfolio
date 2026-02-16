import { motion } from "framer-motion";

const logs = [
  {
    title: "Evidence Management - Cryptographic Hash Integrity",
    challenge: "Ensuring tamper-proof evidence storage required implementing SHA-256 hashing, but verifying hash chains across multiple evidence updates was causing performance bottlenecks.",
    solution: "Optimized by implementing incremental hashing with MongoDB indexing on hash fields and caching verification results, reducing verification time by 75%.",
    date: "Feb 2026"
  },
  {
    title: "BiteBot - Gemini API Context Management",
    challenge: "The chatbot was losing conversation context after 3-4 exchanges, leading to repetitive responses and poor user experience.",
    solution: "Implemented session-based context storage with Redis and structured prompt engineering to maintain conversation history, improving response relevance by 60%.",
    date: "Jan 2026"
  },
  {
    title: "Speaker Identification - MFCC Feature Extraction",
    challenge: "Initial model accuracy was only 72% due to inconsistent audio quality and background noise affecting MFCC feature extraction.",
    solution: "Added preprocessing pipeline with noise reduction using spectral gating and data augmentation techniques, achieving 94% accuracy on test dataset.",
    date: "Dec 2025"
  },
  {
    title: "EEG Seizure Detection - CNN Model Overfitting",
    challenge: "CNN model was overfitting on training data (98% train accuracy, 65% validation accuracy), failing to generalize to new EEG patterns.",
    solution: "Applied dropout layers, batch normalization, and k-fold cross-validation with augmented EEG data, improving validation accuracy to 89% while maintaining clinical reliability.",
    date: "Nov 2025"
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