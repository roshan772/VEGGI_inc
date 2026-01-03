import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

import banner2 from "../assets/Green and White Modern Fresh Vegetable Sale Banner (2).png";
import banner1 from "../assets/Green and White Modern Fresh Vegetable Sale Banner (1).png";
import banner3 from "../assets/Green and White Modern Fresh Vegetable Sale Banner (3).png";
import banner0 from "../assets/Green and White Modern Fresh Vegetable Sale Banner.png";

interface Banner {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

const banners: Banner[] = [
  {
    src: banner2,
    alt: "Delicious Healthy Food Offer",
    title: "Delicious Healthy Food",
    subtitle: "Fresh, Tasty, Healthy - 50% Off!",
    ctaText: "Order Now",
    ctaLink: "/products",
  },
  {
    src: banner1,
    alt: "Christmas Special",
    title: "Christmas Feast Ready!",
    subtitle: "Veggies for Holiday Tables - 30% Off",
  },
  {
    src: banner3,
    alt: "New Year Fresh Start",
    title: "Ring in 2026 Fresh!",
    subtitle: "New Year Veggie Detox - Buy 1 Get 1 Free",
  },
  {
    src: banner0,
    alt: "New Year Fresh Start",
    title: "Ring in 2026 Fresh!",
    subtitle: "New Year Veggie Detox - Buy 1 Get 1 Free",
  },
];

export const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = banners[currentIndex];

  return (
    <div className="w-full overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative w-full h-48 md:h-[450px]"
          style={{ marginTop: "80px" }}
        >
          <img
            src={currentBanner.src}
            alt={currentBanner.alt}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentBanner.title}
            </motion.h2>

            <motion.p
              className="text-lg text-white/90 mb-4 drop-shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentBanner.subtitle}
            </motion.p>

            {currentBanner.ctaText && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to={currentBanner.ctaLink || "/products"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                >
                  {currentBanner.ctaText}
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
