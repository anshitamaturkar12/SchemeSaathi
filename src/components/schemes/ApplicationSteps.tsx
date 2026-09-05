"use client";

import React from "react";
import { ApplicationStep } from "@/types/scheme";
import { ExternalLink, ShieldCheck, Check } from "lucide-react";

interface ApplicationStepsProps {
  steps: ApplicationStep[];
  officialUrl: string;
  sourceName: string;
  isVerifiedOfficial?: boolean;
}

export default function ApplicationSteps({
  steps,
  officialUrl,
  sourceName,
  isVerifiedOfficial = true,
}: ApplicationStepsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-navy-900">
            Step-by-Step Application Guide
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow official procedures to submit your application directly without paying middlemen.
          </p>
        </div>

        {isVerifiedOfficial ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Official Portal</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span>Official Link Needs Verification</span>
          </span>
        )}
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.step} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-800 font-bold text-xs flex items-center justify-center shrink-0 border border-navy-200 mt-0.5 shadow-xs">
              {s.step}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                {s.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Official Link Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl">
        <div className="text-xs text-slate-600 text-center sm:text-left">
          <span className="font-semibold text-slate-800">Source: </span>
          <span>{sourceName}</span>
        </div>

        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
        >
          <span>Visit Official Portal</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
