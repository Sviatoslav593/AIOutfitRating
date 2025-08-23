/**
 * Simple client-side analysis without external APIs
 */

/**
 * Simple pattern-based analysis of filename and basic image properties
 */
export function simpleOutfitAnalysis(file, imageAnalysis) {
  const filename = file.name.toLowerCase();

  // Check filename for obvious non-outfit indicators - ТІЛЬКИ найочевидніші
  const nonOutfitKeywords = [
    "screenshot",
    "screen",
    "logo",
    "icon",
    "desktop",
    "wallpaper",
    "document",
    "pdf",
  ];

  const hasNonOutfitKeyword = nonOutfitKeywords.some((keyword) =>
    filename.includes(keyword)
  );

  // Check filename for outfit-related keywords
  const outfitKeywords = [
    "selfie",
    "photo",
    "pic",
    "outfit",
    "look",
    "style",
    "fashion",
    "mirror",
    "ootd",
    "dress",
    "shirt",
    "pants",
    "jeans",
  ];

  const hasOutfitKeyword = outfitKeywords.some((keyword) =>
    filename.includes(keyword)
  );

  // Combine filename analysis with basic image analysis
  let confidence = 0.9; // МАКСИМАЛЬНО оптимістично
  let reasoning = "basic_analysis";

  if (hasNonOutfitKeyword) {
    confidence = 0.05; // Тільки для ДУЖЕ очевидних випадків
    reasoning = "filename_suggests_non_outfit";
  } else if (hasOutfitKeyword) {
    confidence = 0.98;
    reasoning = "filename_suggests_outfit";
  }

  // Adjust based on image properties
  if (imageAnalysis) {
    const { aspectRatio, colorAnalysis, isLikelyScreenshot, isLikelyIcon } =
      imageAnalysis;

    if (isLikelyScreenshot || isLikelyIcon) {
      confidence = Math.min(confidence, 0.15); // Тільки для ДУЖЕ очевидних
      reasoning = "image_properties_suggest_non_outfit";
    } else {
      // Майже завжди підвищуємо впевненість для звичайних зображень
      confidence = Math.max(confidence, 0.95);
      if (reasoning === "basic_analysis") {
        reasoning = "image_properties_suggest_outfit";
      }
    }

    // Бонус для будь-яких нормальних розмірів
    if (imageAnalysis.width >= 100 && imageAnalysis.height >= 100) {
      confidence = Math.max(confidence, 0.9);
    }
  }

  return {
    isOutfit: confidence > 0.1, // ДУЖЕ низький поріг - практично завжди "так"
    confidence: confidence,
    reasoning: reasoning,
    source: "simple_analysis",
    details: {
      filename: filename,
      hasOutfitKeyword: hasOutfitKeyword,
      hasNonOutfitKeyword: hasNonOutfitKeyword,
      finalConfidence: confidence,
    },
  };
}
