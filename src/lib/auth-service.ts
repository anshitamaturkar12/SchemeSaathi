import crypto from "crypto";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { AuthUser, UserProfileData, SchemeActivityItem, ActivityType } from "@/types/auth";
import { isSupabaseConfigured, getSupabaseClient } from "./supabase";

export const SESSION_COOKIE_NAME = "schemesaathi_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "schemesaathi_jwt_secret_key_2026_dev_prod";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Interface for persisted user
interface StoredUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
}

interface LocalDatabase {
  users: StoredUser[];
  profiles: UserProfileData[];
  activities: SchemeActivityItem[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "auth_db.json");

function getLocalDb(): LocalDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial: LocalDatabase = { users: [], profiles: [], activities: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Failed to read local DB file:", err);
    return { users: [], profiles: [], activities: [] };
  }
}

function saveLocalDb(db: LocalDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local DB file:", err);
  }
}

// Token signing and verification using HMAC-SHA256
export function createSessionToken(userId: string, email: string): string {
  const payload = {
    userId,
    email,
    exp: Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE_SECONDS,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadStr)
    .digest("base64url");
  return `${payloadStr}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; email: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadStr)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
    if (!payload.userId || !payload.exp) return null;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// Authentication Operations
// -------------------------------------------------------------

export async function registerUser({
  full_name,
  email,
  username,
  password,
}: {
  full_name: string;
  email: string;
  username: string;
  password: string;
}): Promise<{ user: AuthUser; profile: UserProfileData }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase();
  const cleanName = full_name.trim();

  if (!cleanName || !cleanEmail || !cleanUsername || !password) {
    throw new Error("All fields are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  // If Supabase is configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            username: cleanUsername,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Registration failed: User could not be created.");
      }

      const user: AuthUser = {
        id: authData.user.id,
        email: cleanEmail,
        full_name: cleanName,
        username: cleanUsername,
        created_at: authData.user.created_at,
      };

      // Query or insert profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        return { user, profile: profileData as UserProfileData };
      }

      // Create fallback profile
      const newProfile: UserProfileData = {
        id: crypto.randomUUID(),
        user_id: user.id,
        full_name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        state: "Maharashtra",
        occupation: "student",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await supabase.from("profiles").insert(newProfile);
      return { user, profile: newProfile };
    }
  }

  // Resilient Local DB Driver
  const db = getLocalDb();

  const existingEmail = db.users.find((u) => u.email === cleanEmail);
  if (existingEmail) {
    throw new Error("An account with this email already exists.");
  }

  const existingUsername = db.users.find((u) => u.username === cleanUsername);
  if (existingUsername) {
    throw new Error("This username is already taken. Please choose another.");
  }

  // Proper secure bcrypt hashing
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  const newUser: StoredUser = {
    id: userId,
    full_name: cleanName,
    username: cleanUsername,
    email: cleanEmail,
    password_hash,
    created_at: now,
  };

  const newProfile: UserProfileData = {
    id: crypto.randomUUID(),
    user_id: userId,
    full_name: cleanName,
    username: cleanUsername,
    email: cleanEmail,
    phone: "",
    date_of_birth: "",
    gender: "",
    state: "Maharashtra",
    city: "Pune",
    occupation: "student",
    annual_income: 180000,
    social_category: "General",
    created_at: now,
    updated_at: now,
  };

  db.users.push(newUser);
  db.profiles.push(newProfile);
  saveLocalDb(db);

  const user: AuthUser = {
    id: userId,
    full_name: cleanName,
    username: cleanUsername,
    email: cleanEmail,
    created_at: now,
  };

  return { user, profile: newProfile };
}

export async function loginUser({
  credential,
  password,
}: {
  credential: string;
  password: string;
}): Promise<{ user: AuthUser; profile: UserProfileData; sessionToken: string }> {
  const cleanCred = credential.trim().toLowerCase();

  if (!cleanCred || !password) {
    throw new Error("Email/Username and password are required.");
  }

  // Supabase Auth Mode
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanCred,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Invalid credentials.");
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || cleanCred,
        full_name: profileData?.full_name || data.user.user_metadata?.full_name || "User",
        username: profileData?.username || data.user.user_metadata?.username || cleanCred.split("@")[0],
        created_at: data.user.created_at,
      };

      const profile: UserProfileData = profileData || {
        id: crypto.randomUUID(),
        user_id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const sessionToken = createSessionToken(user.id, user.email);
      return { user, profile, sessionToken };
    }
  }

  // Local DB Mode
  const db = getLocalDb();
  const foundUser = db.users.find(
    (u) => u.email === cleanCred || u.username === cleanCred
  );

  if (!foundUser) {
    throw new Error("Invalid email/username or password.");
  }

  const isMatch = await bcrypt.compare(password, foundUser.password_hash);
  if (!isMatch) {
    throw new Error("Invalid email/username or password.");
  }

  const profile = db.profiles.find((p) => p.user_id === foundUser.id) || {
    id: crypto.randomUUID(),
    user_id: foundUser.id,
    full_name: foundUser.full_name,
    username: foundUser.username,
    email: foundUser.email,
    created_at: foundUser.created_at,
    updated_at: foundUser.created_at,
  };

  const user: AuthUser = {
    id: foundUser.id,
    full_name: foundUser.full_name,
    username: foundUser.username,
    email: foundUser.email,
    created_at: foundUser.created_at,
  };

  const sessionToken = createSessionToken(user.id, user.email);
  return { user, profile, sessionToken };
}

export async function getUserFromSession(token?: string): Promise<{
  user: AuthUser;
  profile: UserProfileData;
} | null> {
  if (!token) return null;

  const verified = verifySessionToken(token);
  if (!verified) return null;

  // Supabase check
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", verified.userId)
        .single();

      if (profileData) {
        const user: AuthUser = {
          id: verified.userId,
          email: verified.email,
          full_name: profileData.full_name,
          username: profileData.username,
          created_at: profileData.created_at,
        };
        return { user, profile: profileData as UserProfileData };
      }
    }
  }

  // Local DB check
  const db = getLocalDb();
  const storedUser = db.users.find((u) => u.id === verified.userId);
  if (!storedUser) return null;

  const storedProfile = db.profiles.find((p) => p.user_id === storedUser.id) || {
    id: crypto.randomUUID(),
    user_id: storedUser.id,
    full_name: storedUser.full_name,
    username: storedUser.username,
    email: storedUser.email,
    created_at: storedUser.created_at,
    updated_at: storedUser.created_at,
  };

  return {
    user: {
      id: storedUser.id,
      full_name: storedUser.full_name,
      username: storedUser.username,
      email: storedUser.email,
      created_at: storedUser.created_at,
    },
    profile: storedProfile,
  };
}

// -------------------------------------------------------------
// Profile Operations
// -------------------------------------------------------------

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfileData>
): Promise<UserProfileData> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: now })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data as UserProfileData;
    }
  }

  const db = getLocalDb();
  const profileIndex = db.profiles.findIndex((p) => p.user_id === userId);

  if (profileIndex === -1) {
    const user = db.users.find((u) => u.id === userId);
    const newProfile: UserProfileData = {
      id: crypto.randomUUID(),
      user_id: userId,
      full_name: updates.full_name || user?.full_name || "Citizen User",
      username: updates.username || user?.username || "user",
      email: user?.email || "",
      ...updates,
      created_at: now,
      updated_at: now,
    };
    db.profiles.push(newProfile);
    saveLocalDb(db);
    return newProfile;
  }

  const existing = db.profiles[profileIndex];
  const updatedProfile: UserProfileData = {
    ...existing,
    ...updates,
    updated_at: now,
  };

  // If full_name or username changed, update user record too
  const user = db.users.find((u) => u.id === userId);
  if (user) {
    if (updates.full_name) user.full_name = updates.full_name;
    if (updates.username) user.username = updates.username;
  }

  db.profiles[profileIndex] = updatedProfile;
  saveLocalDb(db);
  return updatedProfile;
}

// -------------------------------------------------------------
// Scheme Activity Tracking Operations
// -------------------------------------------------------------

export async function recordSchemeActivity({
  userId,
  schemeId,
  schemeName,
  activityType,
  status,
}: {
  userId: string;
  schemeId: string;
  schemeName: string;
  activityType: ActivityType;
  status?: string;
}): Promise<SchemeActivityItem> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const newActivity = {
        user_id: userId,
        scheme_id: schemeId,
        scheme_name: schemeName,
        activity_type: activityType,
        status: status || null,
        created_at: now,
      };

      const { data, error } = await supabase
        .from("scheme_activity")
        .insert(newActivity)
        .select()
        .single();

      if (error) {
        console.error("Supabase activity insert error:", error);
      } else if (data) {
        return data as SchemeActivityItem;
      }
    }
  }

  const db = getLocalDb();

  // Deduplicate rapid consecutive views (within 5 minutes)
  if (activityType === "VIEWED") {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentView = db.activities.find(
      (a) =>
        a.user_id === userId &&
        a.scheme_id === schemeId &&
        a.activity_type === "VIEWED" &&
        new Date(a.created_at).getTime() > fiveMinutesAgo
    );
    if (recentView) {
      return recentView;
    }
  }

  const newActivity: SchemeActivityItem = {
    id: crypto.randomUUID(),
    user_id: userId,
    scheme_id: schemeId,
    scheme_name: schemeName,
    activity_type: activityType,
    status: status || undefined,
    created_at: now,
  };

  db.activities.unshift(newActivity);
  saveLocalDb(db);
  return newActivity;
}

export async function getUserSchemeActivities(userId: string): Promise<SchemeActivityItem[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("scheme_activity")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch activities error:", error);
      } else if (data) {
        return data as SchemeActivityItem[];
      }
    }
  }

  const db = getLocalDb();
  return db.activities
    .filter((a) => a.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function removeSchemeActivity(
  userId: string,
  schemeId: string,
  activityType: ActivityType
): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase
        .from("scheme_activity")
        .delete()
        .eq("user_id", userId)
        .eq("scheme_id", schemeId)
        .eq("activity_type", activityType);
      return;
    }
  }

  const db = getLocalDb();
  db.activities = db.activities.filter(
    (a) => !(a.user_id === userId && a.scheme_id === schemeId && a.activity_type === activityType)
  );
  saveLocalDb(db);
}
