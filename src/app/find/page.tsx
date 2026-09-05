"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile, DEMO_PRESETS } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import Stepper from "@/components/questionnaire/Stepper";
import QuestionCard from "@/components/questionnaire/QuestionCard";
import ReviewStep from "@/components/questionnaire/ReviewStep";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

const INDIAN_STATES = [
  "Maharashtra",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi (NCT)",
  "Jammu and Kashmir",
];

const STEPS = [
  { id: 1, title: "About You" },
  { id: 2, title: "Location" },
  { id: 3, title: "Work & Income" },
  { id: 4, title: "Household" },
  { id: 5, title: "Goals" },
  { id: 6, title: "Review" },
];

export default function FindSchemesPage() {
  const router = useRouter();
  const { profile, updateProfile, setHasSubmitted, loadPreset } = useProfile();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNext = () => {
    setValidationError(null);

    // Validation per step
    if (currentStep === 1) {
      if (!profile.age || profile.age < 5 || profile.age > 120) {
        setValidationError("Please enter a valid age between 5 and 120.");
        return;
      }
    } else if (currentStep === 2) {
      if (!profile.state) {
        setValidationError("Please select your state of residence.");
        return;
      }
    } else if (currentStep === 3) {
      if (!profile.occupation) {
        setValidationError("Please select your primary occupation.");
        return;
      }
      if (profile.annualIncome === undefined || profile.annualIncome < 0) {
        setValidationError("Please enter your estimated annual family income.");
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final Submit!
      handleSubmit();
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
    router.push("/find/results");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header & Tagline */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          {t("questionnaireTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          {t("questionnaireSubtitle")}
        </p>

        {/* Demo Preset Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">
            Prefill Demo:
          </span>
          {Object.entries(DEMO_PRESETS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                loadPreset(key);
                setCurrentStep(6);
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-navy-50 text-slate-700 hover:text-navy-900 border border-slate-200 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(step) => setCurrentStep(step)}
        />
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step Contents */}
      <div className="space-y-6">
        {/* STEP 1: ABOUT YOU */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Age */}
            <QuestionCard
              title="What is your age?"
              description="Enter your age in completed years."
              whyAskThis="Many schemes have strict age brackets — e.g. Atal Pension Yojana (18-40 yrs), youth apprenticeships (14-35 yrs), senior citizen healthcare (60-70+ yrs)."
              required
            >
              <input
                type="number"
                min={5}
                max={110}
                value={profile.age || ""}
                onChange={(e) => updateProfile({ age: parseInt(e.target.value, 10) || undefined })}
                placeholder="e.g. 24"
                className="w-full sm:w-48 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
              />
            </QuestionCard>

            {/* Gender */}
            <QuestionCard
              title="What is your gender?"
              description="Select your gender identity."
              whyAskThis="Special welfare schemes like Sukanya Samriddhi, PMMVY, Stand-Up India, and Majhi Ladki Bahin provide exclusive grants and subsidies for women."
              required
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: "female", label: "Female" },
                  { value: "male", label: "Male" },
                  { value: "other", label: "Other" },
                  { value: "all", label: "Prefer not to specify" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateProfile({ gender: opt.value as any })}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                      profile.gender === opt.value
                        ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </QuestionCard>

            {/* Social Category */}
            <QuestionCard
              title="Social Reservation Category"
              description="Select the category you belong to as per government certificates."
              whyAskThis="Higher education scholarships (Post-Matric, CAP tuition waivers) and enterprise subsidies often have specific quotas and grants for SC, ST, OBC, and EWS citizens."
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(["General", "OBC", "SC", "ST", "Minority", "EWS"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateProfile({ socialCategory: cat })}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                      profile.socialCategory === cat
                        ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </QuestionCard>

            {/* Disability Status */}
            <QuestionCard
              title="Are you a person with disabilities (PwD)?"
              whyAskThis="Government mandates special allowances, accessible education grants, and relaxed age bars for persons with benchmark disabilities."
            >
              <div className="flex gap-4">
                {[
                  { val: false, label: "No" },
                  { val: true, label: "Yes (40%+ Disability)" },
                ].map((item) => (
                  <button
                    key={String(item.val)}
                    type="button"
                    onClick={() => updateProfile({ isDisability: item.val })}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      profile.isDisability === item.val
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </QuestionCard>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* State */}
            <QuestionCard
              title="What is your state of permanent residence / domicile?"
              description="Schemes are categorized into Central (pan-India) and State-specific programs."
              whyAskThis="Some of the largest welfare benefits (like Maharashtra's MJPJAY health cover, MahaDBT tuition waivers, and Ladki Bahin) are strictly state-specific."
              required
            >
              <select
                value={profile.state || ""}
                onChange={(e) => updateProfile({ state: e.target.value })}
                className="w-full sm:w-80 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
              >
                <option value="">-- Select Your State --</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </QuestionCard>

            {/* District */}
            <QuestionCard
              title="District (Optional)"
              description="Helps pinpoint local municipal or block development office programs."
              whyAskThis="Certain schemes have district-level quotas or lead banks for loan sanctioning."
            >
              <input
                type="text"
                value={profile.district || ""}
                onChange={(e) => updateProfile({ district: e.target.value })}
                placeholder="e.g. Pune, Nashik, Mumbai, Nagpur..."
                className="w-full sm:w-80 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
              />
            </QuestionCard>

            {/* Residence Type: Rural vs Urban */}
            <QuestionCard
              title="Do you reside in a rural or urban area?"
              description="Select whether you live in a village/gram panchayat or a city/municipal area."
              whyAskThis="Crucial for housing schemes: PMAY-Gramin applies to villages, while PMAY-Urban applies to statutory municipal cities."
              required
            >
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {[
                  { val: "rural", label: "🌾 Rural (Village / Gram Panchayat)" },
                  { val: "urban", label: "🏙️ Urban (City / Municipality)" },
                  { val: "semi_urban", label: "🏡 Semi-Urban / Town" },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => updateProfile({ residenceType: t.val as any })}
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                      profile.residenceType === t.val
                        ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </QuestionCard>
          </div>
        )}

        {/* STEP 3: WORK & INCOME */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Primary Occupation */}
            <QuestionCard
              title="What is your primary occupation?"
              description="Select the option that best describes your daily work or livelihood."
              whyAskThis="Occupation is the #1 eligibility filter: PM-KISAN & PMFBY are for farmers, Mudra/SVANidhi for vendors and micro-businesses, scholarships for students, and Shram Yogi for unorganized workers."
              required
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { val: "farmer", label: "🌾 Farmer / Agriculture" },
                  { val: "student", label: "🎓 Student" },
                  { val: "street_vendor", label: "🛒 Street Vendor / Hawker" },
                  { val: "artisan", label: "🔨 Traditional Artisan / Craft" },
                  { val: "business_owner", label: "💼 Small Business Owner / Shop" },
                  { val: "self_employed", label: "🛠️ Self-Employed Professional" },
                  { val: "employed", label: "🏢 Salaried Private / Public Worker" },
                  { val: "daily_wage", label: "👷 Daily Wage Laborer" },
                  { val: "unemployed", label: "🔍 Jobseeker / Unemployed" },
                  { val: "homemaker", label: "🏡 Homemaker" },
                  { val: "other", label: "✨ Other" },
                ].map((occ) => (
                  <button
                    key={occ.val}
                    type="button"
                    onClick={() =>
                      updateProfile({
                        occupation: occ.val as any,
                        isFarmer: occ.val === "farmer",
                        isStudent: occ.val === "student",
                      })
                    }
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                      profile.occupation === occ.val
                        ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </QuestionCard>

            {/* Farmer Sub-questions */}
            {(profile.occupation === "farmer" || profile.isFarmer) && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  🌾 Farmer Details
                </h4>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Cultivable Landholding (in Hectares):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={profile.landHoldingHectares ?? 1.5}
                    onChange={(e) =>
                      updateProfile({ landHoldingHectares: parseFloat(e.target.value) || 0 })
                    }
                    className="w-48 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Small & marginal farmers (under 2 hectares) get highest priority under PM-KISAN and crop insurance subsidies.
                  </p>
                </div>
              </div>
            )}

            {/* Student Sub-questions */}
            {(profile.occupation === "student" || profile.isStudent) && (
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3">
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                  🎓 Student Educational Stage
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { val: "school", label: "Class 9 - 10" },
                    { val: "matric", label: "Class 11 - 12 / ITI" },
                    { val: "undergraduate", label: "Undergraduate (B.Tech, BA, B.Sc...)" },
                    { val: "postgraduate", label: "Postgraduate / Master's" },
                    { val: "diploma", label: "Polytechnic / Diploma" },
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      type="button"
                      onClick={() => updateProfile({ educationLevel: lvl.val as any })}
                      className={`p-2.5 rounded-lg text-xs font-semibold border ${
                        profile.educationLevel === lvl.val
                          ? "bg-navy-900 text-white"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Annual Household Income */}
            <QuestionCard
              title="Annual Family Income (in INR)"
              description="Estimated total income of your household from all sources per year."
              whyAskThis="Almost all welfare schemes have income thresholds — e.g. Ayushman Bharat (below ₹3 Lakh), MahaDBT (below ₹8 Lakh), Shram Yogi (below ₹1.8 Lakh)."
              required
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-base sm:text-lg font-bold text-navy-900">
                    ₹{profile.annualIncome ? profile.annualIncome.toLocaleString("en-IN") : "0"}
                  </span>
                  <span className="text-xs text-slate-400">/ year</span>
                </div>

                <input
                  type="range"
                  min={30000}
                  max={1500000}
                  step={10000}
                  value={profile.annualIncome || 180000}
                  onChange={(e) =>
                    updateProfile({ annualIncome: parseInt(e.target.value, 10) })
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy-800"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {[100000, 180000, 250000, 500000, 800000].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => updateProfile({ annualIncome: inc })}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        profile.annualIncome === inc
                          ? "bg-navy-800 text-white font-bold"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      ₹{(inc / 100000).toFixed(1)} Lakh
                    </button>
                  ))}
                </div>
              </div>
            </QuestionCard>
          </div>
        )}

        {/* STEP 4: HOUSEHOLD & ASSETS */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Housing Type */}
            <QuestionCard
              title="What is your current living arrangement / house type?"
              description="Select whether you live in a concrete house, rented home, or kutcha dwelling."
              whyAskThis="PMAY housing schemes specifically mandate that the family must not already own a pucca house to qualify for the ₹1.3L to ₹2.67L housing subsidy."
              required
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { val: "kutcha", label: "🛖 Kutcha / Mud House" },
                  { val: "rented", label: "🏢 Rented Accommodation" },
                  { val: "pucca", label: "🏠 Owned Pucca (Concrete)" },
                  { val: "homeless", label: "🏕️ Homeless / Informal" },
                ].map((h) => (
                  <button
                    key={h.val}
                    type="button"
                    onClick={() => updateProfile({ housingType: h.val as any })}
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                      profile.housingType === h.val
                        ? "bg-navy-900 text-white border-navy-900 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </QuestionCard>

            {/* Family Members Count */}
            <QuestionCard
              title="Total number of family members in your household"
              whyAskThis="SECC deprivation metrics and health insurance coverage limits are calculated on a per-family basis."
            >
              <input
                type="number"
                min={1}
                max={20}
                value={profile.familyMembersCount || 4}
                onChange={(e) =>
                  updateProfile({ familyMembersCount: parseInt(e.target.value, 10) || 1 })
                }
                className="w-36 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-600 focus:bg-white"
              />
            </QuestionCard>

            {/* Aadhaar-Bank Linked */}
            <QuestionCard
              title="Is your Aadhaar card linked with your bank account (DBT enabled)?"
              whyAskThis="Over 90% of welfare funds (PM-KISAN, Ladki Bahin, Scholarships, PMMVY) are now disbursed strictly through Aadhaar-based Direct Benefit Transfer (DBT)."
            >
              <div className="flex gap-4">
                {[
                  { val: true, label: "Yes (DBT Enabled)" },
                  { val: false, label: "No / Unsure" },
                ].map((item) => (
                  <button
                    key={String(item.val)}
                    type="button"
                    onClick={() => updateProfile({ hasBankAadhaarLinked: item.val })}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      profile.hasBankAadhaarLinked === item.val
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </QuestionCard>
          </div>
        )}

        {/* STEP 5: GOALS & INTERESTS */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <QuestionCard
              title="What kind of government support are you looking for?"
              description="Select any benefits that match your current needs."
              whyAskThis="Helps prioritize the most relevant schemes to the top of your personalized recommendation feed."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "farming_support", label: "🌾 Farming Subsidies & Crop Insurance" },
                  { id: "higher_education", label: "🎓 College Tuition Waiver & Scholarships" },
                  { id: "healthcare", label: "🏥 Cashless Hospitalization & Health Card" },
                  { id: "business_capital", label: "💼 Low-Interest Business & Vendor Loans" },
                  { id: "housing", label: "🏠 Pucca House Construction Aid" },
                  { id: "skill_training", label: "⚙️ Apprenticeship & Vocational Stipends" },
                  { id: "pension", label: "🛡️ Retirement Monthly Pension (APY / Shram Yogi)" },
                  { id: "women_support", label: "👩 Women Financial Aid & Maternity Grants" },
                ].map((goal) => {
                  const currentGoals = profile.goals || [];
                  const isChecked = currentGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => {
                        const updated = isChecked
                          ? currentGoals.filter((g) => g !== goal.id)
                          : [...currentGoals, goal.id];
                        updateProfile({ goals: updated });
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        isChecked
                          ? "bg-navy-50 border-navy-300 text-navy-950 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? "bg-navy-800 border-navy-800 text-white" : "border-slate-300"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs sm:text-sm">{goal.label}</span>
                    </button>
                  );
                })}
              </div>
            </QuestionCard>
          </div>
        )}

        {/* STEP 6: REVIEW */}
        {currentStep === 6 && (
          <div className="animate-in fade-in duration-200">
            <ReviewStep
              profile={profile}
              onEditStep={(step) => setCurrentStep(step)}
            />
          </div>
        )}
      </div>

      {/* Stepper Navigation Buttons */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("back")}</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow active:scale-95"
        >
          {currentStep === 6 ? (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t("submitFindSchemes")}</span>
            </>
          ) : (
            <>
              <span>{t("continue")}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
