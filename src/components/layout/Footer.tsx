"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, Lock, ExternalLink, Heart, Sparkles, FileCheck2 } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Disclaimer Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <span className="font-semibold text-slate-200">Official Disclaimer: </span>
            {t("disclaimerText")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center text-white">
                <FileCheck2 className="w-4 h-4 text-sky-300" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                SchemeSathi <span className="text-sky-400 text-xs px-1.5 py-0.5 bg-sky-950 rounded border border-sky-800">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering 1.4 billion Indian citizens to discover welfare schemes, understand entitlement criteria in simple everyday language, and apply securely via official portals.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Private Data Stored</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Grounded AI Engine</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/find" className="hover:text-white transition-colors">
                  Eligibility Checker
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-white transition-colors">
                  Explore 18+ Schemes
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Compare Schemes
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-white transition-colors">
                  AI Scheme Assistant
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Personal Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Welfare Categories */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/schemes?cat=Agriculture" className="hover:text-white transition-colors">
                  🌾 Agriculture & Farmers
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=Education" className="hover:text-white transition-colors">
                  🎓 Higher Education & Skills
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=Healthcare" className="hover:text-white transition-colors">
                  🏥 Universal Healthcare
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=Business" className="hover:text-white transition-colors">
                  💼 MSME & Self-Employment
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=Women%20%26%20Family" className="hover:text-white transition-colors">
                  👩 Women & Family Welfare
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SchemeSathi AI. Built for the Hackathon with pride for Indian citizens.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Official Government Portals:</span>
            <a
              href="https://www.india.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline inline-flex items-center gap-0.5 ml-1"
            >
              india.gov.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
