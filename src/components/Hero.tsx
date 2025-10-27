import React, { useState, useEffect } from "react";

const images = [
  "https://homebliss.in/wp-content/uploads/2021/06/Feature-New-Recovered-How-To-Choose-The-Right-Tiles-For-Every-Room.jpg",
  "https://www.orientbell.com/blog/wp-content/uploads/2023/02/850x450-1-copy-2.jpg",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1920&q=80",
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden transition-all duration-700 pt-24 md:pt-32"
      // 🟢 Added top padding to prevent header overlap (pt-24 for phones, pt-32 for larger)
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-5 drop-shadow-lg leading-tight">
          Beautiful Tiles for Every Space
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-8">
          Discover our premium collection of ceramic, porcelain, and natural stone tiles.
          Transform your space with quality and style.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg transition-colors text-sm sm:text-base">
            View Products
          </button>
          <button className="border-2 border-primary-500 text-white hover:bg-primary-500 hover:text-white px-8 py-3 rounded-lg transition-colors text-sm sm:text-base">
            Get Inspired
          </button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === idx ? "bg-white" : "bg-gray-300/70"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
