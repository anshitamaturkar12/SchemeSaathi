"use client";

import React from "react";
import Link from "next/link";
import { useProfile } from "@/context/ProfileContext";
import { useSavedSchemes } from "@/context/SavedSchemesContext";
import SchemeCard from "@/components/schemes/SchemeCard";
import {
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
  Bookmark,
  TrendingUp,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Briefcase,
  Wallet,
  Building,
} from "lucide-react";

export default function DashboardPage() {
  const { profile, strongMatches, possibleMatches, matches, allSchemes } = useProfile();
  const { count: savedCount, statusCounts } = useSavedSchemes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Banner: Your Scheme Journey */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 px-3 py-1 rounded-full bg-white/10 border border-white/20 inline-block mb-2">
                Citizen Portal
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Your Scheme Journey
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Real-time snapshot of your eligibility entitlements, shortlisted programs, and application milestones.
              </p>
            </div>

            <Link
              href="/find"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-navy-950 text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Update Profile</span>
            </Link>
          </div>

          {/* 4 Big Metric Progress Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-xs font-semibold text-slate-300 block">
                Total Matches
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                {strongMatches.length + possibleMatches.length}
              </span>
              <span className="text-[11px] text-emerald-400">
                {strongMatches.length} Strong • {possibleMatches.length} Possible
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-xs font-semibold text-slate-300 block">
                Saved / Shortlisted
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                {savedCount}
              </span>
              <span className="text-[11px] text-sky-300">Bookmarked schemes</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-xs font-semibold text-slate-300 block">
                Ready to Apply
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                {statusCounts.ready_to_apply}
              </span>
              <span className="text-[11px] text-purple-300">Docs confirmed</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-xs font-semibold text-slate-300 block">
                Completed Applications
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
                {statusCounts.applied}
              </span>
              <span className="text-[11px] text-emerald-300">Submitted to official portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Profile Summary & Top Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
                <User className="w-4 h-4 text-navy-700" />
                <span>Active Profile Snapshot</span>
              </h3>
              <Link
                href="/find"
                className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
              >
                Edit
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Age & Gender:</span>
                </span>
                <span className="font-bold text-slate-800">
                  {profile.age || 24} yrs • {profile.gender?.toUpperCase() || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Domicile State:</span>
                </span>
                <span className="font-bold text-slate-800">
                  {profile.state || "Maharashtra"} ({profile.residenceType || "urban"})
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Occupation:</span>
                </span>
                <span className="font-bold text-slate-800 capitalize">
                  {profile.occupation?.replace(/_/g, " ") || "Student"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  <span>Annual Income:</span>
                </span>
                <span className="font-bold text-slate-800">
                  ₹{profile.annualIncome ? profile.annualIncome.toLocaleString("en-IN") : "1,80,000"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Social Category:</span>
                </span>
                <span className="font-bold text-slate-800">
                  {profile.socialCategory || "General"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/find/results"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl text-xs font-semibold transition-colors"
              >
                <span>View All Match Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick AI Assist Card */}
          <div className="bg-gradient-to-br from-sky-50 to-navy-50 rounded-3xl border border-sky-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-navy-950 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Need help applying?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask SchemeSathi Assistant to generate an exact document submission guide for your preferred scheme.
            </p>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:underline"
            >
              <span>Launch SchemeSathi AI Assistant →</span>
            </Link>
          </div>
        </div>

        {/* Right Column (2 cols): Top Recommendations Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-950">
                Top Recommended Schemes for You
              </h2>
              <p className="text-xs text-slate-500">
                Prioritized based on highest deterministic match score.
              </p>
            </div>

            <Link
              href="/find/results"
              className="text-xs font-semibold text-navy-800 hover:underline flex items-center gap-1"
            >
              <span>Full Match Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strongMatches.slice(0, 4).map((match) => (
              <SchemeCard key={match.scheme.id} matchResult={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
