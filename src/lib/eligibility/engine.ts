import { Scheme, SchemeMatchResult } from "@/types/scheme";
import { UserProfile } from "@/types/profile";
import { evaluateCriterion, CriterionCheckResult } from "./criteria";
import { calculateMatchScore } from "./scoring";

export function evaluateScheme(scheme: Scheme, profile: UserProfile): SchemeMatchResult {
  const checks: CriterionCheckResult[] = scheme.eligibilityCriteria.map((c) =>
    evaluateCriterion(c, profile)
  );

  const matchedCriteria: { label: string; reason: string }[] = [];
  const unmetCriteria: { label: string; reason: string }[] = [];
  const unknownCriteria: { label: string; reason: string }[] = [];

  for (const check of checks) {
    if (check.status === "matched") {
      matchedCriteria.push({ label: check.criterion.label, reason: check.reason });
    } else if (check.status === "unmet") {
      unmetCriteria.push({ label: check.criterion.label, reason: check.reason });
    } else {
      unknownCriteria.push({ label: check.criterion.label, reason: check.reason });
    }
  }

  const { score, matchCategory, mandatoryFailed } = calculateMatchScore(checks);

  // Generate plain-English explanation
  let summaryExplanation = "";
  if (mandatoryFailed) {
    const unmetLabels = unmetCriteria.map((u) => u.label).join(", ");
    summaryExplanation = `Currently unlikely because of specific eligibility limits: ${unmetLabels}. You may explore other categories or verify official exceptions.`;
  } else if (matchCategory === "strong") {
    summaryExplanation = `Based on your occupation (${profile.occupation?.replace(/_/g, " ") || "profile"}), location (${profile.state || "India"}), and reported income, you appear to meet all primary criteria.`;
  } else if (matchCategory === "possible") {
    summaryExplanation = `You meet several key requirements, though final eligibility will depend on official verification of ${unknownCriteria.map(u => u.label).join(", ") || "additional documents"}.`;
  } else {
    summaryExplanation = `Based on provided inputs, you may not currently meet the standard requirements for this program.`;
  }

  return {
    scheme,
    score,
    matchCategory,
    matchedCriteria,
    unmetCriteria,
    unknownCriteria,
    summaryExplanation,
  };
}

export function evaluateAllSchemes(schemes: Scheme[], profile: UserProfile): SchemeMatchResult[] {
  const results = schemes.map((scheme) => evaluateScheme(scheme, profile));

  // Sort by score descending (highest match first)
  return results.sort((a, b) => b.score - a.score);
}
