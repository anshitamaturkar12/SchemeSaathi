"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Check } from "lucide-react";
import { LanguageCode } from "@/lib/i18n";

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-navy-900 bg-white/80 hover:bg-slate-100 border border-slate-200 rounded-full transition-all shadow-subtle"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-navy-600" />
        <span>{currentLang.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Language / भाषा
          </div>
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                setLanguage(item.code as LanguageCode);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                language === item.code
                  ? "bg-navy-50 text-navy-800 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-navy-900"
              }`}
            >
              <span>{item.nativeName}</span>
              {language === item.code && <Check className="w-3.5 h-3.5 text-navy-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
