"use client";

import React from "react";
import { MatchCategory } from "@/types/scheme";
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MatchBadgeProps {
  score: number;
  category: MatchCategory;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function MatchBadge({
  score,
  category,
  showScore = true,
  size = "md",
}: MatchBadgeProps) {
  const { t } = useLanguage();

  const configs = {
    strong: {
      label: t("strongMatch"),
      bgColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dotColor: "bg-emerald-500",
      icon: CheckCircle2,
      progressColor: "bg-emerald-500",
    },
    possible: {
      label: t("possibleMatch"),
      bgColor: "bg-amber-50 text-amber-800 border-amber-200",
      dotColor: "bg-amber-500",
      icon: AlertCircle,
      progressColor: "bg-amber-500",
    },
    unlikely: {
      label: t("unlikelyMatch"),
      bgColor: "bg-slate-100 text-slate-700 border-slate-200",
      dotColor: "bg-slate-400",
      icon: HelpCircle,
      progressColor: "bg-slate-400",
    },
  };

  const current = configs[category] || configs.possible;
  const Icon = current.icon;

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2",
  };

  return (
    <div
      className={`inline-flex items-center font-semibold rounded-full border shadow-xs ${current.bgColor} ${sizeClasses[size]}`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />
      <span>{current.label}</span>
      {showScore && (
        <span className="opacity-90 font-bold ml-0.5">
          ({score}%)
        </span>
      )}
    </div>
  );
}
