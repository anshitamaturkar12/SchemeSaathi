"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { useSavedSchemes } from "@/context/SavedSchemesContext";
import { useAuth } from "@/context/AuthContext";
import AuthPromptModal from "@/components/auth/AuthPromptModal";
import { evaluateScheme } from "@/lib/eligibility/engine";
import MatchBadge from "@/components/schemes/MatchBadge";
import EligibilityBreakdown from "@/components/schemes/EligibilityBreakdown";
import DocumentChecklist from "@/components/schemes/DocumentChecklist";
import ApplicationSteps from "@/components/schemes/ApplicationSteps";
import AIExplainModal from "@/components/ai/AIExplainModal";
import SchemeCard from "@/components/schemes/SchemeCard";
import {
  ArrowLeft,
  Sparkles,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  Info,
} from "lucide-react";

export default function SchemeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { allSchemes, profile } = useProfile();
  const { isSaved, toggleSave } = useSavedSchemes();
  const { user, recordActivity, removeActivity, isSavedScheme, isAppliedScheme } = useAuth();

  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalAction, setAuthModalAction] = useState<"save" | "apply">("save");

  const scheme = allSchemes.find((s) => s.id === id);

  // Track scheme view when user is logged in
  useEffect(() => {
    if (scheme && user) {
      recordActivity(scheme.id, scheme.name, "VIEWED");
    }
  }, [scheme, user, recordActivity]);

  if (!scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-950">Scheme Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested welfare scheme does not exist or has been relocated.
        </p>
        <Link
          href="/schemes"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Schemes</span>
        </Link>
      </div>
    );
  }

  // Calculate dynamic match for this scheme against user profile
  const matchResult = evaluateScheme(scheme, profile);
  const bookmarked = isSaved(scheme.id) || (user ? isSavedScheme(scheme.id) : false);
  const applied = user ? isAppliedScheme(scheme.id) : false;

  // Similar schemes (same category or state)
  const similarSchemes = allSchemes
    .filter((s) => s.id !== scheme.id && (s.category === scheme.category || s.governmentLevel === scheme.governmentLevel))
    .slice(0, 3)
    .map((s) => evaluateScheme(s, profile));

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      setAuthModalAction("save");
      setAuthModalOpen(true);
      return;
    }
    const wasSaved = bookmarked;
    toggleSave(scheme.id);
    if (wasSaved) {
      removeActivity(scheme.id, "SAVED");
    } else {
      recordActivity(scheme.id, scheme.name, "SAVED", "interested");
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      setAuthModalAction("apply");
      setAuthModalOpen(true);
      return;
    }
    if (applied) {
      removeActivity(scheme.id, "APPLIED");
    } else {
      recordActivity(scheme.id, scheme.name, "APPLIED", "applied");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Schemes</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>

          <button
            onClick={handleSaveClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              bookmarked
                ? "bg-amber-50 text-amber-900 border-amber-300 font-bold"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
            <span>{bookmarked ? "Saved in Bookmarks" : "Save Scheme"}</span>
          </button>

          <button
            onClick={handleApplyClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              applied
                ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
            title="Mark this scheme as applied in your personal tracker"
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${applied ? "text-emerald-600 fill-emerald-100" : "text-slate-400"}`} />
            <span>{applied ? "Marked as Applied" : "Mark as Applied"}</span>
          </button>
        </div>
      </div>


      {/* Main Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {scheme.category}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              scheme.governmentLevel === "Central"
                ? "bg-sky-50 text-sky-800 border-sky-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            {scheme.governmentLevel} Scheme
          </span>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{scheme.states.join(", ")}</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-navy-950 tracking-tight leading-snug">
            {scheme.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
            {scheme.tagline}
          </p>
        </div>

        {/* Match Highlight & AI Explainer Trigger */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MatchBadge score={matchResult.score} category={matchResult.matchCategory} size="lg" />
            <div>
              <span className="text-xs font-bold text-navy-950 block">
                Calculated Potential Match
              </span>
              <span className="text-[11px] text-slate-500">
                Transparent deterministic score based on your answers
              </span>
            </div>
          </div>

          <button
            onClick={() => setExplainModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Explain in Simple Language</span>
          </button>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Details, Breakdown, Documents, Steps */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Overview & Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-navy-950">
              Scheme Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {scheme.description}
            </p>
          </div>

          {/* Section 2: Key Benefits */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Key Benefits & Entitlements</span>
              </h2>
              <span className="text-xs font-extrabold text-navy-800 px-3 py-1 rounded-full bg-navy-50 border border-navy-200">
                {scheme.keyBenefitBadge}
              </span>
            </div>

            <ul className="space-y-2.5">
              {scheme.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Personalized Eligibility Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-navy-700" />
              <span>Why This Matches You (Eligibility Check)</span>
            </h2>

            <EligibilityBreakdown
              score={matchResult.score}
              matchedCriteria={matchResult.matchedCriteria}
              unmetCriteria={matchResult.unmetCriteria}
              unknownCriteria={matchResult.unknownCriteria}
              summaryExplanation={matchResult.summaryExplanation}
            />
          </div>

          {/* Section 4: Required Documents (Interactive Checklist) */}
          <DocumentChecklist documents={scheme.documents} schemeName={scheme.name} />

          {/* Section 5: Step-by-Step Application */}
          <ApplicationSteps
            steps={scheme.applicationSteps}
            officialUrl={scheme.officialUrl}
            sourceName={scheme.sourceName}
            isVerifiedOfficial={scheme.isVerifiedOfficial}
          />
        </div>

        {/* Right Column (1 col): Quick Facts, Important Notes, Source Badge */}
        <div className="space-y-6">
          {/* Quick Facts Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-slate-100 pb-2">
              Quick Facts
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Government Level:</span>
                <span className="font-semibold text-slate-800">{scheme.governmentLevel} Sector Scheme</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Jurisdiction / States:</span>
                <span className="font-semibold text-slate-800">{scheme.states.join(", ")}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Nodal Authority:</span>
                <span className="font-semibold text-slate-800">{scheme.sourceName}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Last Verified:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{scheme.lastVerified}</span>
                </span>
              </div>
            </div>

            {/* Official Source Safety Assurance */}
            <div className="pt-3 border-t border-slate-100">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Open Official Application Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-400 block text-center mt-2">
                🔒 Direct verified link to {new URL(scheme.officialUrl).hostname}
              </span>
            </div>
          </div>

          {/* Who Can Benefit Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
              Who Can Benefit?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {scheme.whoCanBenefit}
            </p>
          </div>

          {/* Important Things to Know */}
          {scheme.importantNotes && scheme.importantNotes.length > 0 && (
            <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-5 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Important Things to Know</span>
              </h3>
              <ul className="space-y-2 text-xs text-amber-900">
                {scheme.importantNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Assistance CTA Box */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-sky-300">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Have Scheme Questions?
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask our grounded AI about eligibility nuances, local office forms, or document exceptions.
            </p>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white underline pt-1"
            >
              <span>Chat with SchemeSathi Assistant →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Schemes Section */}
      {similarSchemes.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-navy-950">
              Similar Welfare Schemes
            </h2>
            <p className="text-xs text-slate-500">
              Other related programs in {scheme.category} or {scheme.governmentLevel} government category.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarSchemes.map((sim) => (
              <SchemeCard key={sim.scheme.id} matchResult={sim} />
            ))}
          </div>
        </div>
      )}

      {/* AI Explanation Modal */}
      <AIExplainModal
        scheme={scheme}
        isOpen={explainModalOpen}
        onClose={() => setExplainModalOpen(false)}
      />

      {/* Auth Prompt Modal for Guests */}
      <AuthPromptModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        actionType={authModalAction}
      />
    </div>
  );
}

