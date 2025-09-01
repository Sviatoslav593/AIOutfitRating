import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  extractMetricsFromAnalysis,
  storeMetrics,
} from "../utils/metricsTracker";

const StyleMetrics = ({ analysisResult, rating }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  // Extract and store metrics using the metrics tracker
  const metricsData = extractMetricsFromAnalysis(analysisResult, rating);
  const metrics = metricsData.metrics;

  // Use energy level from metrics data
  const energyLevel = metricsData.energyLevel;

  const metricItems = [
    {
      name: "Fit",
      value: metrics.fit,
      gradient: "from-pink-500 to-purple-600",
      icon: "👔",
    },
    {
      name: "Color Match",
      value: metrics.colorMatch,
      gradient: "from-purple-500 to-blue-600",
      icon: "🎨",
    },
    {
      name: "Trendiness",
      value: metrics.trendiness,
      gradient: "from-blue-500 to-cyan-500",
      icon: "✨",
    },
    {
      name: "Creativity",
      value: metrics.creativity,
      gradient: "from-cyan-500 to-teal-500",
      icon: "🚀",
    },
    {
      name: "Era Vibe",
      value: metrics.eraVibe,
      gradient: "from-orange-500 to-pink-500",
      icon: "⏰",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1000);

    // Store metrics for analytics
    storeMetrics(metricsData);

    return () => clearTimeout(timer);
  }, [metricsData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/10 backdrop-blur-sm"
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mb-4 sm:mb-6"
      >
        <h3 className="text-xl sm:text-2xl font-black text-transparent bg-gradient-to-r from-tiktok-pink to-tiktok-blue bg-clip-text mb-2">
          Style Metrics
        </h3>
        <p className="text-white/60 text-xs sm:text-sm">
          Your outfit breakdown
        </p>
      </motion.div>

      {/* Progress Bars */}
      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {metricItems.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg">{metric.icon}</span>
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {metric.name}
                </span>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 + index * 0.1 }}
                className="text-white/80 font-bold text-xs sm:text-sm"
              >
                {metric.value}%
              </motion.span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{
                  delay: 1.8 + index * 0.1,
                  duration: 1.2,
                  ease: "easeOut",
                }}
                className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full relative`}
              >
                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{
                    delay: 2.5 + index * 0.1,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Energy Level Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-white font-bold text-sm flex items-center">
            <span className="mr-2">⚡</span>
            Style Energy
          </h4>
          <span className="text-white/80 text-sm font-semibold">
            {energyLevel.level}
          </span>
        </div>

        {/* Energy Level Bar Container */}
        <div className="relative h-6 bg-white/10 rounded-full overflow-hidden">
          {/* Background gradient zones */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-pink-500/30 rounded-full" />

          {/* Zone Labels */}
          <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] text-white/50 font-medium">
            <span>Calm</span>
            <span>Balanced</span>
            <span>Vibrant</span>
          </div>

          {/* Energy Indicator */}
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: `${energyLevel.position}%` }}
            transition={{ delay: 3, duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-lg border-2 border-white"
            style={{ backgroundColor: energyLevel.color }}
          >
            {/* Pulsing effect */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 0.3, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: energyLevel.color }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-tiktok-pink rounded-full"
        />
      </div>
    </motion.div>
  );
};

export default StyleMetrics;
