"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scheme, SchemeMatchResult } from "@/types/scheme";
import MatchBadge from "./MatchBadge";
import { useSavedSchemes } from "@/context/SavedSchemesContext";
import { useAuth } from "@/context/AuthContext";
import AuthPromptModal from "@/components/auth/AuthPromptModal";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  Share2,
} from "lucide-react";
import EligibilityBreakdown from "./EligibilityBreakdown";

interface SchemeCardProps {
  matchResult: SchemeMatchResult;
  showComparisonOption?: boolean;
  isSelectedForCompare?: boolean;
  onToggleCompare?: () => void;
}

export default function SchemeCard({
  matchResult,
  showComparisonOption = false,
  isSelectedForCompare = false,
  onToggleCompare,
}: SchemeCardProps) {
  const { scheme, score, matchCategory, matchedCriteria, unmetCriteria, unknownCriteria, summaryExplanation } =
    matchResult;
  const { isSaved, toggleSave } = useSavedSchemes();
  const { user, recordActivity, removeActivity, isSavedScheme } = useAuth();
  const [showExplanation, setShowExplanation] = useState(false);
  const [copied, setCopied] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const bookmarked = isSaved(scheme.id) || (user ? isSavedScheme(scheme.id) : false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const wasBookmarked = bookmarked;
    toggleSave(scheme.id);
    if (wasBookmarked) {
      removeActivity(scheme.id, "SAVED");
    } else {
      recordActivity(scheme.id, scheme.name, "SAVED", "interested");
    }
  };


  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/schemes/${scheme.id}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Card Header & Badges */}
      <div className="p-5 sm:p-6 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
              {scheme.category}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                scheme.governmentLevel === "Central"
                  ? "bg-sky-50 text-sky-800 border-sky-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              {scheme.governmentLevel} Scheme
            </span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleShare}
              title="Copy share link"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Share scheme"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleBookmarkClick}
              title={bookmarked ? "Remove from saved" : "Save scheme"}
              className={`p-2 rounded-xl transition-all ${
                bookmarked
                  ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                  : "text-slate-400 hover:text-navy-900 hover:bg-slate-100"
              }`}
              aria-label="Bookmark scheme"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Title and Tagline */}
        <div>
          <Link href={`/schemes/${scheme.id}`} className="group/title">
            <h3 className="text-base sm:text-lg font-bold text-navy-950 group-hover/title:text-navy-700 transition-colors leading-snug">
              {scheme.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {scheme.tagline}
          </p>
        </div>

        {/* Match Score & Badge */}
        <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
          <MatchBadge score={score} category={matchCategory} size="sm" />
          <span className="text-[11px] font-medium text-slate-400 italic">
            Potential Match Indicator
          </span>
        </div>

        {/* Key Benefit Highlight Box */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-navy-50/70 to-slate-50 border border-navy-100/60 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-navy-900 block">Key Benefit:</span>
            <span className="text-navy-800 font-bold">{scheme.keyBenefitBadge}</span>
          </div>
        </div>

        {/* Expandable "Why am I eligible?" */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between text-xs font-semibold text-navy-700 hover:text-navy-900 py-1.5 px-2 rounded-lg hover:bg-navy-50/60 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-navy-600" />
              <span>Why am I eligible?</span>
            </span>
            {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showExplanation && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in duration-150">
              <EligibilityBreakdown
                score={score}
                matchedCriteria={matchedCriteria}
                unmetCriteria={unmetCriteria}
                unknownCriteria={unknownCriteria}
                summaryExplanation={summaryExplanation}
                compact
              />
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 sm:px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        {showComparisonOption ? (
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 hover:text-navy-900 select-none">
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={onToggleCompare}
              className="rounded border-slate-300 text-navy-800 focus:ring-navy-600 w-4 h-4 cursor-pointer"
            />
            <span>Compare</span>
          </label>
        ) : (
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[140px]">{scheme.sourceName.split(",")[0]}</span>
          </span>
        )}

        <Link
          href={`/schemes/${scheme.id}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-navy-800 hover:text-navy-950 group-hover:translate-x-0.5 transition-all"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 text-navy-600" />
        </Link>
      </div>

      <AuthPromptModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionType="save"
      />
    </div>
  );
}

