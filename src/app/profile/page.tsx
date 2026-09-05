"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Wallet,
  Building,
  Bookmark,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowRight,
  LogOut,
  Save,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Eye,
  FileCheck2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    profile,
    isLoading,
    logout,
    updateProfile,
    activities,
    viewedActivities,
    savedActivities,
    appliedActivities,
    removeActivity,
  } = useAuth();
  const { allSchemes } = useProfile();

  const [activeTab, setActiveTab] = useState<
    "profile" | "viewed" | "saved" | "applied" | "activity"
  >("profile");

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [occupation, setOccupation] = useState("");
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [socialCategory, setSocialCategory] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync profile values into form state
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setDateOfBirth(profile.date_of_birth || "");
      setGender(profile.gender || "male");
      setState(profile.state || "Maharashtra");
      setCity(profile.city || "");
      setOccupation(profile.occupation || "student");
      setAnnualIncome(profile.annual_income ? String(profile.annual_income) : "180000");
      setSocialCategory(profile.social_category || "General");
    }
  }, [profile]);

  // Protected route check
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-navy-800 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Loading your secure profile...
        </p>
      </div>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const res = await updateProfile({
      full_name: fullName,
      phone,
      date_of_birth: dateOfBirth,
      gender,
      state,
      city,
      occupation,
      annual_income: annualIncome ? Number(annualIncome) : undefined,
      social_category: socialCategory,
    });

    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(res.error || "Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Profile Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-400 to-navy-700 text-white flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg border-2 border-white/20">
              {initials}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-300 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
                  Citizen Account
                </span>
                <span className="text-xs text-slate-300">@{user.username}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {user.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
                {profile?.state && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {profile.state}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              href="/schemes"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Explore Schemes</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
              title="Sign out of your account"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-xs font-medium text-slate-300 block">Schemes Viewed</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {viewedActivities.length}
            </span>
            <span className="text-[11px] text-sky-300">In your discovery history</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-xs font-medium text-slate-300 block">Saved Schemes</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {savedActivities.length}
            </span>
            <span className="text-[11px] text-amber-300">Bookmarked for later</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-xs font-medium text-slate-300 block">Applied Schemes</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {appliedActivities.length}
            </span>
            <span className="text-[11px] text-emerald-300">Marked as applied</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-xs font-medium text-slate-300 block">Total Activities</span>
            <span className="text-2xl font-black text-purple-300 mt-1 block">
              {activities.length}
            </span>
            <span className="text-[11px] text-purple-200">Account logs</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-navy-900 text-white shadow-sm"
              : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("viewed")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "viewed"
              ? "bg-navy-900 text-white shadow-sm"
              : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Viewed Schemes ({viewedActivities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "saved"
              ? "bg-navy-900 text-white shadow-sm"
              : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Schemes ({savedActivities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("applied")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "applied"
              ? "bg-navy-900 text-white shadow-sm"
              : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Applied Schemes ({appliedActivities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
            activeTab === "activity"
              ? "bg-navy-900 text-white shadow-sm"
              : "text-slate-600 hover:text-navy-900 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Recent Activity ({activities.length})</span>
        </button>
      </div>

      {/* Tab 1: My Profile Details & Editor */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Personal Welfare Profile</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Keep your details updated so SchemeSaathi can match you with the most relevant state and central schemes.
              </p>
            </div>

            {saveSuccess && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile saved securely!</span>
              </div>
            )}
            {saveError && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{saveError}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Username (Fixed)
                </label>
                <input
                  type="text"
                  value={profile?.username || user.username}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address (Fixed)
                </label>
                <input
                  type="email"
                  value={profile?.email || user.email}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Date of Birth (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  State / Domicile
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Bihar">Bihar</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                  <option value="All India">Other / All India</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City / District (Optional)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Occupation
                </label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                >
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="employed">Employed (Salaried)</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="business_owner">Business Owner / MSME</option>
                  <option value="daily_wage">Daily Wage Worker</option>
                  <option value="street_vendor">Street Vendor</option>
                  <option value="homemaker">Homemaker</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Annual Household Income (₹ INR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    placeholder="e.g. 180000"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Social Category / Caste Group
                </label>
                <select
                  value={socialCategory}
                  onChange={(e) => setSocialCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="Minority">Minority</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-800 to-navy-950 hover:from-navy-700 hover:to-navy-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              <span className="text-xs text-slate-400">
                🔒 Your personal data is encrypted and never shared.
              </span>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Schemes I've Viewed */}
      {activeTab === "viewed" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-950">Schemes You&apos;ve Viewed</h2>
              <p className="text-xs text-slate-500">
                A history of government programs you recently explored on SchemeSaathi.
              </p>
            </div>
            <Link
              href="/schemes"
              className="text-xs font-semibold text-navy-800 hover:underline flex items-center gap-1"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {viewedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viewedActivities.map((act) => {
                const scheme = allSchemes.find((s) => s.id === act.scheme_id);
                const dateStr = new Date(act.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={act.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-sky-600" />
                          <span>Viewed on {dateStr}</span>
                        </span>
                        {scheme && (
                          <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {scheme.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-navy-950 leading-snug">
                        {act.scheme_name}
                      </h3>
                      {scheme && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {scheme.tagline}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {scheme?.governmentLevel || "Central"} Scheme
                      </span>
                      <Link
                        href={`/schemes/${act.scheme_id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-navy-800 hover:text-navy-950"
                      >
                        <span>Open Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-navy-600" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Eye className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-navy-950">No viewed schemes yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore schemes and click on them to build your personal browsing history.
              </p>
              <Link
                href="/schemes"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition-colors"
              >
                <span>Browse All Schemes</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Schemes */}
      {activeTab === "saved" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-950">Your Bookmarked Schemes</h2>
              <p className="text-xs text-slate-500">
                Schemes you shortlisted to review documents and apply later.
              </p>
            </div>
            <Link
              href="/schemes"
              className="text-xs font-semibold text-navy-800 hover:underline flex items-center gap-1"
            >
              <span>Add More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {savedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedActivities.map((act) => {
                const scheme = allSchemes.find((s) => s.id === act.scheme_id);
                const dateStr = new Date(act.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={act.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <Bookmark className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Saved on {dateStr}</span>
                        </span>
                        {scheme && (
                          <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {scheme.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-navy-950 leading-snug">
                        {act.scheme_name}
                      </h3>
                      {scheme && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {scheme.tagline}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => removeActivity(act.scheme_id, "SAVED")}
                        className="text-xs text-rose-600 hover:underline font-medium"
                      >
                        Remove
                      </button>

                      <Link
                        href={`/schemes/${act.scheme_id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-navy-900 text-white rounded-xl text-xs font-semibold hover:bg-navy-800 transition-colors"
                      >
                        <span>View Scheme</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-navy-950">No saved schemes yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bookmark schemes while exploring to track them in this dashboard.
              </p>
              <Link
                href="/schemes"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition-colors"
              >
                <span>Explore Schemes</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Applied Schemes */}
      {activeTab === "applied" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-950">Schemes Marked as Applied</h2>
              <p className="text-xs text-slate-500">
                Track programs you have marked as applied in your personal SchemeSaathi journey.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Marking a scheme as applied records it in your SchemeSaathi tracking dashboard. It does not automatically submit an official application to the government portal.
            </span>
          </div>

          {appliedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appliedActivities.map((act) => {
                const scheme = allSchemes.find((s) => s.id === act.scheme_id);
                const dateStr = new Date(act.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={act.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Applied</span>
                        </span>
                        <span className="text-slate-400">Marked on {dateStr}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-navy-950 leading-snug">
                        {act.scheme_name}
                      </h3>
                      {scheme && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {scheme.tagline}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => removeActivity(act.scheme_id, "APPLIED")}
                        className="text-xs text-slate-500 hover:text-rose-600 font-medium"
                      >
                        Remove status
                      </button>

                      <div className="flex items-center gap-2">
                        {scheme?.officialUrl && (
                          <a
                            href={scheme.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        <Link
                          href={`/schemes/${act.scheme_id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-navy-900 text-white rounded-xl text-xs font-semibold hover:bg-navy-800 transition-colors"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-navy-950">No applied schemes yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once you submit documents or apply for a scheme, mark it as applied on the scheme details page to track it here.
              </p>
              <Link
                href="/schemes"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-800 text-white rounded-xl text-xs font-semibold hover:bg-navy-900 transition-colors"
              >
                <span>Browse Schemes</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Recent Activity Log */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Activity History</span>
            </h2>
            <p className="text-xs text-slate-500">
              Audit timeline of all actions taken while logged into your account.
            </p>
          </div>

          {activities.length > 0 ? (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {activities.map((act) => {
                const dateStr = new Date(act.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const badgeConfig = {
                  VIEWED: { label: "Viewed Scheme", color: "bg-sky-50 text-sky-800 border-sky-200" },
                  SAVED: { label: "Saved Scheme", color: "bg-amber-50 text-amber-800 border-amber-200" },
                  APPLIED: {
                    label: "Marked as Applied",
                    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
                  },
                  PROFILE_UPDATED: {
                    label: "Profile Updated",
                    color: "bg-purple-50 text-purple-800 border-purple-200",
                  },
                }[act.activity_type] || { label: act.activity_type, color: "bg-slate-100 text-slate-800" };

                return (
                  <div key={act.id} className="relative group">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-navy-700 border-2 border-white ring-2 ring-slate-100" />
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-navy-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeConfig.color}`}
                          >
                            {badgeConfig.label}
                          </span>
                          <span className="text-[11px] text-slate-400">{dateStr}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-navy-950">
                          {act.scheme_name}
                        </h4>
                      </div>

                      {act.scheme_id && (
                        <Link
                          href={`/schemes/${act.scheme_id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-navy-800 hover:underline shrink-0"
                        >
                          <span>View Scheme</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400">
              No recent activity recorded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
