export type ActivityType = "VIEWED" | "SAVED" | "APPLIED" | "PROFILE_UPDATED";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  username: string;
  created_at?: string;
}

export interface UserProfileData {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  state?: string;
  city?: string;
  occupation?: string;
  annual_income?: number;
  social_category?: string;
  created_at: string;
  updated_at: string;
}

export interface SchemeActivityItem {
  id: string;
  user_id: string;
  scheme_id: string;
  scheme_name: string;
  activity_type: ActivityType;
  status?: string; // "interested" | "documents_needed" | "ready_to_apply" | "applied"
  created_at: string;
}
