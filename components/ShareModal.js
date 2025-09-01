import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShareImage from "./ShareImage";

const ShareModal = ({
  isOpen,
  onClose,
  outfitImage,
  rating,
  style,
  description,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const shareImageRef = useRef(null);

  // Create shareable content
  const websiteUrl = "https://outfitrater.online";
  const shareText = `Check out my outfit score! I got ${rating}/10 on AI Outfit Rater! 🔥 Try rating your outfit too: ${websiteUrl}`;
  const shortShareText = `My outfit got ${rating}/10! 🔥 Rate yours:`;

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = websiteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  // Copy share text to clipboard
  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Social media sharing functions
  const shareOnPlatform = (platform) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(websiteUrl);
    const encodedShortText = encodeURIComponent(shortShareText);

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
      case "instagram":
        // Instagram doesn't have direct web sharing, so we'll copy the link and show instructions
        copyLink();
        alert(
          "Link copied! Open Instagram and paste the link in your Story or post."
        );
        return;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedShortText}`;
        break;
      case "messenger":
        shareUrl = `https://www.messenger.com/new?link=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // Native share API (for mobile devices)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Outfit Rater",
          text: shareText,
          url: websiteUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copy link
      copyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm sm:max-w-md mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl"
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>

            <div className="p-4 sm:p-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Share Your Style! 🔥
                </h2>
                <p className="text-white/70 text-xs sm:text-sm">
                  Share your result and invite others to rate their outfits
                </p>
              </motion.div>

              {/* Share Image Preview */}
              <motion.div
                ref={shareImageRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-4 sm:mb-6"
              >
                <ShareImage
                  outfitImage={outfitImage}
                  rating={rating}
                  style={style}
                  description={description}
                  showControls={false}
                  isModal={true}
                />
              </motion.div>

              {/* Share Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Share Link:
                </label>
                <div className="relative">
                  <input
                    value={websiteUrl}
                    readOnly
                    className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-tiktok-pink/50"
                  />
                  <motion.button
                    onClick={copyLink}
                    className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs transition-all ${
                      linkCopied
                        ? "bg-green-500/30 text-green-300"
                        : "bg-tiktok-pink/20 hover:bg-tiktok-pink/30 text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {linkCopied ? "✓ Copied!" : "Copy Link"}
                  </motion.button>
                </div>
              </motion.div>

              {/* Share Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Share Message:
                </label>
                <div className="relative">
                  <textarea
                    value={shareText}
                    readOnly
                    className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-tiktok-pink/50"
                    rows={3}
                  />
                  <motion.button
                    onClick={copyShareText}
                    className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs transition-all ${
                      linkCopied
                        ? "bg-green-500/30 text-green-300"
                        : "bg-tiktok-pink/20 hover:bg-tiktok-pink/30 text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {linkCopied ? "✓ Copied!" : "Copy Text"}
                  </motion.button>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                {/* Native Share Button (Mobile) */}
                <motion.button
                  onClick={handleNativeShare}
                  className="w-full bg-gradient-to-r from-tiktok-pink to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg text-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📱 Share Link
                </motion.button>

                {/* Social Platform Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => shareOnPlatform("instagram")}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg text-sm"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📷 Instagram
                  </motion.button>

                  <motion.button
                    onClick={() => shareOnPlatform("telegram")}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg text-sm"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ✈️ Telegram
                  </motion.button>

                  <motion.button
                    onClick={() => shareOnPlatform("twitter")}
                    className="bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg text-sm"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🐦 Twitter
                  </motion.button>

                  <motion.button
                    onClick={() => shareOnPlatform("facebook")}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold shadow-lg text-sm"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📘 Facebook
                  </motion.button>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4"
              >
                <h4 className="text-yellow-400 font-semibold text-sm mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Sharing Tips
                </h4>
                <ul className="text-white/70 text-xs space-y-1">
                  <li>• Share link drives traffic to your site</li>
                  <li>• Instagram button copies link for Stories & posts</li>
                  <li>• Use native share on mobile for more options</li>
                  <li>• Message includes your rating for engagement</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
