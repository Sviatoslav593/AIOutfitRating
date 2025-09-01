import { IncomingForm } from "formidable";
import fs from "fs";

// Disable default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);

    const file = files.image?.[0];
    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    if (!file.mimetype?.startsWith("image/")) {
      return res.status(400).json({ error: "File must be an image" });
    }

    const imageBuffer = fs.readFileSync(file.filepath);
    const base64Image = imageBuffer.toString("base64");

    let analysis;
    try {
      analysis = await analyzeOutfitWithOpenAI(base64Image, file.mimetype);
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError.message);

      // Fallback to demo analysis if OpenAI quota exceeded
      analysis = generateDemoAnalysis();
    }

    fs.unlinkSync(file.filepath);

    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze outfit. Please try again.",
      details: error.message,
    });
  }
}

/**
 * Analyze outfit using OpenAI Vision API
 */
async function analyzeOutfitWithOpenAI(base64Image, mimeType) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "Ти — стиліст. Аналізуй лише те, що бачиш на фото. Уникай загальних фраз типу 'Чудовий образ'. Пиши українською, коротко, конкретно, з посиланням на деталі: кольори, фактури, фасони, посадка, поєднання, взуття, аксесуари. Якщо на зображенні немає людського аутфіту (логотип/іконка/скріншот/кімната/пейзаж/товар без людини) — поверни JSON зі style='not-an-outfit', rating=0 і пояснювальним description.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Analyze the outfit photo and return STRICT JSON: {"rating": number 1-10, "style": short category, "description": 1-2 rich, unique sentences in English with specifics. No additional text outside JSON.}',
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high",
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API error: ${errorData.error?.message || response.statusText}`
    );
  }

  const data = await response.json();

  let content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  // If response is wrapped in ```json ... ```
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonText = fenced ? fenced[1].trim() : content;

  let analysis;
  try {
    analysis = JSON.parse(jsonText);
  } catch {
    // Careful fallback: extract rating/style from text and take first 220 characters as description
    return {
      rating: extractRatingFromText(content),
      style: extractStyleFromText(content),
      description: content.substring(0, 220).trim(),
    };
  }

  // Validate structure and values
  const rating = Number.parseInt(analysis.rating, 10);
  const style = String(analysis.style || "").trim();
  const description = String(analysis.description || "").trim();

  if (!Number.isFinite(rating)) {
    analysis.rating = extractRatingFromText(content);
  } else {
    analysis.rating = Math.max(1, Math.min(10, rating));
  }

  analysis.style = style || extractStyleFromText(content);
  analysis.description =
    description || content.substring(0, 220).trim() || "Опис недоступний.";

  // Позначення не-аутфітів
  if (analysis.style === "not-an-outfit") {
    analysis.rating = 0;
  }

  return {
    rating: analysis.rating,
    style: analysis.style,
    description: analysis.description,
  };
}

/** Fallbacks */
function extractRatingFromText(text) {
  const ratingMatch = text.match(/rating[:\s]*(\d+)/i);
  if (ratingMatch) {
    return Math.max(1, Math.min(10, parseInt(ratingMatch[1])));
  }
  return Math.floor(Math.random() * 3) + 7;
}

function extractStyleFromText(text) {
  const styles = [
    "casual",
    "elegant",
    "sporty",
    "streetwear",
    "business",
    "bohemian",
    "trendy",
    "classic",
    "not-an-outfit",
  ];
  const lowerText = text.toLowerCase();
  for (const style of styles) {
    if (lowerText.includes(style)) return style;
  }
  return "stylish";
}

/**
 * Generate demo analysis when OpenAI API is not available
 */
function generateDemoAnalysis() {
  const styles = [
    "casual",
    "elegant",
    "sporty",
    "streetwear",
    "business",
    "trendy",
  ];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const rating = Math.floor(Math.random() * 4) + 7; // 7-10

  const descriptions = [
    "Стильний образ з гарним поєднанням кольорів! Силует підкреслює фігуру, а аксесуари додають завершеності. Сучасний та актуальний вибір! ✨",
    "Чудова координація елементів! Кольорова палітра гармонійна, фасон підходить ідеально. Образ виглядає впевнено та стильно! 💫",
    "Відмінний вибір тканин та текстур! Пропорції збалансовані, деталі доповнюють один одного. Дуже модний та привабливий лук! 🔥",
    "Елегантне поєднання класики та трендів! Колір підкреслює індивідуальність, крій сидить ідеально. Стиль на найвищому рівні! ⭐",
    "Яскравий та запам'ятовуючийся образ! Аксесуари гармонійно доповнюють основні елементи. Сучасно, стильно та з характером! 🌟",
  ];

  return {
    rating: rating,
    style: randomStyle,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
  };
}
