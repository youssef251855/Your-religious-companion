import { GoogleGenAI, Type } from "@google/genai";
import { AIContent } from "../types";

// Using the provided key from environment or failing gracefully if not set
// In a real deployed app, the user would provide this, or it would be proxied.
// For this demo, we assume process.env.API_KEY is available.

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = "gemini-3-flash-preview";

export const getDailyAIContent = async (): Promise<AIContent | null> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini");
    return {
        dua: "اللهم إنك عفو تحب العفو فاعف عنا",
        healthTip: "تجنب الأطعمة المالحة في السحور لتقليل العطش.",
        charityIdea: "تصدق بوجبة إفطار لصائم محتاج اليوم."
    };
  }

  try {
    const prompt = `
      أنت مساعد رمضاني ذكي. قم بتوليد محتوى يومي لرمضان باللغة العربية.
      المحتوى يجب أن يكون بصيغة JSON ويحتوي على:
      1. دعاء (dua): دعاء قصير ومؤثر من الكتاب والسنة.
      2. نصيحة صحية (healthTip): نصيحة طبية للصائم للإفطار أو السحور.
      3. فكرة صدقة (charityIdea): فكرة بسيطة لعمل الخير اليوم.
      
      لا تضف أي نصوص أخرى خارج الـ JSON.
    `;

    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dua: { type: Type.STRING },
            healthTip: { type: Type.STRING },
            charityIdea: { type: Type.STRING },
          },
          required: ["dua", "healthTip", "charityIdea"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIContent;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback content
    return {
        dua: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        healthTip: "اشرب كميات كافية من الماء بين الإفطار والسحور.",
        charityIdea: "ابتسم في وجه أخيك، فهي صدقة."
    };
  }
};
