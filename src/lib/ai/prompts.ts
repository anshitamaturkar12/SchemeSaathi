import schemesData from "@/data/schemes.json";

export const SCHEME_SATHI_SYSTEM_PROMPT = `
You are SchemeSathi AI ("Your Personal Government Scheme Eligibility Assistant").
Answer only using the provided structured scheme information and public Indian welfare schemes knowledge.
Never invent government schemes, non-existent benefits, arbitrary deadlines, or fake application links.
If specific information is unavailable or unverified, clearly say so.
Explain complicated government terminology in simple, everyday language that any Indian citizen can understand.
Always remind users that SchemeSathi AI provides eligibility indications and guidance, but final legal eligibility is determined solely by the respective government authority.
Be polite, encouraging, structured, and helpful.
Use bullet points and bold highlights for readability.
`.trim();

// Compact summary of all schemes for AI context grounding
export function getSchemesSummaryContext(): string {
  return schemesData
    .map(
      (s) => `
- ID: ${s.id}
  Name: ${s.name} (${s.shortName})
  Level: ${s.governmentLevel} | State: ${s.states.join(", ")}
  Category: ${s.category}
  Benefit: ${s.keyBenefitBadge}
  Description: ${s.description}
  Official Portal: ${s.officialUrl}
  Documents: ${s.documents.slice(0, 4).join(", ")}
`
    )
    .join("\n");
}

export function buildChatPrompt(userMessage: string, history: { role: string; content: string }[] = [], userProfileSummary?: string): string {
  const historyText = history
    .map((h) => `${h.role === "user" ? "Citizen" : "SchemeSathi AI"}: ${h.content}`)
    .join("\n\n");

  return `
CONTEXT OF VERIFIED GOVERNMENT WELFARE SCHEMES:
${getSchemesSummaryContext()}

${userProfileSummary ? `CURRENT USER PROFILE:\n${userProfileSummary}\n` : ""}

CONVERSATION HISTORY:
${historyText ? historyText : "No previous conversation."}

CURRENT CITIZEN QUERY:
${userMessage}

Please answer the citizen clearly, warmly, and accurately using ONLY the schemes above.
`.trim();
}

export function buildIntentParsePrompt(userQuery: string): string {
  return `
You are an expert AI intent parser for SchemeSathi.
A citizen has described their background in natural language.
Extract their demographic and eligibility attributes into a structured JSON object.

Only extract what can be reasonably inferred. Do not make wild guesses; use null or omit if not mentioned.

Allowed fields:
{
  "age": number or null,
  "gender": "male" | "female" | "other" | null,
  "state": string or null (e.g. "Maharashtra", "Uttar Pradesh", "Bihar"),
  "district": string or null,
  "residenceType": "rural" | "urban" | "semi_urban" | null,
  "occupation": "farmer" | "student" | "employed" | "unemployed" | "self_employed" | "business_owner" | "daily_wage" | "artisan" | "street_vendor" | "homemaker" | "other" | null,
  "annualIncome": number in INR (e.g. 200000 for 2 lakh) or null,
  "socialCategory": "General" | "OBC" | "SC" | "ST" | "Minority" | "EWS" | null,
  "isFarmer": boolean or null,
  "isStudent": boolean or null,
  "housingType": "kutcha" | "pucca" | "rented" | "homeless" | null,
  "summary": string (brief 1-sentence recap of what was understood)
}

Citizen query:
"${userQuery}"

Return ONLY valid JSON. No markdown code blocks, no backticks, no explanations.
`.trim();
}

export function buildSchemeExplainerPrompt(
  schemeName: string,
  schemeDetails: string,
  targetLanguage: string = "English"
): string {
  return `
You are SchemeSathi AI.
Explain the following government scheme in simple, plain, easy-to-understand ${targetLanguage}.

Scheme: ${schemeName}
Details:
${schemeDetails}

Format your response with:
1. What is this scheme in 1 simple sentence?
2. Who is it for?
3. What exact benefit will you get?
4. What documents to prepare first?
5. How to apply safely through official channels?

Language to respond in: ${targetLanguage}.
Use simple citizen-friendly words, avoiding difficult bureaucracy jargon.
`.trim();
}
