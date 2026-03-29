import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import portfolio from "../assets/lottie/portfolio-trsansparent.json";

const PortfolioEntry = ({ onComplete }) => {
  const [gradientIndex, setGradientIndex] = useState(0);
  const [show, setShow] = useState(true);

  const gradients = [
    "linear-gradient(135deg, #00c6ff, #0072ff)",  // blue tones
    "linear-gradient(135deg, #ff7e5f, #feb47b)",  // warm orange
    "linear-gradient(135deg, #7f00ff, #e100ff)",  // purple/pink
    "linear-gradient(135deg, #00b09b, #96c93d)",  // green/teal
  ];

  useEffect(() => {
    // Smoothly change gradients every 1s
    const gradientInterval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 1000);

    // End animation after 3.5s
    const timer = setTimeout(() => {
      clearInterval(gradientInterval);
      setShow(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearInterval(gradientInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] transition-all duration-1000"
      style={{
        background: gradients[gradientIndex],
        transition: "background 1s ease-in-out",
      }}
    >
      <Lottie
        animationData={portfolio}
        loop={false}
        style={{ width: "350px", height: "350px" }}
      />
    </div>
  );
};

export default PortfolioEntry;