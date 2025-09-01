/**
 * Free image classification APIs for outfit detection
 */

/**
 * Use Hugging Face's free image classification API
 * Model: google/vit-base-patch16-224 (free tier available)
 */
export async function classifyImageWithHuggingFace(imageFile) {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    // Using a free image classification model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      {
        method: "POST",
        // Спробуємо без токену (деякі моделі дозволяють це)
        body: formData,
      }
    );

    if (!response.ok) {
      console.log(
        `Hugging Face API error: ${response.status} ${response.statusText}`
      );
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const results = await response.json();
    console.log("Hugging Face results:", results);
    return analyzeHuggingFaceResults(results);
  } catch (error) {
    console.log("Hugging Face API unavailable:", error.message);
    return null;
  }
}

/**
 * Analyze results from Hugging Face to determine if it's an outfit
 */
function analyzeHuggingFaceResults(results) {
  if (!Array.isArray(results)) return null;

  // Look for HUMAN + clothing labels (more strict)
  const humanKeywords = [
    "person",
    "man",
    "woman",
    "people",
    "human",
    "model",
    "portrait",
    "face",
  ];

  const clothingKeywords = [
    "clothing",
    "shirt",
    "dress",
    "pants",
    "jeans",
    "jacket",
    "suit",
    "fashion",
    "uniform",
    "coat",
  ];

  const nonOutfitKeywords = [
    "computer",
    "screen",
    "logo",
    "text",
    "website",
    "application",
    "icon",
    "building",
    "car",
    "animal",
    "food",
    "landscape",
    "nature",
    "object",
    "bag", // Adding bags
    "handbag",
    "purse",
    "backpack",
    "luggage",
    "shoe", // Separate footwear without person
    "boot",
    "sneaker",
    "sandal",
  ];

  let humanScore = 0;
  let clothingScore = 0;
  let nonOutfitScore = 0;

  results.forEach((result) => {
    const label = result.label.toLowerCase();
    const score = result.score;

    // Check for human presence
    if (humanKeywords.some((keyword) => label.includes(keyword))) {
      humanScore += score;
    }

    // Check for clothing presence
    if (clothingKeywords.some((keyword) => label.includes(keyword))) {
      clothingScore += score;
    }

    // Check for non-outfit objects
    if (nonOutfitKeywords.some((keyword) => label.includes(keyword))) {
      nonOutfitScore += score;
    }
  });

  // For outfit need BOTH: person AND clothing (softer thresholds)
  const isOutfit =
    humanScore > 0.15 && clothingScore > 0.05 && nonOutfitScore < 0.6;

  let reasoning = "non_clothing_detected";
  if (nonOutfitScore > 0.5) {
    reasoning = "object_detected";
  } else if (humanScore < 0.15) {
    reasoning = "no_person_detected";
  } else if (clothingScore < 0.05) {
    reasoning = "no_clothing_detected";
  } else if (isOutfit) {
    reasoning = "outfit_detected";
  }

  // If all scores are very low - don't trust the result
  const maxScore = Math.max(humanScore, clothingScore, nonOutfitScore);
  const finalConfidence = maxScore < 0.1 ? 0.01 : maxScore; // Very low confidence

  return {
    isOutfit,
    confidence: finalConfidence,
    topLabels: results.slice(0, 3),
    reasoning: maxScore < 0.1 ? "uncertain_low_confidence" : reasoning,
    scores: {
      human: humanScore,
      clothing: clothingScore,
      nonOutfit: nonOutfitScore,
    },
  };
}

/**
 * Alternative: Use ImageNet classification via TensorFlow.js (client-side)
 */
export async function classifyImageClientSide(imageFile) {
  try {
    // Dynamic import to avoid SSR issues
    const tf = await import("@tensorflow/tfjs");
    const mobilenet = await import("@tensorflow-models/mobilenet");

    // Load the model
    const model = await mobilenet.load();

    // Create image element
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    return new Promise((resolve) => {
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Classify the image
        const predictions = await model.classify(canvas);

        resolve(analyzeTensorFlowResults(predictions));
      };

      img.src = URL.createObjectURL(imageFile);
    });
  } catch (error) {
    console.log("TensorFlow.js unavailable:", error.message);
    return null;
  }
}

/**
 * Analyze TensorFlow.js results for outfit detection
 */
function analyzeTensorFlowResults(predictions) {
  const humanClasses = ["person", "people"];

  const clothingClasses = [
    "suit",
    "dress",
    "shirt",
    "jean",
    "jacket",
    "coat",
    "uniform",
    "gown",
    "kimono",
    "bikini",
    "swimsuit",
  ];

  const nonOutfitClasses = [
    "computer",
    "laptop",
    "screen",
    "monitor",
    "phone",
    "car",
    "building",
    "animal",
    "food",
    "plant",
    "logo",
    "sign",
    "text",
    "bag", // Додаємо сумки
    "handbag",
    "purse",
    "backpack",
    "shoe",
    "boot",
    "sneaker",
  ];

  let humanScore = 0;
  let clothingScore = 0;
  let nonOutfitScore = 0;

  predictions.forEach((prediction) => {
    const className = prediction.className.toLowerCase();
    const probability = prediction.probability;

    if (humanClasses.some((cls) => className.includes(cls))) {
      humanScore += probability;
    }

    if (clothingClasses.some((cls) => className.includes(cls))) {
      clothingScore += probability;
    }

    if (nonOutfitClasses.some((cls) => className.includes(cls))) {
      nonOutfitScore += probability;
    }
  });

  // Для аутфіту потрібні ОБА: людина І одяг (м'якіші пороги)
  const isOutfit =
    humanScore > 0.1 && clothingScore > 0.05 && nonOutfitScore < 0.5;

  let reasoning = "non_clothing_detected";
  if (nonOutfitScore > 0.4) {
    reasoning = "object_detected";
  } else if (humanScore < 0.1) {
    reasoning = "no_person_detected";
  } else if (clothingScore < 0.05) {
    reasoning = "no_clothing_detected";
  } else if (isOutfit) {
    reasoning = "outfit_detected";
  }

  return {
    isOutfit,
    confidence: Math.max(humanScore, clothingScore, nonOutfitScore),
    topPredictions: predictions.slice(0, 3),
    reasoning,
    scores: {
      human: humanScore,
      clothing: clothingScore,
      nonOutfit: nonOutfitScore,
    },
  };
}
