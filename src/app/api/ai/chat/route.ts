import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/lib/ai/gemini";
import { SCHEME_SATHI_SYSTEM_PROMPT, buildChatPrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], userProfileSummary } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const prompt = buildChatPrompt(message, history, userProfileSummary);
    const result = await askGemini(prompt, SCHEME_SATHI_SYSTEM_PROMPT);

    if (result.isFallback) {
      // Return helpful offline response with matching hints
      return NextResponse.json({
        reply:
          "💡 **SchemeSathi AI (Offline Mode)**:\n\n" +
          "To enable real-time Gemini AI chat, please add your `GEMINI_API_KEY` in your `.env` file.\n\n" +
          "In the meantime, our deterministic eligibility engine is active! You can:\n" +
          "• Use **Find Schemes** to check your 100% accurate match score\n" +
          "• Browse all 18+ verified Central & State schemes in **Explore Schemes**\n" +
          "• Track required documents and official `gov.in` application links directly on any scheme page.",
        isFallback: true,
      });
    }

    return NextResponse.json({
      reply: result.text,
      isFallback: false,
    });
  } catch (error: any) {
    console.error("AI Chat route error:", error);
    return NextResponse.json(
      {
        reply: "We encountered an issue processing your query with the AI assistant. Please try again or use the questionnaire to check scheme matches.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
