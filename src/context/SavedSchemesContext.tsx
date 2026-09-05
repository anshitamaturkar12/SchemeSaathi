"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ApplicationStatus, SavedSchemeItem } from "@/types/scheme";

interface SavedSchemesContextType {
  savedItems: SavedSchemeItem[];
  isSaved: (schemeId: string) => boolean;
  toggleSave: (schemeId: string) => void;
  updateStatus: (schemeId: string, status: ApplicationStatus) => void;
  updateNotes: (schemeId: string, notes: string) => void;
  count: number;
  statusCounts: Record<ApplicationStatus, number>;
}

const SavedSchemesContext = createContext<SavedSchemesContextType | undefined>(undefined);

export function SavedSchemesProvider({ children }: { children: React.ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedSchemeItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("schemesathi_saved_schemes");
      if (stored) {
        setSavedItems(JSON.parse(stored));
      } else {
        // Initial friendly defaults for demo
        const initialDemo: SavedSchemeItem[] = [
          { schemeId: "pm-kisan", savedAt: new Date().toISOString(), status: "interested" },
          { schemeId: "pmjay", savedAt: new Date().toISOString(), status: "documents_needed" },
        ];
        setSavedItems(initialDemo);
        localStorage.setItem("schemesathi_saved_schemes", JSON.stringify(initialDemo));
      }
    } catch (e) {
      console.error("Failed loading saved schemes", e);
    }
  }, []);

  const persist = (items: SavedSchemeItem[]) => {
    setSavedItems(items);
    try {
      localStorage.setItem("schemesathi_saved_schemes", JSON.stringify(items));
    } catch (e) {
      console.error("Failed saving schemes", e);
    }
  };

  const isSaved = (schemeId: string) => {
    return savedItems.some((item) => item.schemeId === schemeId);
  };

  const toggleSave = (schemeId: string) => {
    if (isSaved(schemeId)) {
      persist(savedItems.filter((item) => item.schemeId !== schemeId));
    } else {
      const newItem: SavedSchemeItem = {
        schemeId,
        savedAt: new Date().toISOString(),
        status: "interested",
      };
      persist([...savedItems, newItem]);
    }
  };

  const updateStatus = (schemeId: string, status: ApplicationStatus) => {
    persist(
      savedItems.map((item) => (item.schemeId === schemeId ? { ...item, status } : item))
    );
  };

  const updateNotes = (schemeId: string, notes: string) => {
    persist(
      savedItems.map((item) => (item.schemeId === schemeId ? { ...item, notes } : item))
    );
  };

  const statusCounts: Record<ApplicationStatus, number> = {
    interested: savedItems.filter((s) => s.status === "interested").length,
    documents_needed: savedItems.filter((s) => s.status === "documents_needed").length,
    ready_to_apply: savedItems.filter((s) => s.status === "ready_to_apply").length,
    applied: savedItems.filter((s) => s.status === "applied").length,
  };

  return (
    <SavedSchemesContext.Provider
      value={{
        savedItems,
        isSaved,
        toggleSave,
        updateStatus,
        updateNotes,
        count: savedItems.length,
        statusCounts,
      }}
    >
      {children}
    </SavedSchemesContext.Provider>
  );
}

export function useSavedSchemes() {
  const context = useContext(SavedSchemesContext);
  if (!context) {
    throw new Error("useSavedSchemes must be used within a SavedSchemesProvider");
  }
  return context;
}
