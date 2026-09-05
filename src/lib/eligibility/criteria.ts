import { CriterionRule, EligibilityCriterion } from "@/types/scheme";
import { UserProfile } from "@/types/profile";

export interface CriterionCheckResult {
  criterion: EligibilityCriterion;
  status: "matched" | "unmet" | "unknown";
  reason: string;
  weight: number;
  isMandatory: boolean;
}

export function evaluateCriterion(
  criterion: EligibilityCriterion,
  profile: UserProfile
): CriterionCheckResult {
  const { rule, label } = criterion;
  const weight = rule.weight || 1;
  const isMandatory = rule.isMandatory ?? true;

  switch (rule.type) {
    case "age_min": {
      if (profile.age === undefined) {
        return { criterion, status: "unknown", reason: `Age requirement (${rule.value}+ years) needs verification`, weight, isMandatory };
      }
      const pass = profile.age >= rule.value;
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? `Your age (${profile.age}) meets the minimum requirement of ${rule.value} years.`
          : `Minimum required age is ${rule.value} years (you entered ${profile.age}).`,
        weight,
        isMandatory,
      };
    }

    case "age_max": {
      if (profile.age === undefined) {
        return { criterion, status: "unknown", reason: `Maximum age limit (${rule.value} years) needs verification`, weight, isMandatory };
      }
      const pass = profile.age <= rule.value;
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? `Your age (${profile.age}) is within the upper limit of ${rule.value} years.`
          : `Exceeds the maximum eligible age limit of ${rule.value} years.`,
        weight,
        isMandatory,
      };
    }

    case "income_max": {
      if (profile.annualIncome === undefined) {
        return { criterion, status: "unknown", reason: `Income limit (₹${rule.value.toLocaleString("en-IN")}) needs verification`, weight, isMandatory };
      }
      const pass = profile.annualIncome <= rule.value;
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? `Your annual income (₹${profile.annualIncome.toLocaleString("en-IN")}) is within the ceiling of ₹${rule.value.toLocaleString("en-IN")}.`
          : `Your income (₹${profile.annualIncome.toLocaleString("en-IN")}) exceeds the scheme threshold of ₹${rule.value.toLocaleString("en-IN")}.`,
        weight,
        isMandatory,
      };
    }

    case "state": {
      if (!profile.state) {
        return { criterion, status: "unknown", reason: "State domicile needs verification", weight, isMandatory };
      }
      const allowedStates: string[] = Array.isArray(rule.value) ? rule.value : [rule.value];
      const isAllIndia = allowedStates.includes("All India");
      const pass = isAllIndia || allowedStates.includes(profile.state);
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? isAllIndia
            ? "Available across all Indian states and union territories."
            : `Available for residents of ${profile.state}.`
          : `This scheme is currently restricted to residents of ${allowedStates.join(", ")}.`,
        weight: isMandatory ? 4 : weight,
        isMandatory: true,
      };
    }

    case "occupation": {
      if (!profile.occupation) {
        return { criterion, status: "unknown", reason: "Occupation category needs verification", weight, isMandatory };
      }
      const allowedOccs: string[] = Array.isArray(rule.value) ? rule.value : [rule.value];
      const pass = allowedOccs.includes(profile.occupation);
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? `Matches your occupation profile as a ${profile.occupation.replace(/_/g, " ")}.`
          : `Intended for ${allowedOccs.map(o => o.replace(/_/g, " ")).join(" / ")} (you selected ${profile.occupation.replace(/_/g, " ")}).`,
        weight,
        isMandatory,
      };
    }

    case "gender": {
      if (!profile.gender) {
        return { criterion, status: "unknown", reason: "Gender criteria needs verification", weight, isMandatory };
      }
      const allowedGenders: string[] = Array.isArray(rule.value) ? rule.value : [rule.value];
      const pass = allowedGenders.includes("all") || allowedGenders.includes(profile.gender);
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? `Matches your gender profile (${profile.gender}).`
          : `Specially reserved for ${allowedGenders.join("/")} applicants.`,
        weight: 3,
        isMandatory,
      };
    }

    case "social_category": {
      if (!profile.socialCategory) {
        return { criterion, status: "unknown", reason: "Social category needs verification", weight, isMandatory };
      }
      const allowedCats: string[] = Array.isArray(rule.value) ? rule.value : [rule.value];
      const pass = allowedCats.includes(profile.socialCategory);
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? `Matches your reservation category (${profile.socialCategory}).`
          : `Reserved for ${allowedCats.join(", ")} categories (you indicated ${profile.socialCategory}).`,
        weight,
        isMandatory,
      };
    }

    case "residence_type": {
      if (!profile.residenceType) {
        return { criterion, status: "unknown", reason: "Area of residence (rural/urban) needs verification", weight, isMandatory };
      }
      const allowedTypes: string[] = Array.isArray(rule.value) ? rule.value : [rule.value];
      const pass = allowedTypes.includes(profile.residenceType);
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? `Matches your residential location type (${profile.residenceType}).`
          : `Designed specifically for ${allowedTypes.join("/")} localities.`,
        weight,
        isMandatory,
      };
    }

    case "is_farmer": {
      const isFarmer = profile.isFarmer || profile.occupation === "farmer";
      const pass = isFarmer === rule.value;
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? "You qualify under the agricultural / farmer landholder criteria."
          : "Specifically requires engagement in agricultural farming operations.",
        weight: 2,
        isMandatory,
      };
    }

    case "is_student": {
      const isStudent = profile.isStudent || profile.occupation === "student";
      const pass = isStudent === rule.value;
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? "You qualify under student enrollment criteria."
          : "Requires current enrollment in a recognized academic institution.",
        weight: 2,
        isMandatory,
      };
    }

    case "housing_type": {
      if (!profile.housingType) {
        return { criterion, status: "unknown", reason: "Current housing status needs verification", weight, isMandatory };
      }
      const allowedHousing: string[] = Array.isArray(rule.value) ? rule.value : [rule.value];
      const pass = allowedHousing.includes(profile.housingType);
      return {
        criterion,
        status: pass ? "matched" : "unmet",
        reason: pass
          ? `Your current housing type (${profile.housingType}) qualifies for assistance.`
          : `Priority is given to households living in ${allowedHousing.join("/")} dwellings.`,
        weight,
        isMandatory,
      };
    }

    default:
      return {
        criterion,
        status: "unknown",
        reason: `Verification required for ${label}`,
        weight,
        isMandatory: false,
      };
  }
}
