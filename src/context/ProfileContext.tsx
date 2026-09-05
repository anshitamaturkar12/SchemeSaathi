"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { UserProfile, INITIAL_USER_PROFILE } from "@/types/profile";
import { SchemeMatchResult, Scheme } from "@/types/scheme";
import schemesDataRaw from "@/data/schemes.json";
import { evaluateAllSchemes } from "@/lib/eligibility/engine";

const allSchemes: Scheme[] = schemesDataRaw as unknown as Scheme[];

export const DEMO_PRESETS: Record<string, { label: string; profile: UserProfile }> = {
  farmer: {
    label: "🌾 Farmer (Maharashtra, ₹1.8L)",
    profile: {
      age: 42,
      gender: "male",
      socialCategory: "OBC",
      isDisability: false,
      state: "Maharashtra",
      district: "Nashik",
      residenceType: "rural",
      occupation: "farmer",
      annualIncome: 180000,
      isFarmer: true,
      landHoldingHectares: 1.5,
      isStudent: false,
      housingType: "pucca",
      familyMembersCount: 5,
      hasBankAadhaarLinked: true,
      goals: ["farming_support", "crop_insurance"],
    },
  },
  student: {
    label: "🎓 Student (EWS/OBC, ₹1.5L)",
    profile: {
      age: 21,
      gender: "female",
      socialCategory: "OBC",
      isDisability: false,
      state: "Maharashtra",
      district: "Pune",
      residenceType: "urban",
      occupation: "student",
      annualIncome: 150000,
      isFarmer: false,
      landHoldingHectares: 0,
      isStudent: true,
      educationLevel: "undergraduate",
      housingType: "rented",
      familyMembersCount: 4,
      hasBankAadhaarLinked: true,
      goals: ["higher_education", "skill_training"],
    },
  },
  street_vendor: {
    label: "🛒 Urban Street Vendor (₹1.2L)",
    profile: {
      age: 34,
      gender: "male",
      socialCategory: "SC",
      isDisability: false,
      state: "Maharashtra",
      district: "Mumbai",
      residenceType: "urban",
      occupation: "street_vendor",
      annualIncome: 120000,
      isFarmer: false,
      landHoldingHectares: 0,
      isStudent: false,
      housingType: "rented",
      familyMembersCount: 4,
      hasBankAadhaarLinked: true,
      goals: ["business_capital", "healthcare"],
    },
  },
  woman_empowerment: {
    label: "👩 Rural Woman / Homemaker (₹1.4L)",
    profile: {
      age: 32,
      gender: "female",
      socialCategory: "General",
      isDisability: false,
      state: "Maharashtra",
      district: "Kolhapur",
      residenceType: "rural",
      occupation: "homemaker",
      annualIncome: 140000,
      isFarmer: false,
      landHoldingHectares: 0,
      isStudent: false,
      housingType: "kutcha",
      familyMembersCount: 4,
      hasBankAadhaarLinked: true,
      goals: ["women_support", "housing", "healthcare"],
    },
  },
};

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
  loadPreset: (key: string) => void;
  matches: SchemeMatchResult[];
  strongMatches: SchemeMatchResult[];
  possibleMatches: SchemeMatchResult[];
  unlikelyMatches: SchemeMatchResult[];
  hasSubmitted: boolean;
  setHasSubmitted: (val: boolean) => void;
  allSchemes: Scheme[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("schemesathi_profile");
      const savedSubmitted = localStorage.getItem("schemesathi_submitted");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      if (savedSubmitted) {
        setHasSubmitted(savedSubmitted === "true");
      }
    } catch (e) {
      console.error("Failed loading profile from localStorage", e);
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("schemesathi_profile", JSON.stringify(updated));
      } catch (e) {
        console.error("Storage error", e);
      }
      return updated;
    });
  };

  const resetProfile = () => {
    setProfile(INITIAL_USER_PROFILE);
    setHasSubmitted(false);
    localStorage.removeItem("schemesathi_profile");
    localStorage.removeItem("schemesathi_submitted");
  };

  const loadPreset = (key: string) => {
    const preset = DEMO_PRESETS[key];
    if (preset) {
      setProfile(preset.profile);
      setHasSubmitted(true);
      localStorage.setItem("schemesathi_profile", JSON.stringify(preset.profile));
      localStorage.setItem("schemesathi_submitted", "true");
    }
  };

  const matches = useMemo(() => {
    return evaluateAllSchemes(allSchemes, profile);
  }, [profile]);

  const strongMatches = useMemo(() => matches.filter((m) => m.matchCategory === "strong"), [matches]);
  const possibleMatches = useMemo(() => matches.filter((m) => m.matchCategory === "possible"), [matches]);
  const unlikelyMatches = useMemo(() => matches.filter((m) => m.matchCategory === "unlikely"), [matches]);

  const handleSetHasSubmitted = (val: boolean) => {
    setHasSubmitted(val);
    localStorage.setItem("schemesathi_submitted", val ? "true" : "false");
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        loadPreset,
        matches,
        strongMatches,
        possibleMatches,
        unlikelyMatches,
        hasSubmitted,
        setHasSubmitted: handleSetHasSubmitted,
        allSchemes,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
