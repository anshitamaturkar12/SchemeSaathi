"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  steps: { id: number; title: string; subtitle?: string }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full">
      {/* Mobile step label */}
      <div className="flex sm:hidden items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-slate-500 uppercase tracking-wider">
          Step {currentStep} of {steps.length}
        </span>
        <span className="font-bold text-navy-900">
          {steps[currentStep - 1]?.title}
        </span>
      </div>

      {/* Desktop Stepper Bar */}
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0" />
        
        {/* Active Connecting Line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-navy-800 rounded-full transition-all duration-300 z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((s) => {
          const isCompleted = s.id < currentStep;
          const isCurrent = s.id === currentStep;

          return (
            <button
              key={s.id}
              type="button"
              disabled={!isCompleted && !isCurrent}
              onClick={() => onStepClick && isCompleted && onStepClick(s.id)}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                  isCompleted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : isCurrent
                    ? "bg-navy-800 text-white ring-4 ring-navy-100 scale-110"
                    : "bg-white text-slate-400 border-2 border-slate-300"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 text-white" /> : s.id}
              </div>

              <span
                className={`hidden md:block absolute -bottom-6 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  isCurrent
                    ? "text-navy-900 font-bold"
                    : isCompleted
                    ? "text-slate-700"
                    : "text-slate-400"
                }`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
