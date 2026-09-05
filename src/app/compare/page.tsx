"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { evaluateScheme } from "@/lib/eligibility/engine";
import MatchBadge from "@/components/schemes/MatchBadge";
import { Scheme } from "@/types/scheme";
import {
  Scale,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  X,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");
  const { allSchemes, profile } = useProfile();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (idsParam) {
      const parsed = idsParam.split(",").filter(Boolean);
      if (parsed.length > 0) {
        setSelectedIds(parsed.slice(0, 3));
        return;
      }
    }
    // Default 2 schemes if none passed
    setSelectedIds(["pm-kisan", "pm-sym"]);
  }, [idsParam]);

  const selectedSchemes = selectedIds
    .map((id) => allSchemes.find((s) => s.id === id))
    .filter(Boolean) as Scheme[];

  const handleAddScheme = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setAiAdvice(null);
    }
  };

  const handleRemoveScheme = (id: string) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
    setAiAdvice(null);
  };

  const requestAiComparison = async () => {
    if (selectedSchemes.length < 2 || loadingAi) return;

    setLoadingAi(true);
    setAiAdvice(null);

    const profileSummary = `Age: ${profile.age || "N/A"}, Occupation: ${profile.occupation || "N/A"}, State: ${profile.state || "N/A"}, Income: ₹${profile.annualIncome?.toLocaleString("en-IN") || "N/A"}`;

    try {
      const res = await fetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemes: selectedSchemes,
          userProfileSummary: profileSummary,
        }),
      });

      const data = await res.json();
      setAiAdvice(data.comparisonAdvice);
    } catch (e) {
      console.error(e);
      setAiAdvice("Unable to generate comparison advice right now.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
            <Scale className="w-3.5 h-3.5 text-navy-700" />
            <span>Side-by-Side Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Compare Welfare Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare eligibility requirements, cash entitlements, documents, and application steps.
          </p>
        </div>

        {/* AI Compare Button */}
        {selectedSchemes.length >= 2 && (
          <button
            onClick={requestAiComparison}
            disabled={loadingAi}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loadingAi ? "Analyzing with AI..." : "Which One Should I Choose?"}</span>
          </button>
        )}
      </div>

      {/* Scheme Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          Comparing ({selectedSchemes.length} of 3):
        </span>

        {selectedSchemes.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-50 border border-navy-200 text-xs font-bold text-navy-900"
          >
            <span>{s.shortName}</span>
            <button
              onClick={() => handleRemoveScheme(s.id)}
              className="text-slate-400 hover:text-navy-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}

        {selectedSchemes.length < 3 && (
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddScheme(e.target.value);
                e.target.value = "";
              }
            }}
            defaultValue=""
            className="px-3 py-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none"
          >
            <option value="" disabled>
              + Add scheme to compare...
            </option>
            {allSchemes
              .filter((s) => !selectedIds.includes(s.id))
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName} ({s.category})
                </option>
              ))}
          </select>
        )}
      </div>

      {/* AI Comparison Advice Banner */}
      {aiAdvice && (
        <div className="bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50 rounded-2xl border border-sky-200 p-6 shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-navy-900">
            <div className="w-7 h-7 rounded-lg bg-navy-800 text-sky-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold">
              SchemeSathi AI Recommendation & Trade-off Analysis
            </h3>
          </div>

          <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none">
            {aiAdvice}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {selectedSchemes.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/4">
                    Comparison Attribute
                  </th>
                  {selectedSchemes.map((s) => {
                    const match = evaluateScheme(s, profile);
                    return (
                      <th key={s.id} className="p-5 w-1/3 align-top border-l border-slate-200">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                            {s.governmentLevel} Scheme
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-navy-950">
                            {s.name}
                          </h3>
                          <MatchBadge score={match.score} category={match.matchCategory} size="sm" />
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {/* Row 1: Key Benefit */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/50">
                    Primary Benefit
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-100 font-semibold text-emerald-800">
                      {s.keyBenefitBadge}
                    </td>
                  ))}
                </tr>

                {/* Row 2: Category & Sector */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/50">
                    Category
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-100">
                      {s.category}
                    </td>
                  ))}
                </tr>

                {/* Row 3: Target Beneficiaries */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/50">
                    Who Can Benefit?
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-100 leading-relaxed text-xs text-slate-600">
                      {s.whoCanBenefit}
                    </td>
                  ))}
                </tr>

                {/* Row 4: Key Criteria Rules */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/50">
                    Key Criteria
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-100 space-y-1 text-xs">
                      {s.eligibilityCriteria.map((c, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-navy-600 shrink-0 mt-0.5" />
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>

                {/* Row 5: Required Documents */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/50">
                    Required Documents
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-100 space-y-1 text-xs">
                      {s.documents.slice(0, 4).map((doc, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>

                {/* Row 6: Application Mode */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/50">
                    Application Mode
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-100 text-xs font-medium">
                      Direct online registration via {s.sourceName.split(",")[0]}
                    </td>
                  ))}
                </tr>

                {/* Row 7: Action Links */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/50">
                    Direct Actions
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-100 space-y-2">
                      <Link
                        href={`/schemes/${s.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition-colors"
                      >
                        <span>Full Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <div>
                        <a
                          href={s.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-sky-700 hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-sm text-slate-500">
            Please select at least one scheme to view comparison.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-navy-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading comparison table...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
