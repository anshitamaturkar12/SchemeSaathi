"use client";

import React, { useState, useMemo } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import SchemeCard from "@/components/schemes/SchemeCard";
import { SchemeCategory, GovernmentLevel } from "@/types/scheme";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Sparkles,
  Layers,
  GraduationCap,
  HeartPulse,
  Home,
  Briefcase,
  Users,
  Wheat,
  Scale,
} from "lucide-react";

const CATEGORIES: { name: SchemeCategory; icon: any; emoji: string }[] = [
  { name: "Agriculture", icon: Wheat, emoji: "🌾" },
  { name: "Education", icon: GraduationCap, emoji: "🎓" },
  { name: "Healthcare", icon: HeartPulse, emoji: "🏥" },
  { name: "Housing", icon: Home, emoji: "🏠" },
  { name: "Employment", icon: Briefcase, emoji: "💼" },
  { name: "Women & Family", icon: Users, emoji: "👩" },
  { name: "Business", icon: Briefcase, emoji: "🏪" },
  { name: "Social Welfare", icon: Layers, emoji: "🛡️" },
];

export default function ExploreSchemesPage() {
  const { matches, allSchemes } = useProfile();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGovLevel, setSelectedGovLevel] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"match" | "name" | "recent">("match");
  const [compareList, setCompareList] = useState<string[]>([]);

  const filteredMatches = useMemo(() => {
    return matches.filter((item) => {
      const s = item.scheme;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText =
          s.name.toLowerCase().includes(query) ||
          s.shortName.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.benefits.some((b) => b.toLowerCase().includes(query)) ||
          s.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesText) return false;
      }

      // Category filter
      if (selectedCategory !== "All" && s.category !== selectedCategory) {
        return false;
      }

      // Government level filter
      if (selectedGovLevel !== "All" && s.governmentLevel !== selectedGovLevel) {
        return false;
      }

      // State filter
      if (selectedState !== "All") {
        if (!s.states.includes("All India") && !s.states.includes(selectedState)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "match") return b.score - a.score;
      if (sortBy === "name") return a.scheme.name.localeCompare(b.scheme.name);
      if (sortBy === "recent") return b.scheme.lastVerified.localeCompare(a.scheme.lastVerified);
      return 0;
    });
  }, [matches, searchQuery, selectedCategory, selectedGovLevel, selectedState, sortBy]);

  const toggleCompare = (schemeId: string) => {
    setCompareList((prev) =>
      prev.includes(schemeId)
        ? prev.filter((id) => id !== schemeId)
        : prev.length < 3
        ? [...prev, schemeId]
        : prev
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedGovLevel("All");
    setSelectedState("All");
    setSortBy("match");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "All" ||
    selectedGovLevel !== "All" ||
    selectedState !== "All";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Explore Government Schemes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse verified Central and State welfare programs with transparent eligibility criteria.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto border border-slate-200">
            {filteredMatches.length} of {allSchemes.length} Schemes Available
          </span>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
              selectedCategory === "All"
                ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            All Categories ({allSchemes.length})
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                selectedCategory === cat.name
                  ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes by name, keyword, or benefits..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Gov Level Filter */}
          <select
            value={selectedGovLevel}
            onChange={(e) => setSelectedGovLevel(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-600"
          >
            <option value="All">All Levels</option>
            <option value="Central">Central Govt</option>
            <option value="State">State Govt</option>
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-600"
          >
            <option value="All">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="All India">All India Schemes</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-600"
          >
            <option value="match">Sort: Match Score</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="recent">Sort: Recently Verified</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Compare Floating Banner */}
      {compareList.length > 0 && (
        <div className="sticky top-20 z-30 bg-navy-950 text-white rounded-2xl p-4 shadow-xl border border-navy-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <Scale className="w-4 h-4 text-sky-300" />
            <span>{compareList.length} of 3 schemes selected to compare</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Reset
            </button>
            <a
              href={`/compare?ids=${compareList.join(",")}`}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-navy-950 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1"
            >
              <span>Compare ({compareList.length})</span>
            </a>
          </div>
        </div>
      )}

      {/* Grid of Scheme Cards */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <SchemeCard
              key={match.scheme.id}
              matchResult={match}
              showComparisonOption
              isSelectedForCompare={compareList.includes(match.scheme.id)}
              onToggleCompare={() => toggleCompare(match.scheme.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-950">
            No matching schemes found
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search query or clear filters to view all available government welfare schemes.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 bg-navy-800 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
