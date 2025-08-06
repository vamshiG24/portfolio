import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const logs = [
  {
    title: "PhotoCleaner - Struggled with blurry image detection",
    challenge: "Detecting and removing blurry images wasn't accurate using just OpenCV’s Laplacian.",
    solution: "Tuned the threshold + added variance check with scikit-image. Boosted accuracy by 30%.",
  },
  {
    title: "Resume Builder - CV not rendering correctly in PDF",
    challenge: "React-PDF wasn’t applying Tailwind styles properly.",
    solution: "Used html2canvas + jsPDF instead for pixel-perfect rendering. Fixed responsive layout.",
  },
  {
    title: "Portfolio Timeline - Overflow issues on small screens",
    challenge: "Timeline content was getting cut off on mobile view.",
    solution: "Switched to a vertical timeline layout with `flex-col` & media queries in Tailwind.",
  },
];

const BuildLogs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="bg-gray-900 text-white py-16 px-4" id="buildlogs">
      <h2 className="text-3xl text-center font-bold mb-12">🛠️ Build Logs</h2>
      <div className="max-w-4xl mx-auto space-y-8">
        {logs.map((log, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            data-aos="fade-up"
          >
            <h3 className="text-xl font-bold text-blue-400 mb-2">{log.title}</h3>
            <p className="mb-2">
              <span className="font-semibold text-yellow-300">Challenge:</span> {log.challenge}
            </p>
            <p>
              <span className="font-semibold text-green-300">Solution:</span> {log.solution}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BuildLogs;