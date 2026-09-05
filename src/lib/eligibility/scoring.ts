import { CriterionCheckResult } from "./criteria";
import { MatchCategory } from "@/types/scheme";

export interface ScoreCalculationResult {
  score: number;
  matchCategory: MatchCategory;
  mandatoryFailed: boolean;
}

export function calculateMatchScore(checks: CriterionCheckResult[]): ScoreCalculationResult {
  if (checks.length === 0) {
    return { score: 70, matchCategory: "possible", mandatoryFailed: false };
  }

  let totalPossibleWeight = 0;
  let earnedWeight = 0;
  let mandatoryFailed = false;

  for (const check of checks) {
    totalPossibleWeight += check.weight;

    if (check.status === "matched") {
      earnedWeight += check.weight;
    } else if (check.status === "unknown") {
      // Partial credit for unknown criteria (50%) to avoid harshly penalizing unprovided answers
      earnedWeight += check.weight * 0.5;
    } else if (check.status === "unmet") {
      if (check.isMandatory) {
        mandatoryFailed = true;
      }
    }
  }

  const rawScore = totalPossibleWeight > 0 ? (earnedWeight / totalPossibleWeight) * 100 : 50;

  // If any mandatory condition is definitively unmet (e.g. state or gender restriction),
  // severely penalize or cap score to unlikely (<40%)
  let finalScore = Math.round(rawScore);

  if (mandatoryFailed) {
    finalScore = Math.min(finalScore, 25);
  }

  let matchCategory: MatchCategory = "unlikely";
  if (finalScore >= 75) {
    matchCategory = "strong";
  } else if (finalScore >= 45) {
    matchCategory = "possible";
  } else {
    matchCategory = "unlikely";
  }

  return {
    score: finalScore,
    matchCategory,
    mandatoryFailed,
  };
}
