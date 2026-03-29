import { motion } from "framer-motion";

const logs = [
  {
    title: "BioSecure Access - Multimodal Biometric Integration",
    challenge: "Integrating voice (ECAPA-TDNN) and face (DeepFace) authentication in real-time was complex, especially handling audio from the browser and ensuring smooth verification.",
    solution: "Pre-processed browser WebM audio to 16kHz WAV for the model. Set up separate pipelines for voice and face recognition using Flask. Tested the integration to achieve a working real-time authentication prototype.",
    date: "Mar 2026"
  },
  {
    title: "Secure Digital Evidence Management - Cryptographic Hash Integrity",
    challenge: "Ensuring evidence files were tamper-proof using SHA-256 hashing while storing them securely in the cloud.",
    solution: "Implemented SHA-256 hashing for uploaded evidence files. Stored evidence files in Cloudinary and linked their hashes in MongoDB.",
    date: "Feb 2026"
  },
  {
    title: "EEG Seizure Detection - CNN Model Overfitting",
    challenge: "CNN model overfitted on training EEG data (high training accuracy but low validation accuracy), making it hard to generalize to new EEG patterns.",
    solution: "Added dropout layers and batch normalization to the CNN model. Used data augmentation to improve generalization. Monitored validation metrics to ensure the model learned meaningful patterns.",
    date: "Nov 2025"
  }
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