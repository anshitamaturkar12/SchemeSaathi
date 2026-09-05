export type SchemeCategory =
  | "Agriculture"
  | "Education"
  | "Healthcare"
  | "Housing"
  | "Employment"
  | "Women & Family"
  | "Business"
  | "Social Welfare";

export type GovernmentLevel = "Central" | "State";

export interface CriterionRule {
  type:
    | "age_min"
    | "age_max"
    | "income_max"
    | "state"
    | "occupation"
    | "gender"
    | "social_category"
    | "residence_type"
    | "is_farmer"
    | "land_holding_max"
    | "is_student"
    | "is_disability"
    | "housing_type";
  value: any;
  weight?: number; // relative weight, default 1
  isMandatory?: boolean; // if false, unmet doesn't hard-fail
}

export interface EligibilityCriterion {
  id: string;
  label: string;
  rule: CriterionRule;
  citizenDescription: string;
}

export interface ApplicationStep {
  step: number;
  title: string;
  description: string;
}

export interface Scheme {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: SchemeCategory;
  governmentLevel: GovernmentLevel;
  states: string[]; // ["All India"] or ["Maharashtra", "Gujarat"]
  benefits: string[];
  keyBenefitBadge: string;
  eligibilityCriteria: EligibilityCriterion[];
  documents: string[];
  applicationSteps: ApplicationStep[];
  officialUrl: string;
  sourceName: string;
  lastVerified: string;
  tags: string[];
  isVerifiedOfficial: boolean;
  whoCanBenefit: string;
  importantNotes: string[];
}

export type MatchCategory = "strong" | "possible" | "unlikely";

export interface SchemeMatchResult {
  scheme: Scheme;
  score: number; // 0 to 100
  matchCategory: MatchCategory;
  matchedCriteria: { label: string; reason: string }[];
  unmetCriteria: { label: string; reason: string }[];
  unknownCriteria: { label: string; reason: string }[];
  summaryExplanation: string;
}

export type ApplicationStatus =
  | "interested"
  | "documents_needed"
  | "ready_to_apply"
  | "applied";

export interface SavedSchemeItem {
  schemeId: string;
  savedAt: string;
  status: ApplicationStatus;
  notes?: string;
}
