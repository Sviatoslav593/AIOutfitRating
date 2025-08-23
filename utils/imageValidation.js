/**
 * Basic image validation utilities for outfit detection
 */

/**
 * Analyze image dimensions and basic properties
 */
export function analyzeImageBasics(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const analysis = {
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        colorAnalysis: analyzeColors(imageData),
        isLikelyScreenshot: detectScreenshot(img.width, img.height),
        isLikelyIcon: detectIcon(img.width, img.height),
      };

      resolve(analysis);
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Detect if image is likely a screenshot
 */
function detectScreenshot(width, height) {
  // Common screenshot dimensions
  const commonScreenResolutions = [
    { w: 1920, h: 1080 },
    { w: 1366, h: 768 },
    { w: 1440, h: 900 },
    { w: 1280, h: 720 },
    { w: 1536, h: 864 },
    { w: 1600, h: 900 },
  ];

  return (
    commonScreenResolutions.some(
      (res) => Math.abs(width - res.w) < 10 && Math.abs(height - res.h) < 10
    ) ||
    (width > 1200 && height > 600 && Math.abs(width / height - 16 / 9) < 0.1)
  );
}

/**
 * Detect if image is likely an icon or logo
 */
function detectIcon(width, height) {
  // Very small images or perfect squares are likely icons
  return (
    (width < 200 && height < 200) ||
    (Math.abs(width - height) < 10 && width < 500)
  );
}

/**
 * Analyze color distribution
 */
function analyzeColors(imageData) {
  const data = imageData.data;
  let totalPixels = data.length / 4;
  let colorVariance = 0;
  let averageR = 0,
    averageG = 0,
    averageB = 0;

  // Calculate average colors
  for (let i = 0; i < data.length; i += 4) {
    averageR += data[i];
    averageG += data[i + 1];
    averageB += data[i + 2];
  }

  averageR /= totalPixels;
  averageG /= totalPixels;
  averageB /= totalPixels;

  // Calculate color variance
  for (let i = 0; i < data.length; i += 4) {
    const rDiff = data[i] - averageR;
    const gDiff = data[i + 1] - averageG;
    const bDiff = data[i + 2] - averageB;
    colorVariance += rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
  }

  colorVariance /= totalPixels;

  return {
    variance: colorVariance,
    isMonochrome: colorVariance < 1000, // Very low variance = likely logo/icon
    averageColor: { r: averageR, g: averageG, b: averageB },
  };
}

/**
 * Determine if image is likely an outfit photo
 */
export function isLikelyOutfit(analysis) {
  const {
    width,
    height,
    aspectRatio,
    colorAnalysis,
    isLikelyScreenshot,
    isLikelyIcon,
  } = analysis;

  // Definitely not outfit indicators
  if (isLikelyScreenshot || isLikelyIcon) {
    return {
      isOutfit: false,
      reason: isLikelyScreenshot ? "screenshot" : "icon",
    };
  }

  // Very monochrome images are likely logos
  if (colorAnalysis.isMonochrome) {
    return { isOutfit: false, reason: "monochrome" };
  }

  // Portrait orientation is more likely to be outfit photos
  const isPortrait = aspectRatio < 0.8;
  const isSquare = Math.abs(aspectRatio - 1) < 0.2;

  // Good indicators for outfit photos (більш м'які критерії)
  const hasGoodDimensions = width >= 150 && height >= 150;
  const hasColorVariety = colorAnalysis.variance > 1000; // Зменшили поріг
  const hasReasonableAspectRatio = aspectRatio > 0.2 && aspectRatio < 5; // Розширили діапазон

  if (hasGoodDimensions && hasColorVariety && hasReasonableAspectRatio) {
    return { isOutfit: true, confidence: isPortrait ? 0.8 : 0.6 };
  }

  // Якщо не пройшли базові перевірки, але це не очевидно не-аутфіт, даємо шанс
  if (hasGoodDimensions && hasReasonableAspectRatio) {
    return { isOutfit: true, confidence: 0.4 }; // Низька впевненість, але не блокуємо
  }

  return { isOutfit: false, reason: "low_confidence" };
}
