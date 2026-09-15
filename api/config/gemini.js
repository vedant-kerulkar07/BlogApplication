import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey,
});

const main = async (prompt) => {
  try {
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response?.text) {
      throw new Error("Gemini returned an empty response");
    }

    return response.text;
  } catch (error) {
    console.error("❌ Gemini generateContent error:", error);

    throw error;
  }
};

export default main;