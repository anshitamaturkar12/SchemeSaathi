"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface QuestionCardProps {
  title: string;
  description?: string;
  whyAskThis?: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function QuestionCard({
  title,
  description,
  whyAskThis,
  required = false,
  children,
}: QuestionCardProps) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-3.5 transition-all hover:border-slate-300">
      <div className="flex items-start justify-between gap-2">
        <div>
          <label className="text-sm sm:text-base font-bold text-navy-950 block">
            {title} {required && <span className="text-rose-500">*</span>}
          </label>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {whyAskThis && (
          <button
            type="button"
            onClick={() => setShowWhy(!showWhy)}
            className="text-[11px] text-navy-600 hover:text-navy-800 flex items-center gap-1 font-medium shrink-0 bg-navy-50/60 px-2 py-1 rounded-lg transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Why ask this?</span>
            {showWhy ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {whyAskThis && showWhy && (
        <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 text-xs text-sky-900 leading-relaxed animate-in fade-in duration-150">
          <span className="font-semibold">Why this matters: </span>
          {whyAskThis}
        </div>
      )}

      <div className="pt-1">{children}</div>
    </div>
  );
}
