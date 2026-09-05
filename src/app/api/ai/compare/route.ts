import { NextRequest, NextResponse } from "next/server";
import { askGemini, isGeminiAvailable } from "@/lib/ai/gemini";
import { SCHEME_SATHI_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { schemes, userProfileSummary } = body;

    if (!schemes || !Array.isArray(schemes) || schemes.length < 2) {
      return NextResponse.json({ error: "At least two schemes are required for comparison" }, { status: 400 });
    }

    const schemeSummaries = schemes
      .map(
        (s: any, idx: number) => `
Scheme ${idx + 1}: ${s.name} (${s.shortName})
- Category: ${s.category}
- Government Level: ${s.governmentLevel}
- Key Benefit: ${s.keyBenefitBadge}
- Eligibility Summary: ${s.whoCanBenefit}
- Required Documents: ${s.documents?.slice(0, 4).join(", ")}
`
      )
      .join("\n");

    const prompt = `
You are SchemeSathi AI.
Compare the following government schemes for a citizen and answer: "Which scheme should I prioritize and why?"

${userProfileSummary ? `CITIZEN PROFILE:\n${userProfileSummary}\n` : ""}

SCHEMES TO COMPARE:
${schemeSummaries}

Please provide:
1. **Quick Tradeoff Summary**: Key difference in benefits, eligibility barriers, and speed of application.
2. **Personalized Recommendation**: Which scheme they should apply for first and why.
3. **Can They Apply for Both?**: Clarify if benefits are complementary or mutually exclusive.

Keep it clear, concise, actionable, and encouraging.
`.trim();

    if (!isGeminiAvailable()) {
      return NextResponse.json({
        comparisonAdvice:
          `### ⚖️ Scheme Comparison Guidance (Offline Heuristic)\n\n` +
          `• **Prioritize Direct Benefit Transfer:** Schemes offering immediate monthly or quarterly cash support typically have straightforward verification.\n` +
          `• **Check Document Readiness:** Review the document checklist for each scheme. Apply for the one where you already possess all certificates.\n` +
          `• **Complementary Schemes:** Most Central and State schemes can be availed concurrently unless they cover the identical benefit.\n\n` +
          `*(Connect your \`GEMINI_API_KEY\` to get personalized AI comparison trade-offs.)*`,
        isFallback: true,
      });
    }

    const result = await askGemini(prompt, SCHEME_SATHI_SYSTEM_PROMPT);

    return NextResponse.json({
      comparisonAdvice: result.text,
      isFallback: result.isFallback || false,
    });
  } catch (error: any) {
    console.error("Comparison API error:", error);
    return NextResponse.json({ error: "Failed to compare schemes" }, { status: 500 });
  }
}
