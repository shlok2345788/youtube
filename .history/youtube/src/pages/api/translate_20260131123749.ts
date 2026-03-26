import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Translation API called with:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res
        .status(400)
        .json({ message: "Missing text or target language" });
    }

    // Try primary translation service
    try {
      const response = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: targetLang,
          format: "text",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Libretranslate response:", data);
        // Only return translation if it's different from original
        if (data.translatedText && data.translatedText !== text) {
          return res
            .status(200)
            .json({ translatedText: data.translatedText });
        } else {
          console.log("Translation returned same text, trying fallback");
        }
      }
    } catch (primaryError) {
      console.error("Primary translation service failed:", primaryError);
    }

    // Fallback translation service
    try {
      const fallbackResponse = await fetch(
        "https://translate.mentality.rip/translate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: "auto",
            target: targetLang,
          }),
        }
      );

      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        console.log("Fallback response:", data);
        // Only return translation if it's different from original
        if (data.translatedText && data.translatedText !== text) {
          return res
            .status(200)
            .json({ translatedText: data.translatedText });
        } else {
          console.log("Fallback also returned same text");
        }
      }
    } catch (fallbackError) {
      console.error("Fallback translation service failed:", fallbackError);
    }

    // If both services fail, return original text
    return res.status(200).json({ translatedText: text });
  } catch (error) {
    console.error("Translation API error:", error);
    return res.status(500).json({
      message: "Translation service unavailable",
      translatedText: req.body.text || "",
    });
  }
}
