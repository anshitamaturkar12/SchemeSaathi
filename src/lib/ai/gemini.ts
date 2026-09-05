import { GoogleGenerativeAI } from "@google/generative-ai";

export function isGeminiAvailable(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 0 && !key.includes("your_gemini_api_key"));
}

export function getGeminiModel(systemInstruction?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !isGeminiAvailable()) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
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

  try {
    const model = getGeminiModel(systemInstruction);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return {
      text: responseText,
      success: true,
      isFallback: false,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
    return {
      text: "Unable to generate an AI response at this moment. You can still browse scheme details and check deterministic eligibility rules above.",
      success: false,
      isFallback: true,
    };
  }
}
