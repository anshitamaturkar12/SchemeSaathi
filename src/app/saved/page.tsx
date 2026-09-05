"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSavedSchemes } from "@/context/SavedSchemesContext";
import { useProfile } from "@/context/ProfileContext";
import { evaluateScheme } from "@/lib/eligibility/engine";
import MatchBadge from "@/components/schemes/MatchBadge";
import { ApplicationStatus } from "@/types/scheme";
import {
  Bookmark,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ArrowRight,
  Clock,
  FileText,
  Send,
  Sparkles,
} from "lucide-react";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "interested", label: "Interested", color: "bg-blue-50 text-blue-800 border-blue-200" },
  {
    value: "documents_needed",
    label: "Documents Needed",
    color: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    value: "ready_to_apply",
    label: "Ready to Apply",
    color: "bg-purple-50 text-purple-800 border-purple-200",
  },
  { value: "applied", label: "Applied", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
];

export default function SavedSchemesPage() {
  const { savedItems, toggleSave, updateStatus, updateNotes, count, statusCounts } =
    useSavedSchemes();
  const { allSchemes, profile } = useProfile();
  const [filterStatus, setFilterStatus] = useState<"all" | ApplicationStatus>("all");

  const filteredItems =
    filterStatus === "all"
      ? savedItems
      : savedItems.filter((item) => item.status === filterStatus);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5 text-navy-700" />
            <span>Application Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            Saved Schemes & Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your shortlisted welfare benefits through the 4 application lifecycle stages.
          </p>
        </div>

        <Link
          href="/schemes"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors self-start sm:self-auto"
        >
          <span>Find More Schemes</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Application Status Stage Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUS_OPTIONS.map((st) => (
          <button
            key={st.value}
            onClick={() =>
              setFilterStatus(filterStatus === st.value ? "all" : st.value)
            }
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterStatus === st.value
                ? "ring-2 ring-navy-800 bg-white shadow-md border-navy-300"
                : "bg-white hover:bg-slate-50 border-slate-200 shadow-xs"
            }`}
          >
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              {st.label}
            </span>
            <span className="text-xl sm:text-2xl font-black text-navy-950 mt-1 block">
              {statusCounts[st.value]}
            </span>
          </button>
        ))}
      </div>

      {/* List of Saved Schemes */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((saved) => {
            const scheme = allSchemes.find((s) => s.id === saved.schemeId);
            if (!scheme) return null;
            const match = evaluateScheme(scheme, profile);

            return (
              <div
                key={saved.schemeId}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {scheme.category}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                        {scheme.governmentLevel} Scheme
                      </span>
                      <MatchBadge score={match.score} category={match.matchCategory} size="sm" />
                    </div>

                    <Link href={`/schemes/${scheme.id}`}>
                      <h3 className="text-base sm:text-lg font-bold text-navy-950 hover:text-navy-700 transition-colors">
                        {scheme.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {scheme.tagline}
                    </p>
                  </div>

                  {/* Stage Dropdown & Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Application Status:
                      </span>
                      <select
                        value={saved.status}
                        onChange={(e) =>
                          updateStatus(saved.schemeId, e.target.value as ApplicationStatus)
                        }
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-600"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => toggleSave(saved.schemeId)}
                      title="Remove from saved"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Benefit Banner */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-navy-900">Benefit: </span>
                    <span className="text-emerald-800 font-bold">{scheme.keyBenefitBadge}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/schemes/${scheme.id}`}
                      className="font-semibold text-navy-800 hover:underline flex items-center gap-1"
                    >
                      <span>Document Checklist ({scheme.documents.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sky-700 hover:underline flex items-center gap-1"
                    >
                      <span>Apply Online</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-950">
            No saved schemes yet
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click the bookmark icon on any scheme card to save it here and track your application progress.
          </p>
          <Link
            href="/schemes"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-navy-800 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition-colors"
          >
            <span>Explore Schemes</span>
          </Link>
        </div>
      )}
    </div>
  );
}
