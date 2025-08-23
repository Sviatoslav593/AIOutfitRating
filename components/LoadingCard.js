import { motion } from "framer-motion";

const LoadingCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Loading Image Section */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Loading skeleton content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <motion.div
                className="w-16 h-16 mx-auto bg-gradient-tiktok rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </motion.div>
              <div className="text-gray-500 font-medium">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  AI is analyzing your outfit...
                </motion.span>
              </div>
            </div>
          </div>

          {/* Loading rating badge skeleton */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            className="absolute top-4 right-4"
          >
            <div className="bg-gray-300 rounded-full p-3 shadow-lg animate-pulse">
              <div className="w-8 h-6 bg-gray-400 rounded"></div>
            </div>
          </motion.div>
        </div>

        {/* Loading Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-300 rounded-lg w-32 animate-pulse"></div>
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                  className="w-5 h-5 bg-gray-300 rounded animate-pulse"
                ></motion.div>
              ))}
            </div>
          </div>

          {/* Loading description lines */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-4/5 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          </div>

          {/* Loading action buttons */}
          <div className="flex space-x-3 pt-2">
            <div className="flex-1 h-12 bg-gray-300 rounded-xl animate-pulse"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingCard;
