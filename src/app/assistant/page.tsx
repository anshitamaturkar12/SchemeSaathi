"use client";

import React, { useState } from "react";
import AIChatBox from "@/components/ai/AIChatBox";
import NaturalLanguageFinder from "@/components/ai/NaturalLanguageFinder";
import { Bot, Sparkles, MessageSquare, Search } from "lucide-react";

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "natural">("chat");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-navy-50 text-navy-800 text-xs font-bold border border-navy-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Grounded Intelligence + Deterministic Rules</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-navy-950 tracking-tight">
          SchemeSathi AI Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Ask questions about welfare schemes in simple language, or describe your background to discover eligible benefits instantly.
        </p>

        {/* Tab Toggle */}
        <div className="pt-2 flex justify-center">
          <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200 inline-flex items-center gap-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "chat"
                  ? "bg-white text-navy-950 shadow-xs"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-navy-700" />
              <span>Interactive Chatbot</span>
            </button>

            <button
              onClick={() => setActiveTab("natural")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "natural"
                  ? "bg-white text-navy-950 shadow-xs"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Natural Language Finder (WOW Feature)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === "chat" ? (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-200">
            <AIChatBox />
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            <NaturalLanguageFinder />
          </div>
        )}
      </div>
    </div>
  );
}
