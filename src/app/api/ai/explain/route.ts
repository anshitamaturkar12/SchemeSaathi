import { NextRequest, NextResponse } from "next/server";
import { askGemini, isGeminiAvailable } from "@/lib/ai/gemini";
import { SCHEME_SATHI_SYSTEM_PROMPT, buildSchemeExplainerPrompt } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schemeName, schemeDetails, targetLanguage = "English" } = body;

    if (!schemeName || !schemeDetails) {
      return NextResponse.json({ error: "Scheme details are required" }, { status: 400 });
    }

    if (!isGeminiAvailable()) {
      return NextResponse.json({
        explanation:
          `### 📌 ${schemeName} Overview\n\n` +
          `• **Target Beneficiaries:** Designed for citizens meeting the criteria detailed above.\n` +
          `• **Core Benefit:** Provides direct financial or welfare assistance.\n` +
          `• **Official Channel:** Apply only through the verified portal linked on this page.\n\n` +
          `*(Connect your \`GEMINI_API_KEY\` in \`.env\` for live multi-lingual AI explanations in Hindi or Marathi.)*`,
        isFallback: true,
      });
    }

    const prompt = buildSchemeExplainerPrompt(schemeName, schemeDetails, targetLanguage);
    const result = await askGemini(prompt, SCHEME_SATHI_SYSTEM_PROMPT);

    return NextResponse.json({
      explanation: result.text,
      isFallback: result.isFallback || false,
    });
  } catch (error: any) {
    console.error("Scheme explain error:", error);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
