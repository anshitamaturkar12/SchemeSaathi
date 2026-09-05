"use client";

import React from "react";
import { UserProfile } from "@/types/profile";
import { Edit3, CheckCircle2, ShieldAlert } from "lucide-react";

interface ReviewStepProps {
  profile: UserProfile;
  onEditStep: (step: number) => void;
}

export default function ReviewStep({ profile, onEditStep }: ReviewStepProps) {
  const sections = [
    {
      title: "About You",
      step: 1,
      items: [
        { label: "Age", value: profile.age ? `${profile.age} years` : "Not specified" },
        { label: "Gender", value: profile.gender ? profile.gender.toUpperCase() : "All" },
        { label: "Category", value: profile.socialCategory || "General" },
        { label: "Differently Abled", value: profile.isDisability ? "Yes" : "No" },
      ],
    },
    {
      title: "Location",
      step: 2,
      items: [
        { label: "State", value: profile.state || "Not specified" },
        { label: "District", value: profile.district || "Not specified" },
        { label: "Area Type", value: profile.residenceType ? profile.residenceType.toUpperCase() : "Urban" },
      ],
    },
    {
      title: "Work & Income",
      step: 3,
      items: [
        { label: "Occupation", value: profile.occupation?.replace(/_/g, " ").toUpperCase() || "Not specified" },
        {
          label: "Annual Income",
          value: profile.annualIncome ? `₹${profile.annualIncome.toLocaleString("en-IN")}` : "Not specified",
        },
        { label: "Farmer Status", value: profile.isFarmer ? `Yes (${profile.landHoldingHectares || 0} ha)` : "No" },
        { label: "Student Status", value: profile.isStudent ? `Yes (${profile.educationLevel || ""})` : "No" },
      ],
    },
    {
      title: "Household & Assets",
      step: 4,
      items: [
        { label: "Current Housing", value: profile.housingType?.toUpperCase() || "Pucca" },
        { label: "Family Size", value: profile.familyMembersCount ? `${profile.familyMembersCount} members` : "4 members" },
        { label: "Aadhaar Linked to Bank", value: profile.hasBankAadhaarLinked ? "Yes (DBT Ready)" : "No" },
      ],
    },
    {
      title: "Goals & Needs",
      step: 5,
      items: [
        {
          label: "Selected Priorities",
          value: profile.goals && profile.goals.length > 0
            ? profile.goals.map((g) => g.replace(/_/g, " ")).join(", ")
            : "General welfare schemes",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Review your answers before matching</p>
          <p className="text-emerald-800 text-xs mt-0.5">
            Our rules engine uses these details to match your profile against public scheme eligibility criteria. You can edit any section below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <div
            key={sec.step}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                  {sec.title}
                </h4>
                <button
                  type="button"
                  onClick={() => onEditStep(sec.step)}
                  className="text-xs text-navy-600 hover:text-navy-900 flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2">
                {sec.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[180px] truncate">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Privacy Notice: We evaluate your eligibility on-device and via secure API. No sensitive identifiers or financial secrets are stored.
        </span>
      </div>
    </div>
  );
}
