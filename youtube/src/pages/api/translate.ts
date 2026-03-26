import { NextApiRequest, NextApiResponse } from "next";
import { translate } from 'google-translate-api-x';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    try {
      const resTranslation = await translate(text, { to: targetLang }) as any;
      return res.status(200).json({ translatedText: resTranslation.text });
    } catch (error) {
       console.error("Translation logic error details:", error);
       // Fallback: return original text if translation completely fails 
       // to avoid breaking the UI, but log the error.
       return res.status(500).json({ 
           message: "Translation failed", 
           translatedText: text,
           error: error instanceof Error ? error.message : String(error)
       });
    }

  } catch (error) {
    console.error("Translation API error:", error);
    return res.status(500).json({
      message: "Translation service unavailable",
      translatedText: req.body.text || "",
    });
  }
}
