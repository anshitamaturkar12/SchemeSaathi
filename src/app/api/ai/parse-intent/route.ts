import { NextRequest, NextResponse } from "next/server";
import { askGemini, isGeminiAvailable } from "@/lib/ai/gemini";
import { buildIntentParsePrompt } from "@/lib/ai/prompts";
import { UserProfile } from "@/types/profile";

// Heuristic fallback extractor when Gemini API is offline
function extractProfileHeuristic(text: string): Partial<UserProfile> & { summary: string } {
  const lower = text.toLowerCase();
  const profile: Partial<UserProfile> & { summary: string } = {
    summary: "Extracted basic information using offline linguistic pattern matching.",
  };

  // Age extraction
  const ageMatch = text.match(/(\b\d{2}\b)\s*(?:years?|yrs?|year old|yr old)?/i);
  if (ageMatch) {
    const ageVal = parseInt(ageMatch[1], 10);
    if (ageVal >= 10 && ageVal <= 100) {
      profile.age = ageVal;
    }
  }

  // Occupation extraction
  if (lower.includes("farmer") || lower.includes("kisan") || lower.includes("farming") || lower.includes("agriculture")) {
    profile.occupation = "farmer";
    profile.isFarmer = true;
  } else if (lower.includes("student") || lower.includes("college") || lower.includes("studying")) {
    profile.occupation = "student";
    profile.isStudent = true;
  } else if (lower.includes("vendor") || lower.includes("street vendor") || lower.includes("hawker") || lower.includes("thela")) {
    profile.occupation = "street_vendor";
  } else if (lower.includes("artisan") || lower.includes("carpenter") || lower.includes("craft") || lower.includes("tailor")) {
    profile.occupation = "artisan";
  } else if (lower.includes("business") || lower.includes("shop") || lower.includes("enterprise") || lower.includes("dukan")) {
    profile.occupation = "business_owner";
  } else if (lower.includes("unemployed") || lower.includes("job seeker") || lower.includes("looking for job")) {
    profile.occupation = "unemployed";
  } else if (lower.includes("homemaker") || lower.includes("housewife")) {
    profile.occupation = "homemaker";
  } else if (lower.includes("daily wage") || lower.includes("labor") || lower.includes("mazdoor")) {
    profile.occupation = "daily_wage";
  }

  // Gender extraction
  if (lower.includes("woman") || lower.includes("female") || lower.includes("girl") || lower.includes("mother") || lower.includes("mahila")) {
    profile.gender = "female";
  } else if (lower.includes("man") || lower.includes("male") || lower.includes("boy") || lower.includes("purush")) {
    profile.gender = "male";
  }

  // State extraction
  const indianStates = [
    "Maharashtra", "Gujarat", "Karnataka", "Uttar Pradesh", "Bihar", "Madhya Pradesh",
    "Tamil Nadu", "Rajasthan", "West Bengal", "Punjab", "Haryana", "Kerala", "Telangana", "Andhra Pradesh", "Odisha", "Assam"
  ];
  for (const s of indianStates) {
    if (lower.includes(s.toLowerCase())) {
      profile.state = s;
      break;
    }
  }

  // Income extraction
  // Handles: 2 lakh, 2.5 lakh, 300000, 150000, 50k, etc.
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lacs|lakhs)/i);
  if (lakhMatch) {
    profile.annualIncome = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const rawNumberMatch = text.match(/(?:rs\.?|₹|inr)?\s*(\d{5,7})\b/i);
    if (rawNumberMatch) {
      profile.annualIncome = parseInt(rawNumberMatch[1], 10);
    }
  }

  // Social Category extraction
  if (lower.includes("obc")) profile.socialCategory = "OBC";
  else if (lower.includes("sc") || lower.includes("scheduled caste")) profile.socialCategory = "SC";
  else if (lower.includes("st") || lower.includes("scheduled tribe")) profile.socialCategory = "ST";
  else if (lower.includes("ews")) profile.socialCategory = "EWS";

  // Residence
  if (lower.includes("village") || lower.includes("rural") || lower.includes("gaon")) {
    profile.residenceType = "rural";
  } else if (lower.includes("city") || lower.includes("urban") || lower.includes("metro")) {
    profile.residenceType = "urban";
  }

  const parts = [];
  if (profile.age) parts.push(`Age: ${profile.age}`);
  if (profile.occupation) parts.push(`Occupation: ${profile.occupation}`);
  if (profile.state) parts.push(`State: ${profile.state}`);
  if (profile.annualIncome) parts.push(`Income: ₹${profile.annualIncome.toLocaleString("en-IN")}`);
  profile.summary = parts.length > 0 ? parts.join(", ") : "Basic intent captured.";

  return profile;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!isGeminiAvailable()) {
      const extracted = extractProfileHeuristic(query);
      return NextResponse.json({
        success: true,
        isFallback: true,
        extractedProfile: extracted,
        understandingSummary: extracted.summary,
      });
    }

    const prompt = buildIntentParsePrompt(query);
    const result = await askGemini(prompt);

    if (result.success && result.text) {
      try {
        // Clean JSON response
        const cleanText = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);
        return NextResponse.json({
          success: true,
          isFallback: false,
          extractedProfile: parsed,
          understandingSummary: parsed.summary || "Parsed demographic profile.",
        });
      } catch (jsonErr) {
        console.warn("Failed parsing Gemini JSON, falling back to heuristic", jsonErr);
      }
    }

    const fallback = extractProfileHeuristic(query);
    return NextResponse.json({
      success: true,
      isFallback: true,
      extractedProfile: fallback,
      understandingSummary: fallback.summary,
    });
  } catch (error: any) {
    console.error("Intent parsing error:", error);
    return NextResponse.json(
      { error: "Could not parse query intent", details: error?.message },
      { status: 500 }
    );
  }
}
