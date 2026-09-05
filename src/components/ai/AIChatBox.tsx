"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isFallback?: boolean;
}

const SUGGESTED_PROMPTS = [
  "What schemes can a farmer with ₹2 lakh income get?",
  "Explain Ayushman Bharat in simple words.",
  "What documents do I need for Mudra Loan?",
  "Which schemes are available in Maharashtra?",
  "Can women get interest subsidies or business loans?",
  "What is the difference between PMAY Urban and Gramin?",
];

export default function AIChatBox() {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste! I am **SchemeSathi AI**, your personal government welfare assistant.\n\nAsk me anything about Central and State schemes, required documents, or eligibility criteria. You can ask in English, Hindi, or Marathi!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    // Prepare profile summary for context
    const profileSummary = `Age: ${profile.age || "Unknown"}, Occupation: ${profile.occupation || "Unknown"}, State: ${profile.state || "All India"}, Income: ₹${profile.annualIncome?.toLocaleString("en-IN") || "Unknown"}`;

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          userProfileSummary: profileSummary,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I'm sorry, I could not process your query right now.",
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I ran into an issue connecting to the assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared. What government scheme would you like to explore?",
      },
    ]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col h-[650px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-navy-900 to-navy-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-300 backdrop-blur-sm border border-white/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-1.5">
              <span>SchemeSathi Assistant</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Grounded AI
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Strictly grounded on official government scheme data
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          title="Clear chat history"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-navy-800 text-sky-300 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? "bg-navy-900 text-white rounded-br-xs"
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                }`}
              >
                <div className="whitespace-pre-line prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-navy-950 prose-a:text-sky-600">
                  {msg.content}
                </div>

                {msg.isFallback && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-amber-700">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Running in offline deterministic mode.</span>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-navy-800 text-sky-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-navy-600 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-navy-600 animate-pulse delay-150" />
              <span className="w-2 h-2 rounded-full bg-navy-600 animate-pulse delay-300" />
              <span className="ml-1 text-slate-500">Checking scheme database...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
          Try asking:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs bg-slate-100 hover:bg-navy-50 text-slate-700 hover:text-navy-900 px-3 py-1.5 rounded-full shrink-0 transition-colors border border-slate-200"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about eligibility, required documents, or benefits..."
          disabled={loading}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white transition-all placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
