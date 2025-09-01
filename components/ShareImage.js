import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ShareImage = ({
  outfitImage = null,
  rating = 8,
  style = "stylish",
  description = "Great outfit! Perfect combination of style and personality!",
  showControls = true,
  isModal = false,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const shareCardRef = useRef(null);

  // Create image URL from file
  useEffect(() => {
    if (outfitImage) {
      const url = URL.createObjectURL(outfitImage);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [outfitImage]);

  // Helper functions
  const getRatingColor = (score) => {
    if (score === 0 || style === "not-an-outfit")
      return "from-gray-400 to-gray-600";
    if (score >= 9) return "from-green-400 to-green-600";
    if (score >= 7) return "from-yellow-400 to-orange-500";
    return "from-orange-400 to-red-500";
  };

  const getRatingEmoji = (score) => {
    if (score === 0 || style === "not-an-outfit") return "❓";
    if (score >= 9) return "🔥";
    if (score >= 7) return "✨";
    return "💫";
  };

  const getStyleTitle = (styleType, score) => {
    if (styleType === "not-an-outfit") return "Not an Outfit";
    if (score >= 9) return "Fire Look! 🔥";
    if (score >= 8) return "Fresh & Stylish! ✨";
    if (score >= 7) return "Looking Good! 💫";
    return "Room to Improve! 💪";
  };

  // Export as image function
  const exportAsImage = async (format = "png") => {
    if (!shareCardRef.current) return;

    setIsExporting(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;

      // Wait for all images to load before capturing
      const images = shareCardRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Get the share card element
      const shareCard = shareCardRef.current;

      // Temporarily remove rounded borders for export
      const originalBorderRadius = shareCard.style.borderRadius;
      shareCard.style.borderRadius = "0px";

      const canvas = await html2canvas(shareCard, {
        width: 1080,
        height: 1920,
        scale: isModal ? 4.5 : 2, // Scale based on current size to reach 1080x1920
        backgroundColor: "#0D0D0D",
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
      });

      // Restore original border radius
      shareCard.style.borderRadius = originalBorderRadius;

      // Create download link
      const link = document.createElement("a");
      link.download = `my-outfit-rating.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, 0.9);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const cardWidth = isModal ? 240 : 540;
  const cardHeight = isModal ? 426 : 960;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Share Card - Vertical 9:16 Format */}
      <div
        ref={shareCardRef}
        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0"
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          minWidth: `${cardWidth}px`,
          minHeight: `${cardHeight}px`,
          maxWidth: `${cardWidth}px`,
          maxHeight: `${cardHeight}px`,
          background:
            "linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 25%, #16213e 50%, #0D0D0D 100%)",
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Neon Orbs */}
          <motion.div
            className="absolute top-12 right-12 w-24 h-24 rounded-full opacity-40 blur-xl"
            style={{
              background: `radial-gradient(circle, ${
                getRatingColor(rating).includes("green")
                  ? "#22c55e"
                  : getRatingColor(rating).includes("yellow")
                  ? "#f59e0b"
                  : "#ef4444"
              } 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-20 left-12 w-32 h-32 rounded-full opacity-30 blur-xl"
            style={{
              background:
                "radial-gradient(circle, #00F5D4 0%, transparent 70%)",
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Main Content Layout */}
        <div className="relative z-10 h-full flex flex-col p-6">
          {/* Top Section - Branding & Rating */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-tiktok-pink to-tiktok-blue rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-none">
                  AI Outfit Rater
                </h3>
                <p className="text-white/60 text-xs">Style Intelligence</p>
              </div>
            </div>

            {/* Rating Badge */}
            <motion.div
              className={`bg-gradient-to-r ${getRatingColor(
                rating
              )} rounded-full px-3 py-1 shadow-lg`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <div className="flex items-center space-x-1">
                <span className="text-white font-black text-lg">
                  {style === "not-an-outfit" ? "N/A" : rating}
                </span>
                {style !== "not-an-outfit" && (
                  <span className="text-white/80 text-xs">/10</span>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Center Section - Outfit Image */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            {/* Outfit Image */}
            {imageUrl && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div
                  className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 relative bg-gray-900"
                  style={{
                    width: isModal ? "140px" : "360px",
                    height: isModal ? "186px" : "480px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Outfit"
                    className="absolute inset-0 w-full h-full"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center center",
                      opacity: 0,
                      transform: "scale(1.05)",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                    onLoad={(e) => {
                      // Ensure image loads properly and is centered
                      e.target.style.opacity = "1";
                      e.target.style.transform = "scale(1)";
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", e);
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Floating emoji */}
                <motion.div
                  className="absolute -top-2 -right-2 text-2xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {getRatingEmoji(rating)}
                </motion.div>
              </motion.div>
            )}

            {/* Style Title */}
            <motion.h1
              className={`font-black text-white text-center leading-tight ${
                isModal ? "text-xl" : "text-4xl"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                textShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
                background: `linear-gradient(135deg, ${
                  getRatingColor(rating).includes("green")
                    ? "#22c55e"
                    : getRatingColor(rating).includes("yellow")
                    ? "#f59e0b"
                    : "#ef4444"
                } 0%, #ffffff 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {getStyleTitle(style, rating)}
            </motion.h1>

            {/* Style Description */}
            <motion.p
              className={`text-white/80 text-center leading-relaxed max-w-xs ${
                isModal ? "text-xs" : "text-sm"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {description.length > (isModal ? 60 : 100)
                ? description.substring(0, isModal ? 60 : 100) + "..."
                : description}
            </motion.p>
          </div>

          {/* Bottom Section - CTA and Branding */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* CTA */}
            <div className="bg-gradient-to-r from-tiktok-pink/20 to-tiktok-blue/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
              <span
                className={`text-white font-bold ${
                  isModal ? "text-sm" : "text-lg"
                }`}
              >
                Rate Your Outfit Too!
              </span>
            </div>

            {/* Website */}
            <p
              className={`text-white/60 font-medium ${
                isModal ? "text-xs" : "text-sm"
              }`}
            >
              ai-outfit-rater.vercel.app
            </p>

            {/* Star Rating Visual */}
            <div className="flex justify-center space-x-1">
              {[...Array(Math.min(5, Math.ceil(rating / 2)))].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                  className={`text-yellow-400 ${
                    isModal ? "text-sm" : "text-lg"
                  }`}
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Corner Decorations */}
        <motion.div
          className="absolute bottom-3 right-3 text-sm text-pink-400/60"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.div>
      </div>

      {/* Export Controls */}
      {showControls && !isModal && (
        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.button
            onClick={() => exportAsImage("png")}
            disabled={isExporting}
            className="bg-gradient-to-r from-tiktok-pink to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
            animate={
              isExporting
                ? {
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 10px 25px rgba(255, 0, 110, 0.3)",
                      "0 15px 35px rgba(255, 0, 110, 0.5)",
                      "0 10px 25px rgba(255, 0, 110, 0.3)",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 0.8,
              repeat: isExporting ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {isExporting ? (
              <span className="flex items-center space-x-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ⚡
                </motion.span>
                <span>Exporting...</span>
              </span>
            ) : (
              "Share PNG 📸"
            )}
          </motion.button>

          <motion.button
            onClick={() => exportAsImage("jpeg")}
            disabled={isExporting}
            className="bg-gradient-to-r from-tiktok-blue to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
            animate={
              isExporting
                ? {
                    scale: [1, 1.02, 1],
                    boxShadow: [
                      "0 10px 25px rgba(0, 245, 212, 0.3)",
                      "0 15px 35px rgba(0, 245, 212, 0.5)",
                      "0 10px 25px rgba(0, 245, 212, 0.3)",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 0.8,
              repeat: isExporting ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {isExporting ? (
              <span className="flex items-center space-x-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ⚡
                </motion.span>
                <span>Exporting...</span>
              </span>
            ) : (
              "Share JPEG 📱"
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ShareImage;
