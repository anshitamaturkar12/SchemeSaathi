"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthUser, UserProfileData, SchemeActivityItem, ActivityType } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfileData | null;
  isLoading: boolean;
  activities: SchemeActivityItem[];
  login: (credential: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    full_name: string;
    email: string;
    username: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfileData>) => Promise<{ success: boolean; error?: string }>;
  recordActivity: (
    scheme_id: string,
    scheme_name: string,
    activity_type: ActivityType,
    status?: string
  ) => Promise<void>;
  removeActivity: (scheme_id: string, activity_type: ActivityType) => Promise<void>;
  refreshActivities: () => Promise<void>;
  isSavedScheme: (scheme_id: string) => boolean;
  isAppliedScheme: (scheme_id: string) => boolean;
  savedActivities: SchemeActivityItem[];
  appliedActivities: SchemeActivityItem[];
  viewedActivities: SchemeActivityItem[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [activities, setActivities] = useState<SchemeActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await fetch("/api/user/activity");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.activities)) {
          setActivities(data.activities);
        }
      }
    } catch (e) {
      console.error("Failed to fetch activities:", e);
    }
  }, []);

  // Initialize session on page load
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setProfile(data.profile);
            await fetchActivities();
          } else {
            setUser(null);
            setProfile(null);
            setActivities([]);
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, [fetchActivities]);

  const login = async (credential: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Login failed." };
      }
      setUser(data.user);
      setProfile(data.profile);
      await fetchActivities();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error. Please try again." };
    }
  };

  const register = async (formData: {
    full_name: string;
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Registration failed." };
      }
      setUser(data.user);
      setProfile(data.profile);
      await fetchActivities();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout request error:", e);
    } finally {
      setUser(null);
      setProfile(null);
      setActivities([]);
    }
  };

  const updateProfile = async (updates: Partial<UserProfileData>) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Update failed." };
      }
      setProfile(data.profile);
      if (data.profile.full_name && user) {
        setUser({ ...user, full_name: data.profile.full_name });
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error. Please try again." };
    }
  };

  const recordActivity = async (
    scheme_id: string,
    scheme_name: string,
    activity_type: ActivityType,
    status?: string
  ) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheme_id, scheme_name, activity_type, status }),
      });
      if (res.ok) {
        await fetchActivities();
      }
    } catch (err) {
      console.error("Record activity error:", err);
    }
  };

  const removeActivity = async (scheme_id: string, activity_type: ActivityType) => {
    if (!user) return;
    try {
      const res = await fetch(
        `/api/user/activity?scheme_id=${encodeURIComponent(scheme_id)}&activity_type=${encodeURIComponent(
          activity_type
        )}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await fetchActivities();
      }
    } catch (err) {
      console.error("Remove activity error:", err);
    }
  };

  const isSavedScheme = (scheme_id: string) => {
    return activities.some((a) => a.scheme_id === scheme_id && a.activity_type === "SAVED");
  };

  const isAppliedScheme = (scheme_id: string) => {
    return activities.some((a) => a.scheme_id === scheme_id && a.activity_type === "APPLIED");
  };

  const savedActivities = activities.filter((a) => a.activity_type === "SAVED");
  const appliedActivities = activities.filter((a) => a.activity_type === "APPLIED");
  const viewedActivities = activities.filter((a) => a.activity_type === "VIEWED");

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        activities,
        login,
        register,
        logout,
        updateProfile,
        recordActivity,
        removeActivity,
        refreshActivities: fetchActivities,
        isSavedScheme,
        isAppliedScheme,
        savedActivities,
        appliedActivities,
        viewedActivities,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
