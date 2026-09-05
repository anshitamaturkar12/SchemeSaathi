"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useProfile, DEMO_PRESETS } from "@/context/ProfileContext";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Lock,
  Globe2,
  Layers,
  HelpCircle,
  TrendingUp,
  FileText,
  Building,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function LandingPage() {
  const { t } = useLanguage();
  const { loadPreset } = useProfile();
  const router = useRouter();

  const handlePresetSelect = (key: string) => {
    loadPreset(key);
    router.push("/find/results");
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-200/40 via-blue-100/30 to-amber-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Saffron/Tricolor Flaglet Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-navy-900 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI-Assisted Welfare Discovery for Indian Citizens</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.15]">
            Government Benefits <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-navy-900 via-sky-700 to-navy-800 bg-clip-text text-transparent">
              Shouldn&apos;t Be Hard to Find.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubheadline")}
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/find"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-navy-800 to-navy-950 hover:from-navy-700 hover:to-navy-900 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-98 text-sm sm:text-base group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>{t("findMySchemes")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/schemes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-sm sm:text-base"
            >
              <span>{t("exploreAllSchemes")}</span>
            </Link>
          </div>

          {/* Quick 1-Click Demo Profiles for Judges */}
          <div className="pt-6 border-t border-slate-200/70 max-w-xl mx-auto">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              ⚡ Quick Hackathon Demo (1-Click Test Personas):
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {Object.entries(DEMO_PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-navy-50 text-xs font-medium text-slate-700 hover:text-navy-900 border border-slate-200 shadow-xs hover:border-navy-300 transition-all active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Interactive Visual Mockup */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl p-4 sm:p-7 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-sky-100/50 rounded-full blur-2xl pointer-events-none" />

            {/* Mock Dashboard Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-400 ml-2">
                  SchemeSathi AI • Citizen Matching Dashboard Preview
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Deterministic Rules Engine Active</span>
              </div>
            </div>

            {/* Dashboard Visual Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Live Scheme Card Preview */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                        Central Welfare
                      </span>
                      <h4 className="text-base font-bold text-navy-950 mt-1">
                        Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>92% Strong Match</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Direct income transfer of ₹6,000 per year in three equal installments of ₹2,000 directly via DBT into Aadhaar-seeded accounts.
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-semibold text-navy-900 block">Why this matches:</span>
                    <p className="text-slate-600">
                      ✓ Occupation (Farmer) matches • ✓ Maharashtra landholding qualifies • ✓ Income within non-institutional limits.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-sky-700" />
                    <div>
                      <h5 className="text-xs font-bold text-navy-900">
                        Natural Language Intent Parsing
                      </h5>
                      <p className="text-[11px] text-slate-600">
                        &quot;I am a 21-yr student in Maharashtra with ₹2L family income&quot; → 7 instant matches
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/assistant"
                    className="text-xs font-bold text-sky-800 hover:text-sky-950 underline"
                  >
                    Try AI Finder →
                  </Link>
                </div>
              </div>

              {/* Card 2: Document Readiness Checklist Preview */}
              <div className="p-5 rounded-2xl bg-navy-950 text-white flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Document Readiness
                    </h4>
                    <span className="text-xs font-bold text-emerald-400">100% Ready</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 text-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Aadhaar Card linked to Mobile</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 text-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bank Passbook (DBT Active)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 text-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Income / Domicile Certificate</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 text-center">
                  <span className="text-[11px] text-slate-400 block mb-2">
                    Direct Official Channel Access
                  </span>
                  <div className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-navy-950 text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
                    <span>One-Click Official Portals</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why People Struggle Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
            {t("struggleTitle")}
          </h2>
          <p className="text-sm text-slate-600">
            {t("struggleSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">
              {t("painPoint1Title")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("painPoint1Desc")}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">
              {t("painPoint2Title")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("painPoint2Desc")}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">
              {t("painPoint3Title")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("painPoint3Desc")}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">
              {t("painPoint4Title")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("painPoint4Desc")}
            </p>
          </div>
        </div>
      </section>

      {/* How SchemeSathi AI Helps Section */}
      <section className="bg-gradient-to-b from-slate-100/70 to-white py-16 sm:py-24 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-700 px-3 py-1 rounded-full bg-navy-50 border border-navy-200">
              The Solution
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
              {t("howItHelpsTitle")}
            </h2>
            <p className="text-sm text-slate-600">
              {t("howItHelpsSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="text-3xl font-black text-navy-200">01</div>
              <h3 className="text-base font-bold text-navy-950">
                {t("step1Title")}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("step1Desc")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="text-3xl font-black text-sky-200">02</div>
              <h3 className="text-base font-bold text-navy-950">
                {t("step2Title")}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("step2Desc")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="text-3xl font-black text-emerald-200">03</div>
              <h3 className="text-base font-bold text-navy-950">
                {t("step3Title")}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("step3Desc")}
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="text-3xl font-black text-amber-200">04</div>
              <h3 className="text-base font-bold text-navy-950">
                {t("step4Title")}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t("step4Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 rounded-3xl text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 px-3 py-1 rounded-full bg-sky-950 border border-sky-800">
              Trust & Transparency
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t("trustTitle")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-sky-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t("trustItem1Title")}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {t("trustItem1Desc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t("trustItem2Title")}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {t("trustItem2Desc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t("trustItem3Title")}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {t("trustItem3Desc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-purple-400">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t("trustItem4Title")}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {t("trustItem4Desc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Disclaimer */}
            <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed mt-6">
              <span className="font-bold text-slate-200">Legal Assurance: </span>
              {t("disclaimerText")}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
