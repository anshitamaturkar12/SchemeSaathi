export type Gender = "male" | "female" | "other" | "all";

export type Occupation =
  | "farmer"
  | "student"
  | "employed"
  | "unemployed"
  | "self_employed"
  | "business_owner"
  | "daily_wage"
  | "homemaker"
  | "artisan"
  | "street_vendor"
  | "other";

export type SocialCategory = "General" | "OBC" | "SC" | "ST" | "Minority" | "EWS";

export type ResidenceType = "rural" | "urban" | "semi_urban";

export type HousingType = "kutcha" | "pucca" | "rented" | "homeless";

export type EducationLevel =
  | "school"
  | "matric"
  | "undergraduate"
  | "postgraduate"
  | "diploma"
  | "vocational";

export interface UserProfile {
  // Step 1: About You
  age?: number;
  gender?: Gender;
  socialCategory?: SocialCategory;
  isDisability?: boolean;

  // Step 2: Location
  state?: string;
  district?: string;
  residenceType?: ResidenceType;

  // Step 3: Work & Income
  occupation?: Occupation;
  annualIncome?: number; // in INR
  isFarmer?: boolean;
  landHoldingHectares?: number;
  isStudent?: boolean;
  educationLevel?: EducationLevel;

  // Step 4: Household
  housingType?: HousingType;
  familyMembersCount?: number;
  hasBankAadhaarLinked?: boolean;

  // Step 5: Goals & Interests
  goals?: string[]; // ["farming_support", "higher_education", "healthcare", "business_capital", "housing", "skill_training"]
}

export const INITIAL_USER_PROFILE: UserProfile = {
  age: 24,
  gender: "female",
  socialCategory: "General",
  isDisability: false,
  state: "Maharashtra",
  district: "Pune",
  residenceType: "urban",
  occupation: "student",
  annualIncome: 180000,
  isFarmer: false,
  landHoldingHectares: 0,
  isStudent: true,
  educationLevel: "undergraduate",
  housingType: "rented",
  familyMembersCount: 4,
  hasBankAadhaarLinked: true,
  goals: ["higher_education", "skill_training"],
};
