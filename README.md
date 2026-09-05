# SchemeSathi AI

> **"Your Personal Government Scheme Eligibility Assistant"**  
> *Discover the government welfare schemes you may be eligible for — in minutes, not hours.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini%20AI-1.5%20Flash-4285F4?style=flat&logo=google)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live Demo:** [YOUR VERCEL URL]  
**GitHub Repository:** [YOUR GITHUB REPOSITORY URL]

---

## 🎯 The Real-World Problem

India administers hundreds of Central and State welfare initiatives, offering direct benefit cash transfers (DBT), crop insurance subsidies, college tuition waivers, healthcare coverage, and collateral-free business capital.

Yet, millions of rightful citizens remain excluded from these benefits due to structural barriers:
1. **Scattered Portals**: Schemes are dispersed across dozens of disparate Ministry websites, state departments, and autonomous boards.
2. **Complex Legal Language**: Gazette notifications, SECC deprivation criteria, and landholding clauses are filled with bureaucratic jargon.
3. **Unclear Document Requirements**: Citizens lose productive work days traveling to government offices only to discover they lack a specific certificate format.
4. **Middlemen & Exploitation**: Citizens frequently fall prey to unauthorized agents charging exorbitant fees for services and forms that are legally 100% free.
5. **No Central Application Memory**: Citizens have no unified, private way to remember which schemes they explored, saved, or marked as applied.

---

## 💡 The Solution: SchemeSathi AI

**SchemeSathi AI** is a citizen-first welfare discovery and application tracking platform designed to remove friction between citizens and public welfare.

- **Transparent Deterministic Eligibility Engine**: Mathematical, rules-driven scoring that explains *precisely why* you qualify (Matched vs. Unmet vs. To Verify).
- **Google Gemini AI Assistant**: Grounded exclusively in verified scheme criteria to explain complex terms in plain language and translate insights into Indian languages.
- **Natural Language Intent Parsing**: Type *"I am a 21-yr student from Maharashtra with ₹2L income"* → AI extracts key attributes → Directly feeds the deterministic rules engine.
- **Official Source Protection**: Direct links pointing strictly to verified `.gov.in`, `.nic.in`, and official nodal portals. Zero touts, zero fake links.
- **Document Readiness Meter**: Interactive checklists enabling citizens to mark documents they possess and track readiness from 0% to 100%.
- **Multilingual Support**: Real-time language switching across **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- **Secure Authentication & Personal Profile**: Allows citizens to register, sign in, manage personal eligibility details, and securely access their own profile.
- **Scheme Activity & Milestone Tracking**: Automatically logs viewed schemes, shortlisted bookmarks, and marked-as-applied applications within a unified citizen dashboard.

---

## ✨ Key Features

- 🔍 **Multi-Parametric Scheme Discovery**: Filter programs across categories (Agriculture, Healthcare, Education, Housing, Business, Women & Family, Social Welfare) and government levels (Central vs. State).
- 🤖 **Conversational AI Assistance**: Ask situational questions like *"Can I apply if my father owns 3 acres of land?"* and receive contextual, grounded guidance.
- ⚖️ **Side-by-Side Scheme Comparison**: Compare benefits, application steps, and document checklists across up to 3 programs simultaneously.
- 📋 **Document Preparation Checklists**: Detailed breakdown of necessary identity, income, domicile, and caste certificates before applying.
- 👤 **Secure Account Management**: Private user authentication with session persistence, password hashing, and user data isolation.
- 📊 **Citizen Journey Dashboard**: Unified view of profile attributes, viewed history, saved bookmarks, and marked-as-applied schemes.
- ⚡ **Offline & Graceful Fallback**: The entire deterministic eligibility calculation, scheme directory, comparison engine, and local discovery tools run seamlessly even without external AI keys.

---

## 👤 User Authentication

SchemeSathi AI provides a dedicated, production-ready authentication layer:

- **Account Registration (`/register`)**: Citizens register with Full Name, Email, Username, and Password. Includes client- and server-side validation, password length checks, and confirmation matching.
- **Secure Sign In (`/login`)**: Citizens authenticate using their registered Email or Username alongside their password.
- **Password Security**: Passwords are never stored as plain text. Credential verification utilizes salted cryptographic password hashing (`bcrypt`), ensuring industry-standard protection.
- **Session Management**: Authenticated sessions are securely maintained via signed HTTP cookies, preventing unauthorized access. Passwords are never persisted in browser `localStorage`.
- **Protected User Routes**: Protected endpoints and pages (such as `/profile`) automatically redirect unauthenticated guests to `/login?redirect=/profile`.
- **User Data Isolation**: Every user record is cryptographically tied to that citizen's unique identifier. User A can never inspect, modify, or query data belonging to User B.

---

## 🧑‍💼 Personalized User Profile

Every registered citizen receives a personal profile to manage their welfare eligibility data in one place:

- **Identity & Contact**: Full Name, Username, verified Email, and optional Phone Number.
- **Demographics**: Date of Birth and Gender.
- **Geographic Domicile**: State and District/City (crucial for unlocking state-specific welfare packages).
- **Socio-Economic Information**: Occupation, Annual Household Income, and Social Category / Caste Group (General, OBC, SC, ST, EWS, Minority).
- **One-Click Update**: Citizens can edit their personal data anytime through an intuitive interface with immediate validation and feedback.
- **Intelligent Auto-Matching**: Saved profile attributes automatically populate eligibility checks across the platform, eliminating repetitive data entry.

---

## 📊 Personal Scheme Dashboard

The citizen dashboard (`/profile`) brings together a complete overview of the user's welfare discovery journey:

1. **Active Profile Snapshot**: Direct view of current domicile, occupation, and income attributes with quick editing capabilities.
2. **Schemes I've Viewed**: Comprehensive record of programs the user has explored, complete with viewing timestamps and direct links back to scheme details.
3. **Saved Schemes**: Dedicated shortlist of bookmarked welfare programs with current application stage indicators.
4. **Applied Schemes**: Clear ledger of schemes the user has marked as applied, tracking ongoing personal milestones.
5. **Recent Activity Audit**: Chronological timeline recording actions such as viewed schemes, saved bookmarks, applied markers, and profile modifications.

---

## 📌 Scheme Activity Tracking

To keep citizens organized throughout long multi-stage government application cycles, SchemeSathi AI integrates live activity tracking:

- 👁️ **View Tracking**: When an authenticated user opens any scheme details page (`/schemes/[id]`), the system logs a `VIEWED` activity record with deduplication to prevent feed clutter.
- 🔖 **Save / Bookmark Tracking**: Authenticated users can bookmark schemes directly from search cards or detail pages. Unauthenticated guests receive a polite sign-in prompt modal.
- 📝 **Application Milestone Tracking**: Citizens can mark schemes as "Applied" once they have submitted their paperwork to official government departments.
  > [!NOTE]
  > **Clear Transparency Notice**: Marking a scheme as "Applied" is an internal milestone tracker within SchemeSathi AI. It helps citizens record their personal progress and **does not** constitute an official application submission to government authorities. Official submissions must always be completed on genuine government portals linked on each scheme page.
- 🗑️ **User Control**: Citizens can remove saved bookmarks or change their application status at any time.

---

## 🏛️ Architecture: Why Separate AI from Eligibility?

> [!IMPORTANT]
> **Core Hackathon Principle:**  
> Large Language Models (LLMs) are exceptional at summarization, intent extraction, and conversational explanation, but can hallucinate legal criteria, misinterpret statutory ceilings, or provide inconsistent promises.  
> SchemeSathi AI strictly separates **Deterministic Computation** from **Generative AI Assistance**:
>
> 
                              ┌────────────────────────────────────────┐
                              │          Citizen User Input            │
                              │  (Questionnaire or Natural Language)   │
                              └──────────────────┬─────────────────────┘
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
    ┌───────────────────────────────┐                           ┌───────────────────────────────┐
    │     Gemini AI Intent Parser   │                           │     Structured Questionnaire  │
    │  Extracts: age, state, occ,   │                           │  Age, State, Income, Social,  │
    │    income from free text      │                           │  Housing, Farmer, Student...  │
    └──────────────┬────────────────┘                           └───────────────┬───────────────┘
                   │                                                            │
                   └─────────────────────────────┬──────────────────────────────┘
                                                 ▼
                                ┌───────────────────────────────────┐
                                │   Deterministic Rules Engine      │
                                │   (/lib/eligibility/engine.ts)    │
                                ├───────────────────────────────────┤
                                │ • Evaluates age, income ceilings  │
                                │ • Enforces State/Gender mandates  │
                                │ • Computes explainable weights    │
                                └─────────────────┬─────────────────┘
                                                  │
                                                  ▼
                        ┌───────────────────────────────────────────────────┐
                        │              Personalized Output                  │
                        ├───────────────────────────────────────────────────┤
                        │ • 🟢 Strong Match (>=75%)                         │
                        │ • 🟡 Possible Match (45-74%)                      │
                        │ • ⚪ Currently Unlikely (<45%)                     │
                        │ • Matched vs. Unmet vs. Unknown Checklist         │
                        └─────────────────┬─────────────────────────────────┘
                                          │
                                          ▼
                                ┌───────────────────┐
                                │  Gemini Explainer │
                                │  Simple language  │
                                │  Hindi / Marathi  │
                                └───────────────────┘
```

---

---

## 🔑 Core Architecture Principle

> **"AI understands the citizen.  
> Rules evaluate eligibility.  
> SchemeSathi explains the result.  
> The profile remembers the journey."**

1. **AI Understands**: Gemini extracts citizen intent from conversational text without forcing users through intimidating bureaucratic drop-downs.
2. **Rules Evaluate**: Hardcoded, mathematical logic validates strict legal rules with 100% predictability and zero hallucinations.
3. **SchemeSathi Explains**: Every recommendation explicitly enumerates which criteria matched, which failed, and what remains unknown.
4. **Profile Remembers**: Secure user profiles store personalized details and track application milestones across sessions.

---

## 📦 Verified Government Schemes Included (18 Programs)

| Scheme Name | Level | Category | Key Benefit | Official Portal |
|---|---|---|---|---|
| **PM-KISAN** | Central | Agriculture | ₹6,000 / year DBT | `pmkisan.gov.in` |
| **Ayushman Bharat (PM-JAY)** | Central | Healthcare | ₹5 Lakh / family Cashless | `beneficiary.nha.gov.in` |
| **PMAY - Urban (PMAY-U)** | Central | Housing | Up to ₹2.67 Lakh Subsidy | `pmaymis.gov.in` |
| **PMAY - Gramin (PMAY-G)** | Central | Housing | ₹1.30 Lakh Construction Grant | `pmayg.nic.in` |
| **PM MUDRA Yojana** | Central | Business | Up to ₹20 Lakh Collateral-Free Loan | `mudra.org.in` |
| **PM SVANidhi** | Central | Business | Up to ₹50,000 Vendor Loan @ 7% Sub. | `pmsvanidhi.mohua.gov.in` |
| **PM Vishwakarma** | Central | Business | ₹15k Tool Grant + ₹3L Loan @ 5% | `pmvishwakarma.gov.in` |
| **Post-Matric Scholarship** | Central | Education | Full Tuition + ₹13,500/yr Maint. | `scholarships.gov.in` |
| **NAPS Apprenticeship** | Central | Employment | ₹7,000 - ₹15,000/mo Stipend | `apprenticeshipindia.gov.in` |
| **Sukanya Samriddhi Yojana**| Central | Women & Family | 8.2% Sovereign Tax-Free Interest | `indiapost.gov.in` |
| **PM Matru Vandana (PMMVY)**| Central | Women & Family | ₹5,000 - ₹6,000 Maternity Cash | `pmmvy.wcd.gov.in` |
| **Atal Pension Yojana (APY)**| Central | Social Welfare | Guaranteed ₹1k - ₹5k/mo Pension | `npscra.nsdl.co.in` |
| **PM Shram Yogi Maan-dhan** | Central | Social Welfare | ₹3,000/mo Pension + 50% Govt Match | `maandhan.in` |
| **MJPJAY Maharashtra** | State (MH) | Healthcare | ₹5 Lakh Cashless Cover | `jeevandayee.gov.in` |
| **Majhi Ladki Bahin** | State (MH) | Women & Family | ₹1,500 / month Direct DBT | `ladkibahin.maharashtra.gov.in`|
| **MahaDBT Scholarship** | State (MH) | Education | 50% - 100% College Tuition Waiver | `mahadbt.maharashtra.gov.in`|
| **PM Fasal Bima (PMFBY)** | Central | Agriculture | Crop Damage Protection @ 1.5% Prem.| `pmfby.gov.in` |
| **Stand-Up India** | Central | Business | ₹10 Lakh - ₹1 Crore Enterprise Loan | `standupmitra.in` |

---

## 🧪 User Journey





### 1. Clone & Install
```bash
git clone <your-repo-url>
cd SchemeSaathi
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> [!NOTE]
> **Zero-Key Fallback Mode**: The entire platform (Questionnaire, Rules Engine, 18 Schemes, Comparison Table, Document Checklists, Saved Tracker, and Heuristic NLP Parser) runs seamlessly **even without** an API key!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---



## 🔒 Privacy & Official Safety Principles

- **No Aadhaar or Bank Secrets**: We never ask for or store sensitive 12-digit Aadhaar numbers, OTPs, or bank passwords.
- **Genuine Government URLs**: All official portals are validated domains (`.gov.in`, `.nic.in`, `.org.in`).
- **Legal Disclaimer**: Clearly states that SchemeSathi AI provides eligibility guidance and that final sanctioning rests exclusively with the relevant authority.

---

## 👥 Authors
1. Anshita Maturkar
2. Vedant Borkar
3. Gourav Bhendarkar
   
Built for the AI Hackathon with ❤️ for Indian citizens.

