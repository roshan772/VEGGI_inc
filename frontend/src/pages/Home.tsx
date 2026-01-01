import { motion } from "framer-motion"; // Edited: Added for subtle animations (import framer-motion if not installed)
import ProductList from "./ProductList";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      {" "}
      {/* Edited: Full-height gradient background for immersive feel */}
      <div className="container mx-auto px-4">
        {/* Edited: Enhanced header with gradient text, icon, and animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-xl">
            {" "}
            {/* Edited: Added veggie icon container with shadow */}
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {" "}
              {/* Edited: Simple SVG icon for veggies */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" // Edited: Larger, gradient text for hero feel
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Fresh Veggies Delivered
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto" // Edited: Larger subtitle with width limit
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover organic, farm-fresh produce at your doorstep. Shop now and
            eat healthy!
          </motion.p>
        </motion.div>

        {/* Edited: Added subtle section divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

        {/* No change: ProductList - but wrapped for better spacing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ProductList />
        </motion.div>
      </div>
    </div>
  );
};
