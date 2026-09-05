"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import SchemeCard from "@/components/schemes/SchemeCard";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  RefreshCw,
  Bot,
  Scale,
  Building2,
  FileCheck,
} from "lucide-react";
import { MatchCategory } from "@/types/scheme";

export default function ResultsPage() {
  const { matches, strongMatches, possibleMatches, unlikelyMatches, profile, allSchemes } = useProfile();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<"all" | MatchCategory>("all");
  const [compareList, setCompareList] = useState<string[]>([]);

  const filteredMatches =
    selectedCategory === "all"
      ? matches
      : matches.filter((m) => m.matchCategory === selectedCategory);

  const toggleCompare = (schemeId: string) => {
    setCompareList((prev) =>
      prev.includes(schemeId)
        ? prev.filter((id) => id !== schemeId)
        : prev.length < 3
        ? [...prev, schemeId]
        : prev
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Banner & Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Eligibility Rules Engine Analysis Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Your Personalized Scheme Matches
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Based on your profile as a{" "}
              <strong className="text-navy-900">
                {profile.occupation ? profile.occupation.replace(/_/g, " ") : "citizen"}
              </strong>{" "}
              in <strong className="text-navy-900">{profile.state || "India"}</strong> with reported family income of{" "}
              <strong className="text-navy-900">
                ₹{profile.annualIncome ? profile.annualIncome.toLocaleString("en-IN") : "N/A"}/yr
              </strong>
              .
            </p>
          </div>

          {/* Quick Action Links */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/find"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Info</span>
            </Link>

            <Link
              href="/assistant"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-navy-800 hover:bg-navy-900 rounded-xl shadow-xs transition-colors"
            >
              <Bot className="w-4 h-4 text-sky-300" />
              <span>Ask SchemeSathi AI</span>
            </Link>
          </div>
        </div>

        {/* 4 Summary Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Analyzed
            </span>
            <span className="text-xl sm:text-2xl font-black text-navy-950 mt-1 block">
              {allSchemes.length} Schemes
            </span>
            <span className="text-[11px] text-slate-400">Central & State Portals</span>
          </div>

          <button
            onClick={() => setSelectedCategory("strong")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedCategory === "strong"
                ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400"
                : "bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strong Matches</span>
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 block">
              {strongMatches.length}
            </span>
            <span className="text-[11px] text-emerald-700">75% - 100% Match</span>
          </button>

          <button
            onClick={() => setSelectedCategory("possible")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedCategory === "possible"
                ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400"
                : "bg-amber-50/50 border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Possible Matches</span>
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-950 mt-1 block">
              {possibleMatches.length}
            </span>
            <span className="text-[11px] text-amber-700">Needs Verification</span>
          </button>

          <button
            onClick={() => setSelectedCategory("unlikely")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedCategory === "unlikely"
                ? "bg-slate-100 border-slate-300 ring-2 ring-slate-400"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Currently Unlikely</span>
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
              {unlikelyMatches.length}
            </span>
            <span className="text-[11px] text-slate-400">Criteria Unmet</span>
          </button>
        </div>

        {/* Disclaimer Reminder */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
          <span>
            * Clearly labeled as <strong className="text-slate-700">Potential Match</strong>. Final eligibility is determined by official authorities upon formal verification.
          </span>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-xs text-navy-800 hover:underline font-semibold"
            >
              Show all ({matches.length})
            </button>
          )}
        </div>
      </div>

      {/* Compare Floating Bar (if user selected schemes to compare) */}
      {compareList.length > 0 && (
        <div className="sticky top-20 z-30 bg-navy-950 text-white rounded-2xl p-4 shadow-xl border border-navy-800 flex items-center justify-between flex-wrap gap-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-sky-300" />
            <span className="text-xs sm:text-sm font-semibold">
              {compareList.length} of 3 schemes selected for comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <Link
              href={`/compare?ids=${compareList.join(",")}`}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-navy-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              <span>Compare Now</span>
              <Scale className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Scheme Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-950">
            {selectedCategory === "strong"
              ? "Strong Matches (High Likelihood)"
              : selectedCategory === "possible"
              ? "Possible Matches (Review Documents)"
              : selectedCategory === "unlikely"
              ? "Currently Unlikely Programs"
              : "All Evaluated Schemes"}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredMatches.length} results
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <SchemeCard
              key={match.scheme.id}
              matchResult={match}
              showComparisonOption
              isSelectedForCompare={compareList.includes(match.scheme.id)}
              onToggleCompare={() => toggleCompare(match.scheme.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
