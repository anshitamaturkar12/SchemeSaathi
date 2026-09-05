"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, X, ArrowRight, Bookmark, CheckCircle2 } from "lucide-react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actionType?: "save" | "apply";
}

export default function AuthPromptModal({
  isOpen,
  onClose,
  title,
  description,
  actionType = "save",
}: AuthPromptModalProps) {
  if (!isOpen) return null;

  const defaultTitle =
    actionType === "apply" ? "Sign In to Track Applications" : "Save Scheme to Your Account";
  const defaultDesc =
    actionType === "apply"
      ? "Create a free SchemeSaathi account to track this application, manage required documents, and store your welfare milestones."
      : "Create a free account or sign in to permanently save schemes, access them across devices, and receive deadline updates.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 text-sky-300 flex items-center justify-center mx-auto shadow-md">
            {actionType === "apply" ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <Bookmark className="w-7 h-7 text-amber-300" />
            )}
          </div>
          <h3 className="text-xl font-extrabold text-navy-950">
            {title || defaultTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            {description || defaultDesc}
          </p>
        </div>

        {/* Perks list */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Permanent access to shortlisted government schemes</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Private and encrypted personal profile</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Application milestone & checklist tracking</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-navy-800 to-navy-950 hover:from-navy-700 hover:to-navy-900 text-white text-sm font-bold shadow-md transition-all active:scale-98"
          >
            <span>Sign In to Your Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/register"
            onClick={onClose}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>Create New Free Account</span>
          </Link>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-700 py-1"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
