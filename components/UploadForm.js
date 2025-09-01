import { useState } from "react";
import { motion } from "framer-motion";
import { analyzeImageBasics, isLikelyOutfit } from "../utils/imageValidation";
import {
  classifyImageWithHuggingFace,
  classifyImageClientSide,
} from "../utils/freeImageAPI";
import { simpleOutfitAnalysis } from "../utils/simpleAnalysis";

const UploadForm = ({ onUpload, onUploadStart }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    // Notify parent component that upload has started
    if (onUploadStart) {
      onUploadStart();
    }

    try {
      // Pre-validate image before sending to API
      const imageAnalysis = await analyzeImageBasics(selectedFile);
      const outfitCheck = isLikelyOutfit(imageAnalysis);

      // Try free API classification (multiple fallbacks)
      let freeAPIResult = await classifyImageWithHuggingFace(selectedFile);

      // If Hugging Face fails, try TensorFlow.js
      if (!freeAPIResult) {
        freeAPIResult = await classifyImageClientSide(selectedFile);
      }

      // If both AI methods fail, use simple analysis
      if (!freeAPIResult) {
        freeAPIResult = simpleOutfitAnalysis(selectedFile, imageAnalysis);
        console.log("🔄 Using simple analysis fallback:", freeAPIResult);
        console.log("🔍 Simple analysis details:", {
          isOutfit: freeAPIResult.isOutfit,
          confidence: freeAPIResult.confidence,
          reasoning: freeAPIResult.reasoning,
          filename: selectedFile.name,
          hasNonOutfitKeyword: freeAPIResult.details.hasNonOutfitKeyword,
          hasOutfitKeyword: freeAPIResult.details.hasOutfitKeyword,
        });
      }

      // Debug logging
      console.log("=== DETAILED IMAGE ANALYSIS ===");
      console.log("1. Basic analysis:", outfitCheck);
      console.log("2. AI result:", freeAPIResult);
      if (freeAPIResult) {
        console.log("3. AI details:", {
          isOutfit: freeAPIResult.isOutfit,
          confidence: freeAPIResult.confidence,
          reasoning: freeAPIResult.reasoning,
          source: freeAPIResult.source,
        });
      }
      console.log("4. File:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      // Smart detection logic
      let shouldStop = false;
      let stopReason = null;

      console.log("=== DETECTION LOGIC ===");

      // If AI API says "not outfit" with REAL confidence (not 0) - block
      if (
        freeAPIResult &&
        !freeAPIResult.isOutfit &&
        freeAPIResult.confidence > 0.1
      ) {
        shouldStop = true;
        stopReason = `ai_detected_non_outfit (${freeAPIResult.source}, confidence: ${freeAPIResult.confidence})`;
        console.log("🚫 AI says NOT OUTFIT with confidence - blocking");
      }
      // If AI says "not outfit" but with zero confidence - ignore
      else if (
        freeAPIResult &&
        !freeAPIResult.isOutfit &&
        freeAPIResult.confidence <= 0.1
      ) {
        console.log(
          "⚠️ AI says NOT OUTFIT but with zero confidence - ignoring and allowing"
        );
      }
      // If AI is unavailable, check basic analysis
      else if (!freeAPIResult && !outfitCheck.isOutfit) {
        shouldStop = true;
        stopReason = `basic_analysis_non_outfit (${outfitCheck.reason})`;
        console.log("🚫 Basic analysis says NOT OUTFIT - blocking");
      }
      // Otherwise - allow
      else {
        console.log("✅ Allowing to OpenAI API");
      }

      if (shouldStop) {
        const notOutfitResult = {
          rating: 0,
          style: "not-an-outfit",
          description: getNotOutfitDescription(
            outfitCheck.reason,
            freeAPIResult
          ),
        };
        console.log("Stopping analysis - not an outfit:", {
          reason: stopReason,
          basicAnalysis: outfitCheck,
          aiResult: freeAPIResult,
          result: notOutfitResult,
        });
        onUpload(selectedFile, notOutfitResult);
        return;
      }

      // Якщо дійшли сюди - продовжуємо аналіз
      console.log("Proceeding to API analysis:", {
        basicAnalysisApproves: outfitCheck.isOutfit,
        aiAnalysisApproves: freeAPIResult
          ? freeAPIResult.isOutfit
          : "not_available",
        decision: "proceed_to_openai",
      });

      // Create FormData to send file to API
      const formData = new FormData();
      formData.append("image", selectedFile);

      // Send file to analysis API
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze outfit");
      }

      // Pass both file and analysis result to parent component
      onUpload(selectedFile, result);
    } catch (error) {
      console.error("Analysis failed:", error);
      // Show error to user - you could add error state here
      alert("Failed to analyze outfit. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <motion.div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? "border-tiktok-pink bg-pink-50"
              : selectedFile
              ? "border-green-400 bg-green-50"
              : "border-gray-300 bg-white/90 backdrop-blur-sm"
          } hover:border-tiktok-pink hover:bg-pink-50 cursor-pointer shadow-lg`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            {selectedFile ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="space-y-2"
              >
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-600 font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">Ready to rate!</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                <div className="w-16 h-16 mx-auto bg-gradient-tiktok rounded-full flex items-center justify-center">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">
                  {isDragging
                    ? "Drop your outfit photo here!"
                    : "Upload your outfit photo"}
                </p>
                <p className="text-sm text-gray-400">
                  Drag & drop or click to browse
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!selectedFile || isUploading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-lg transition-all duration-300 ${
            selectedFile && !isUploading
              ? "bg-gradient-tiktok hover:shadow-xl transform hover:scale-105 active:scale-95"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          whileHover={selectedFile && !isUploading ? { scale: 1.05 } : {}}
          whileTap={selectedFile && !isUploading ? { scale: 0.95 } : {}}
        >
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Rating your outfit...</span>
            </div>
          ) : (
            "Get AI Rating ✨"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

// Helper function to generate descriptions for non-outfit images
function getNotOutfitDescription(reason, freeAPIResult) {
  // Priority to AI results if available
  if (freeAPIResult && freeAPIResult.reasoning && !freeAPIResult.isOutfit) {
    const topLabel =
      freeAPIResult.topLabels?.[0]?.label ||
      freeAPIResult.topPredictions?.[0]?.className ||
      "object";

    switch (freeAPIResult.reasoning) {
      case "object_detected":
        return `🚫 AI detected an object "${topLabel}" that is not an outfit. Please upload a photo of a person in clothing for style analysis.`;
      case "no_person_detected":
        return `👤 No person found in the photo. Style rating requires a photo of a person in an outfit, not separate items or accessories.`;
      case "no_clothing_detected":
        return `👔 Person detected, but no clothing visible for analysis. Please upload a photo where the outfit is fully visible.`;
      case "non_clothing_detected":
        return `❌ AI detected "${topLabel}" which is not suitable for style analysis. A photo of a person in clothing is needed.`;
      case "outfit_detected":
        // This shouldn't happen, but just in case
        return `⚠️ AI detected an outfit, but basic validation failed. Please try another photo.`;
    }
  }

  // Fallback to basic descriptions
  const descriptions = {
    screenshot:
      "📱 This looks like a screenshot. Please upload a photo of a person in clothing for style analysis.",
    icon: "🖼️ This looks like an icon or logo. Style rating requires a full-body photo or portrait with clothing.",
    monochrome:
      "🎨 The image has very few colors. Please upload a colorful outfit photo for better analysis.",
    low_confidence:
      "❓ Cannot confidently identify an outfit in this image. Please try a higher quality photo of a person in clothing.",
  };

  return descriptions[reason] || descriptions.low_confidence;
}

export default UploadForm;
