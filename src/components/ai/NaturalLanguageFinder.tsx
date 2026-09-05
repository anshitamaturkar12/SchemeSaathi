"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import { Sparkles, ArrowRight, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { evaluateAllSchemes } from "@/lib/eligibility/engine";
import { SchemeMatchResult } from "@/types/scheme";
import SchemeCard from "@/components/schemes/SchemeCard";
import { UserProfile } from "@/types/profile";

const SAMPLE_QUERIES = [
  "I am a 21 year old student from Maharashtra and my family income is below 3 lakh. What government schemes can help me?",
  "I am a farmer from Maharashtra with 1.5 hectare land and 2 lakh income.",
  "I am a 32 year old woman from Maharashtra with family income of 1.5 lakh.",
  "I am an urban street vendor looking for a low-interest loan to expand my business.",
];

export default function NaturalLanguageFinder() {
  const router = useRouter();
  const { allSchemes, updateProfile, setHasSubmitted } = useProfile();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedProfile, setParsedProfile] = useState<Partial<UserProfile> | null>(null);
  const [understandingSummary, setUnderstandingSummary] = useState<string>("");
  const [results, setResults] = useState<SchemeMatchResult[] | null>(null);

  const handleSearch = async (text?: string) => {
    const searchTarget = (text || query).trim();
    if (!searchTarget || loading) return;

    setLoading(true);
    setParsedProfile(null);
    setResults(null);

    try {
      const res = await fetch("/api/ai/parse-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTarget }),
      });

      const data = await res.json();
      if (data.success && data.extractedProfile) {
        const extracted = data.extractedProfile;
        setParsedProfile(extracted);
        setUnderstandingSummary(data.understandingSummary || "Extracted your key eligibility factors.");

        // Create a merged profile to test against the deterministic rules engine
        const testProfile: UserProfile = {
          age: extracted.age ?? 25,
          gender: extracted.gender ?? "all",
          socialCategory: extracted.socialCategory ?? "General",
          state: extracted.state ?? "All India",
          occupation: extracted.occupation ?? "other",
          annualIncome: extracted.annualIncome ?? 200000,
          isFarmer: extracted.isFarmer ?? (extracted.occupation === "farmer"),
          isStudent: extracted.isStudent ?? (extracted.occupation === "student"),
          housingType: extracted.housingType ?? "pucca",
          goals: [],
        };

        const matches = evaluateAllSchemes(allSchemes, testProfile);
        setResults(matches);
      }
    } catch (err) {
      console.error("Failed to parse natural language intent", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToProfile = () => {
    if (!parsedProfile) return;
    updateProfile(parsedProfile);
    setHasSubmitted(true);
    router.push("/find/results");
  };

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-navy-800">
          <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center text-navy-800">
            <Sparkles className="w-4 h-4 text-navy-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-navy-950">
              Natural Language Scheme Finder
            </h2>
            <p className="text-xs text-slate-500">
              Describe your situation in plain English or Hindi. AI extracts your criteria and our rules engine matches eligible schemes.
            </p>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I am a 21 year old student from Maharashtra and my family income is below 3 lakh. What government schemes can help me?"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition-all placeholder:text-slate-400 resize-none leading-relaxed"
          />
        </div>

        {/* Action Button & Sample Queries */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Sample prompts:
            </span>
            {SAMPLE_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(sample);
                  handleSearch(sample);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-navy-50 text-slate-600 hover:text-navy-900 border border-slate-200 transition-colors"
              >
                Prompt {idx + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-navy-800 hover:bg-navy-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Criteria...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Find Schemes With AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Extraction Display: "Here's what I understood" */}
      {parsedProfile && (
        <div className="bg-gradient-to-r from-sky-50 to-navy-50 rounded-2xl border border-sky-200/80 p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sky-700" />
              <h3 className="text-sm font-bold text-navy-950">
                Here&apos;s What SchemeSathi AI Understood:
              </h3>
            </div>

            <button
              onClick={handleApplyToProfile}
              className="text-xs font-semibold text-navy-800 hover:text-navy-950 inline-flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-navy-200 shadow-xs hover:shadow-sm transition-all"
            >
              <span>Save To My Profile & View Full Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Extracted Entity Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {parsedProfile.age && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700">
                <span className="text-slate-400 font-normal">Age:</span>
                <strong className="text-navy-900">{parsedProfile.age} years</strong>
              </span>
            )}

            {parsedProfile.state && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700">
                <span className="text-slate-400 font-normal">State:</span>
                <strong className="text-navy-900">{parsedProfile.state}</strong>
              </span>
            )}

            {parsedProfile.occupation && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700">
                <span className="text-slate-400 font-normal">Occupation:</span>
                <strong className="text-navy-900 capitalize">
                  {parsedProfile.occupation.replace(/_/g, " ")}
                </strong>
              </span>
            )}

            {parsedProfile.annualIncome !== undefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700">
                <span className="text-slate-400 font-normal">Income:</span>
                <strong className="text-navy-900">
                  ₹{parsedProfile.annualIncome.toLocaleString("en-IN")} / year
                </strong>
              </span>
            )}

            {parsedProfile.socialCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700">
                <span className="text-slate-400 font-normal">Category:</span>
                <strong className="text-navy-900">{parsedProfile.socialCategory}</strong>
              </span>
            )}

            {parsedProfile.gender && parsedProfile.gender !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700">
                <span className="text-slate-400 font-normal">Gender:</span>
                <strong className="text-navy-900 capitalize">{parsedProfile.gender}</strong>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600">
            {understandingSummary}
          </p>
        </div>
      )}

      {/* Matched Schemes List */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-navy-950">
                Potential Matches ({results.filter((r) => r.score >= 50).length} Relevant)
              </h3>
              <p className="text-xs text-slate-500">
                Computed via deterministic rules matching against your parsed criteria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.slice(0, 6).map((match) => (
              <SchemeCard key={match.scheme.id} matchResult={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
