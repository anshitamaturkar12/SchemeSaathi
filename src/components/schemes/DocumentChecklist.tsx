"use client";

import React, { useState } from "react";
import { CheckSquare, Square, FileText, Sparkles } from "lucide-react";

interface DocumentChecklistProps {
  documents: string[];
  schemeName?: string;
}

export default function DocumentChecklist({ documents, schemeName }: DocumentChecklistProps) {
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  const toggleDoc = (index: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const total = documents.length;
  const readyCount = Object.values(checkedDocs).filter(Boolean).length;
  const percentage = total > 0 ? Math.round((readyCount / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-navy-700" />
            <span>Required Documents Checklist</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Check off documents you currently hold ready for submission.
          </p>
        </div>

        {/* Readiness Meter */}
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500 block">
            Readiness
          </span>
          <span className={`text-sm font-bold ${percentage === 100 ? "text-emerald-600" : "text-navy-800"}`}>
            {readyCount} / {total} ({percentage}%)
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            percentage === 100 ? "bg-emerald-500" : "bg-navy-600"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1">
        {documents.map((doc, idx) => {
          const isChecked = !!checkedDocs[idx];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleDoc(idx)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                isChecked
                  ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                  : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 text-slate-700"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <span className={`text-xs sm:text-sm font-medium leading-relaxed ${isChecked ? "line-through text-slate-500" : ""}`}>
                {doc}
              </span>
            </button>
          );
        })}
      </div>

      {percentage === 100 && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>You have all necessary documents ready for application!</span>
        </div>
      )}
    </div>
  );
}
