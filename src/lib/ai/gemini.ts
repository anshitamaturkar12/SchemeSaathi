import { GoogleGenerativeAI } from "@google/generative-ai";

export function isGeminiAvailable(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 0 && !key.includes("your_gemini_api_key"));
}

const PRIMARY_MODEL = "gemini-3.6-flash";
const FALLBACK_MODEL = "gemini-flash-latest";

export function getGeminiModel(systemInstruction?: string, modelName: string = PRIMARY_MODEL) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || !isGeminiAvailable()) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction || undefined,
  });
}

export async function askGemini(
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string; success: boolean; isFallback?: boolean }> {
  if (!isGeminiAvailable()) {
    return {
      text: "AI Assistant is running in offline mode. Please configure your GEMINI_API_KEY in .env to unlock real-time Gemini AI insights.",
      success: false,
      isFallback: true,
    };
  }

  // Try primary model first, fallback to latest flash if needed
  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];

  for (const modelName of modelsToTry) {
    try {
      const model = getGeminiModel(systemInstruction, modelName);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return {
        text: responseText,
        success: true,
        isFallback: false,
      };
    } catch (error: any) {
      console.warn(`Gemini call failed on ${modelName}:`, error?.message?.split("\n")[0]);
      // If it's the last model to try, let it fall through to offline fallback
    }
  }

  return {
    text: "Unable to generate an AI response at this moment. You can still browse scheme details and check deterministic eligibility rules above.",
    success: false,
    isFallback: true,
  };
}
