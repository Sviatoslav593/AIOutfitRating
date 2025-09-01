import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ShareModal from "./ShareModal";
import StyleMetrics from "./StyleMetrics";

const ResultCard = ({ file, analysisResult }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      // Cleanup function to revoke object URL
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Use AI analysis result or fallback to demo data
  const finalRating =
    analysisResult?.rating || Math.floor(Math.random() * 4) + 7;
  const finalStyle = analysisResult?.style || "stylish";
  const finalDescription =
    typeof analysisResult?.description === "string" &&
    analysisResult.description.trim()
      ? analysisResult.description.trim()
      : "Great outfit! The styling shows excellent fashion sense and attention to detail. Perfect combination of style and personality! ✨";

  // Rating color based on score
  const getRatingColor = (score) => {
    if (score === 0 || finalStyle === "not-an-outfit")
      return "from-gray-400 to-gray-600";
    if (score >= 9) return "from-green-400 to-green-600";
    if (score >= 7) return "from-yellow-400 to-orange-500";
    return "from-orange-400 to-red-500";
  };

  // Rating emoji based on score
  const getRatingEmoji = (score) => {
    if (score === 0 || finalStyle === "not-an-outfit") return "❓";
    if (score >= 9) return "🔥";
    if (score >= 7) return "✨";
    return "💫";
  };

  if (!file) return null;

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
        {/* Image Section */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {imageUrl && (
            <motion.img
              src={imageUrl}
              alt="Uploaded outfit"
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Rating Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            className="absolute top-4 right-4"
          >
            <div
              className={`bg-gradient-to-r ${getRatingColor(
                finalRating
              )} rounded-full p-3 shadow-lg`}
            >
              <div className="flex items-center space-x-1">
                <span className="text-white font-black text-xl">
                  {finalStyle === "not-an-outfit" ? "N/A" : finalRating}
                </span>
                {finalStyle !== "not-an-outfit" && (
                  <span className="text-white text-sm">/10</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-white"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{getRatingEmoji(finalRating)}</span>
                <span className="font-bold text-lg">AI Rating</span>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1 inline-block">
                <span className="text-sm font-medium capitalize">
                  {finalStyle}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Style Analysis
              </h3>
              {/* Show demo mode indicator if needed */}
              {!analysisResult && (
                <p className="text-xs text-gray-500 mt-1">Demo Mode</p>
              )}
            </div>
            <div className="flex space-x-1">
              {[...Array(Math.floor(finalRating / 2))].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                  className="text-yellow-400 text-lg"
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{finalDescription}</p>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <motion.button
              onClick={() => setShowShareModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-tiktok text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Share Result 🔗
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
              onClick={() => window.location.reload()}
            >
              Try Another 🔄
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Style Metrics */}
      <div className="mt-6">
        <StyleMetrics 
          analysisResult={analysisResult} 
          rating={finalRating}
          style={finalStyle}
        />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        outfitImage={file}
        rating={finalRating}
        style={finalStyle}
        description={finalDescription}
      />
    </motion.div>
  );
};

export default ResultCard;
