"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

interface EligibilityBreakdownProps {
  score: number;
  matchedCriteria: { label: string; reason: string }[];
  unmetCriteria: { label: string; reason: string }[];
  unknownCriteria: { label: string; reason: string }[];
  summaryExplanation?: string;
  compact?: boolean;
}

export default function EligibilityBreakdown({
  score,
  matchedCriteria,
  unmetCriteria,
  unknownCriteria,
  summaryExplanation,
  compact = false,
}: EligibilityBreakdownProps) {
  return (
    <div className="space-y-4">
      {/* Summary Banner */}
      {summaryExplanation && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <Info className="w-4 h-4 text-navy-600 shrink-0 mt-0.5" />
          <p>{summaryExplanation}</p>
        </div>
      )}

      {/* Criteria Breakdown Grid */}
      <div className="space-y-2.5">
        {/* Matched Criteria */}
        {matchedCriteria.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matched Requirements ({matchedCriteria.length})</span>
            </h4>
            <div className="space-y-1 pl-2 border-l-2 border-emerald-200">
              {matchedCriteria.map((c, idx) => (
                <div key={idx} className="text-xs py-1">
                  <span className="font-semibold text-slate-800">{c.label}: </span>
                  <span className="text-slate-600">{c.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unmet Criteria */}
        {unmetCriteria.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Unmet Criteria ({unmetCriteria.length})</span>
            </h4>
            <div className="space-y-1 pl-2 border-l-2 border-rose-200">
              {unmetCriteria.map((c, idx) => (
                <div key={idx} className="text-xs py-1">
                  <span className="font-semibold text-rose-900">{c.label}: </span>
                  <span className="text-slate-600">{c.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unknown Criteria (needs manual verification) */}
        {unknownCriteria.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Verify Upon Application ({unknownCriteria.length})</span>
            </h4>
            <div className="space-y-1 pl-2 border-l-2 border-amber-200">
              {unknownCriteria.map((c, idx) => (
                <div key={idx} className="text-xs py-1">
                  <span className="font-semibold text-amber-900">{c.label}: </span>
                  <span className="text-slate-600">{c.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 italic">
        * Match calculation based on transparent deterministic criteria matching against your profile.
      </p>
    </div>
  );
}
