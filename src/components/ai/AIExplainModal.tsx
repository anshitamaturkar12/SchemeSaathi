"use client";

import React, { useState } from "react";
import { Scheme } from "@/types/scheme";
import { Sparkles, X, Globe, Copy, Check } from "lucide-react";

interface AIExplainModalProps {
  scheme: Scheme;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIExplainModal({ scheme, isOpen, onClose }: AIExplainModalProps) {
  const [targetLang, setTargetLang] = useState<"English" | "Hindi" | "Marathi">("English");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fetchExplanation = async (lang: "English" | "Hindi" | "Marathi") => {
    setTargetLang(lang);
    setLoading(true);
    setExplanation(null);

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeName: scheme.name,
          schemeDetails: `${scheme.tagline}. Description: ${scheme.description}. Benefits: ${scheme.benefits.join("; ")}. Eligibility: ${scheme.whoCanBenefit}. Documents: ${scheme.documents.join(", ")}`,
          targetLanguage: lang,
        }),
      });

      const data = await res.json();
      setExplanation(data.explanation);
    } catch (e) {
      console.error(e);
      setExplanation("Could not generate simplified explanation right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (explanation && navigator.clipboard) {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-navy-900 to-navy-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                AI Simplified Explanation
              </h3>
              <p className="text-xs text-slate-300 truncate max-w-sm">
                {scheme.shortName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-navy-600" />
            <span>Select Explanation Language:</span>
          </span>

          <div className="flex items-center gap-1.5">
            {(["English", "Hindi", "Marathi"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => fetchExplanation(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  targetLang === lang
                    ? "bg-navy-800 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {lang === "Hindi" ? "हिंदी (Hindi)" : lang === "Marathi" ? "मराठी (Marathi)" : "English"}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {!explanation && !loading && (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-navy-950">
                Understand in Plain, Citizen-Friendly Language
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click your preferred language above to simplify official jargon, understand who qualifies, and see the exact steps.
              </p>
              <button
                onClick={() => fetchExplanation(targetLang)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-white font-semibold text-xs shadow-sm hover:bg-navy-900 transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Explain in {targetLang}</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-navy-700 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Generating simplified {targetLang} explanation using Gemini AI...
              </p>
            </div>
          )}

          {explanation && !loading && (
            <div className="whitespace-pre-line prose prose-sm max-w-none prose-headings:text-navy-900 prose-headings:font-bold prose-p:leading-relaxed">
              {explanation}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopy}
            disabled={!explanation}
            className="text-xs font-semibold text-slate-600 hover:text-navy-900 inline-flex items-center gap-1.5 disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied to clipboard!" : "Copy Explanation"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
