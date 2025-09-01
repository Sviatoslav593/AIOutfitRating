/**
 * Metrics tracking utilities for outfit analysis
 */

/**
 * Extract metrics from AI analysis result
 */
export function extractMetricsFromAnalysis(analysisResult, rating) {
  // Check if this is a "not-an-outfit" case
  if (rating === 0 || (analysisResult && analysisResult.style === "not-an-outfit")) {
    return {
      timestamp: new Date().toISOString(),
      rating: 0,
      style: "not-an-outfit",
      description: analysisResult?.description || "No outfit detected in the image",
      metrics: {
        fit: 0,
        colorMatch: 0,
        trendiness: 0,
        creativity: 0,
        eraVibe: 0,
      },
      energyLevel: {
        level: "No Style Detected",
        position: 0,
        color: "#6B7280",
        intensity: "none",
      },
      styleCategories: ["not-detected"],
      colorAnalysis: {
        mentionedColors: [],
        colorCount: 0,
        hasColorMention: false,
        dominantColor: null,
      },
      confidenceScores: {
        sentiment: 0,
        rating: 0,
        overall: 0,
      },
      source: "not-outfit",
    };
  }

  if (!analysisResult) {
    return generateFallbackMetrics(rating);
  }

  const description = analysisResult.description?.toLowerCase() || "";
  const style = analysisResult.style?.toLowerCase() || "";

  // Extract style categories
  const styleCategories = detectStyleCategories(description, style);

  // Analyze color distribution from description
  const colorAnalysis = analyzeColorMentions(description);

  // Calculate confidence scores
  const confidenceScores = calculateConfidenceScores(description, rating);

  // Generate individual metrics
  const metrics = {
    fit: calculateFitScore(description, rating),
    colorMatch: calculateColorMatchScore(description, colorAnalysis, rating),
    trendiness: calculateTrendinessScore(description, style, rating),
    creativity: calculateCreativityScore(description, style, rating),
    eraVibe: calculateEraVibeScore(description, style, rating),
  };

  // Calculate overall energy level
  const energyLevel = calculateEnergyLevel(metrics);

  return {
    timestamp: new Date().toISOString(),
    rating: rating,
    style: analysisResult.style,
    description: analysisResult.description,
    metrics: metrics,
    energyLevel: energyLevel,
    styleCategories: styleCategories,
    colorAnalysis: colorAnalysis,
    confidenceScores: confidenceScores,
    source: "ai_analysis",
  };
}

/**
 * Detect style categories from description
 */
function detectStyleCategories(description, style) {
  const categories = [];

  const categoryKeywords = {
    casual: ["casual", "relaxed", "comfortable", "everyday", "laid-back"],
    formal: ["formal", "elegant", "sophisticated", "professional", "classy"],
    trendy: ["trendy", "fashionable", "modern", "contemporary", "stylish"],
    vintage: ["vintage", "retro", "classic", "timeless", "old-school"],
    sporty: ["sporty", "athletic", "active", "gym", "workout"],
    bohemian: ["boho", "bohemian", "free-spirited", "artistic", "eclectic"],
    minimalist: ["minimal", "simple", "clean", "understated", "basic"],
    edgy: ["edgy", "bold", "daring", "rebellious", "alternative"],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (
      keywords.some(
        (keyword) => description.includes(keyword) || style.includes(keyword)
      )
    ) {
      categories.push(category);
    }
  }

  return categories.length > 0 ? categories : ["general"];
}

/**
 * Analyze color mentions in description
 */
function analyzeColorMentions(description) {
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "black",
    "white",
    "gray",
    "grey",
    "brown",
    "beige",
    "navy",
    "maroon",
    "teal",
    "coral",
    "gold",
    "silver",
    "cream",
    "tan",
    "khaki",
  ];

  const mentionedColors = colors.filter((color) => description.includes(color));
  const colorCount = mentionedColors.length;

  return {
    mentionedColors: mentionedColors,
    colorCount: colorCount,
    hasColorMention: colorCount > 0,
    dominantColor: mentionedColors[0] || null,
  };
}

/**
 * Calculate confidence scores based on description analysis
 */
function calculateConfidenceScores(description, rating) {
  const positiveWords = [
    "great",
    "excellent",
    "perfect",
    "amazing",
    "stunning",
    "beautiful",
    "stylish",
  ];
  const negativeWords = ["poor", "bad", "awful", "terrible", "ugly", "messy"];

  const positiveCount = positiveWords.filter((word) =>
    description.includes(word)
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    description.includes(word)
  ).length;

  const sentimentScore = (positiveCount - negativeCount + 5) / 10; // Normalize to 0-1
  const ratingConfidence = rating / 10;

  return {
    sentiment: Math.max(0, Math.min(1, sentimentScore)),
    rating: ratingConfidence,
    overall: (sentimentScore + ratingConfidence) / 2,
  };
}

/**
 * Calculate individual metric scores
 */
function calculateFitScore(description, rating) {
  const fitKeywords = [
    "fit",
    "fitting",
    "tailored",
    "proportions",
    "silhouette",
  ];
  const hasKeywords = fitKeywords.some((keyword) =>
    description.includes(keyword)
  );
  const baseScore = rating * 8;
  return Math.min(
    95,
    hasKeywords ? baseScore + 10 : baseScore + Math.floor(Math.random() * 15)
  );
}

function calculateColorMatchScore(description, colorAnalysis, rating) {
  const colorKeywords = [
    "color",
    "colours",
    "palette",
    "matching",
    "complement",
  ];
  const hasKeywords = colorKeywords.some((keyword) =>
    description.includes(keyword)
  );
  const baseScore = rating * 8;
  const colorBonus = colorAnalysis.hasColorMention ? 5 : 0;
  return Math.min(
    95,
    hasKeywords
      ? baseScore + 10 + colorBonus
      : baseScore + colorBonus + Math.floor(Math.random() * 20)
  );
}

function calculateTrendinessScore(description, style, rating) {
  const trendKeywords = [
    "trendy",
    "fashionable",
    "modern",
    "contemporary",
    "current",
    "up-to-date",
  ];
  const hasKeywords = trendKeywords.some(
    (keyword) => description.includes(keyword) || style.includes(keyword)
  );
  const baseScore = rating * 8;
  return Math.min(
    95,
    hasKeywords ? baseScore + 15 : baseScore + Math.floor(Math.random() * 25)
  );
}

function calculateCreativityScore(description, style, rating) {
  const creativityKeywords = [
    "unique",
    "creative",
    "original",
    "innovative",
    "artistic",
    "expressive",
  ];
  const hasKeywords = creativityKeywords.some(
    (keyword) => description.includes(keyword) || style.includes(keyword)
  );
  const baseScore = rating * 8;
  return Math.min(
    95,
    hasKeywords ? baseScore + 12 : baseScore + Math.floor(Math.random() * 20)
  );
}

function calculateEraVibeScore(description, style, rating) {
  const eraKeywords = [
    "classic",
    "vintage",
    "retro",
    "timeless",
    "traditional",
    "contemporary",
  ];
  const hasKeywords = eraKeywords.some(
    (keyword) => description.includes(keyword) || style.includes(keyword)
  );
  const baseScore = rating * 8;
  return Math.min(
    95,
    hasKeywords ? baseScore + 8 : baseScore + Math.floor(Math.random() * 15)
  );
}

/**
 * Calculate overall energy level
 */
function calculateEnergyLevel(metrics) {
  const average =
    (metrics.fit +
      metrics.colorMatch +
      metrics.trendiness +
      metrics.creativity +
      metrics.eraVibe) /
    5;

  if (average >= 80) {
    return {
      level: "Bold & Vibrant",
      position: 85,
      color: "#FF0050",
      intensity: "high",
    };
  } else if (average >= 60) {
    return {
      level: "Balanced",
      position: 50,
      color: "#25F4EE",
      intensity: "medium",
    };
  } else {
    return {
      level: "Calm & Classic",
      position: 15,
      color: "#9B5DE5",
      intensity: "low",
    };
  }
}

/**
 * Generate fallback metrics when no AI analysis is available
 */
function generateFallbackMetrics(rating) {
  // If rating is 0, return zero metrics (not an outfit)
  if (rating === 0) {
    return {
      timestamp: new Date().toISOString(),
      rating: 0,
      style: "not-an-outfit",
      description: "No outfit detected in the image",
      metrics: {
        fit: 0,
        colorMatch: 0,
        trendiness: 0,
        creativity: 0,
        eraVibe: 0,
      },
      energyLevel: {
        level: "No Style Detected",
        position: 0,
        color: "#6B7280",
        intensity: "none",
      },
      styleCategories: ["not-detected"],
      colorAnalysis: {
        mentionedColors: [],
        colorCount: 0,
        hasColorMention: false,
        dominantColor: null,
      },
      confidenceScores: {
        sentiment: 0,
        rating: 0,
        overall: 0,
      },
      source: "not-outfit",
    };
  }

  const baseScore = rating * 8;

  const metrics = {
    fit: Math.min(95, baseScore + Math.floor(Math.random() * 15)),
    colorMatch: Math.min(95, baseScore + Math.floor(Math.random() * 20)),
    trendiness: Math.min(95, baseScore + Math.floor(Math.random() * 25)),
    creativity: Math.min(95, baseScore + Math.floor(Math.random() * 20)),
    eraVibe: Math.min(95, baseScore + Math.floor(Math.random() * 15)),
  };

  return {
    timestamp: new Date().toISOString(),
    rating: rating,
    style: "demo",
    description: "Demo analysis - no AI result available",
    metrics: metrics,
    energyLevel: calculateEnergyLevel(metrics),
    styleCategories: ["general"],
    colorAnalysis: {
      mentionedColors: [],
      colorCount: 0,
      hasColorMention: false,
      dominantColor: null,
    },
    confidenceScores: {
      sentiment: 0.5,
      rating: rating / 10,
      overall: (0.5 + rating / 10) / 2,
    },
    source: "fallback",
  };
}

/**
 * Store metrics for analytics (localStorage for now, could be extended to API)
 */
export function storeMetrics(metricsData) {
  try {
    const existingMetrics = JSON.parse(
      localStorage.getItem("outfitMetrics") || "[]"
    );
    existingMetrics.push(metricsData);

    // Keep only last 100 entries to avoid storage bloat
    if (existingMetrics.length > 100) {
      existingMetrics.splice(0, existingMetrics.length - 100);
    }

    localStorage.setItem("outfitMetrics", JSON.stringify(existingMetrics));
    console.log("Metrics stored:", metricsData);
  } catch (error) {
    console.error("Failed to store metrics:", error);
  }
}

/**
 * Retrieve stored metrics for analytics
 */
export function getStoredMetrics() {
  try {
    return JSON.parse(localStorage.getItem("outfitMetrics") || "[]");
  } catch (error) {
    console.error("Failed to retrieve metrics:", error);
    return [];
  }
}
