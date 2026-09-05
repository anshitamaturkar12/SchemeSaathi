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

India runs hundreds of Central and State welfare programs, providing direct cash assistance, crop insurance, college tuition waivers, healthcare coverage, and collateral-free business capital.

However, millions of eligible citizens miss out because:
1. **Scattered Portals**: Schemes are fragmented across dozens of separate Ministry websites and state portals.
2. **Complex Legal Language**: Strict income ceilings, SECC matrices, and landholding rules are hard to parse.
3. **Unclear Document Requirements**: Citizens waste days in physical government offices before finding out they were missing an income or caste certificate.
4. **Middlemen & Scams**: Citizens often fall victim to touts claiming fees for schemes and application procedures that are legally 100% free.
5. **No Central Application Memory**: Citizens have no unified, private way to remember which schemes they explored, saved, or marked as applied.

---

## 💡 The Solution: SchemeSathi AI

**SchemeSathi AI** bridges the gap between citizens and government welfare through:
- **Transparent Deterministic Eligibility Engine**: Mathematical rules-based scoring that explains *exactly why* you qualify (Matched vs. Unmet vs. To Verify).
- **Google Gemini AI Assistant**: Strictly grounded on verified scheme criteria to explain terms in simple everyday words, translate into Indian languages, and provide personalized guidance.
- **Natural Language Intent Parsing**: Type *"I am a 21-yr student from Maharashtra with ₹2L income"* → AI extracts your attributes → Feeds directly into the deterministic rules engine.
- **Official Source Protection**: Direct links to genuine `gov.in` and `nic.in` portals with official verification badges. Zero fake links.
- **Document Readiness Meter**: Interactive checklists allowing citizens to mark documents they possess and track readiness from 0% to 100%.
- **Multilingual Support**: Real-time language switching across **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- **Secure User Authentication & Profile**: Allows citizens to register, sign in, manage personal eligibility details, and access a personalized welfare dashboard across visits.
- **Scheme Activity Tracking**: Automatically tracks viewed schemes, shortlisted bookmarks, and marked-as-applied applications within a unified citizen dashboard.

---

## ✨ Key Features

- 🔍 **Multi-Parametric Scheme Discovery**: Filter programs across categories (Agriculture, Healthcare, Education, Housing, Business, Women & Family, Social Welfare) and government levels (Central vs. State).
- 🤖 **Conversational AI Assistance**: Ask situational questions like *"Can I apply if my father owns 3 acres of land?"* and receive contextual, grounded guidance.
- ⚖️ **Side-by-Side Scheme Comparison**: Compare benefits, application steps, and document checklists across up to 3 programs simultaneously.
- 📋 **Document Preparation Checklists**: Detailed breakdown of necessary identity, income, domicile, and caste certificates before applying.
- 👤 **User Registration & Secure Login**: Real authentication with password hashing, secure session management, and protected user-specific areas.
- 🧑‍💼 **Personalized User Profile**: Manage eligibility-related attributes (state, city, occupation, income, category) to power tailored scheme discovery.
- 📊 **Personalized Citizen Dashboard**: Unified view of active profile details, viewed schemes, saved bookmarks, applied programs, and recent activity.
- 📌 **Scheme Activity Tracking**: Keep track of viewed schemes, save bookmarks for later, and mark applications as applied for personal milestone tracking.
- 🌐 **Multilingual Vernacular Interface**: Toggle between English, Hindi, and Marathi seamlessly across the application.
- ⚡ **Offline & Graceful Fallback**: The entire deterministic eligibility calculation, scheme directory, comparison engine, and local discovery tools run seamlessly even without external AI keys.

---

## 👤 User Authentication

SchemeSathi AI provides a dedicated, production-ready authentication layer:

- **Account Registration (`/register`)**: Citizens register with Full Name, Email, Username, and Password. Includes client- and server-side validation, password length checks, and confirmation matching.
- **Secure Sign In (`/login`)**: Citizens authenticate using their registered Email or Username alongside their password.
- **Password Security**: Passwords are never stored as plain text. Credential verification utilizes salted cryptographic password hashing (`bcryptjs`), ensuring industry-standard protection.
- **Session Management**: Authenticated sessions are securely maintained via signed HTTP session cookies (`schemesaathi_session`), preventing unauthorized access. Passwords are never stored in browser `localStorage`.
- **Protected User Routes**: Protected endpoints and pages (such as `/profile`) automatically redirect unauthenticated guests to `/login?redirect=/profile`.
- **User Data Isolation**: Every user record is associated with that citizen's unique user identifier. User A can never inspect, modify, or query data belonging to User B.
- **Clean Logout**: Dedicated logout action that clears session tokens and resets client authentication state.

---

## 🧑‍💼 Personalized User Profile

Every registered citizen receives a personal profile to manage their welfare eligibility data in one place:

- **Identity & Contact**: Full Name, Username, verified Email, and optional Phone Number.
- **Demographics**: Date of Birth and Gender.
- **Geographic Domicile**: State and District/City (crucial for unlocking state-specific welfare packages).
- **Socio-Economic Information**: Occupation, Annual Household Income, and Social Category / Caste Group (General, OBC, SC, ST, EWS, Minority).
- **Profile Updates**: Citizens can edit and save their personal information anytime through an intuitive interface with immediate validation and feedback.
- **Tailored Discovery**: Saved profile attributes help citizens discover schemes matching their domicile, occupation, and financial background without repeatedly answering questionnaires from scratch.

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

To keep citizens organized throughout multi-stage government application cycles, SchemeSathi AI integrates live activity tracking:

- 👁️ **Viewed Schemes**: When an authenticated user opens any scheme details page (`/schemes/[id]`), the system logs a `VIEWED` activity record with deduplication to prevent feed clutter.
- 🔖 **Saved Schemes**: Authenticated users can bookmark schemes directly from search cards or detail pages for easy retrieval. Unauthenticated guests receive a polite sign-in prompt modal.
- 📝 **Applied Schemes (Personal Milestone Tracking)**: Citizens can mark schemes as "Applied" once they have submitted their paperwork to official government departments.
  > [!NOTE]
  > **Important Notice:** Marking a scheme as "Applied" is an internal personal tracking status within SchemeSathi AI. It helps citizens record their personal progress and **does not** mean that SchemeSathi has submitted an official application to the government. Official submissions must always be completed on genuine government portals linked on each scheme page.
- 🕒 **Recent Activity**: A chronological log of recent actions (viewed schemes, saved bookmarks, applied statuses, and profile updates) to resume previous discovery sessions effortlessly.
- 🗑️ **User Control**: Citizens can remove saved bookmarks or change their application status at any time.

---

## 🏛️ Architecture: Why Separate AI from Eligibility?

> [!IMPORTANT]
> **Core Hackathon Principle & Judge Defense:**  
> Large Language Models (LLMs) are exceptional at summarization, intent extraction, and conversational explanation, but can hallucinate legal criteria, misinterpret statutory ceilings, or provide inconsistent promises.  
> SchemeSathi AI strictly separates **Deterministic Computation** from **Generative AI Assistance**:

```
                              ┌────────────────────────────────────────┐
                              │            Citizen User                │
                              │  (Questionnaire, Search, Natural Lang) │
                              └───────────────────┬────────────────────┘
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         │                                        │                                        │
         ▼                                        ▼                                        ▼
┌──────────────────┐                    ┌──────────────────┐                     ┌──────────────────┐
│  Authentication  │                    │ Natural Language │                     │    Structured    │
│  & User Profile  │                    │  Intent Parser   │                     │  Questionnaire   │
│ (Login/Register) │                    │   (Gemini AI)    │                     │  (Multi-Step)    │
└────────┬─────────┘                    └─────────┬────────┘                     └─────────┬────────┘
         │                                        │                                        │
         │ (Profile Context)                      │ (Extracted Parameters)                 │ (Answers)
         └─────────────────────────┬──────────────┴────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │ Deterministic Rules Engine  │
                    │ (/lib/eligibility/engine.ts)│
                    ├─────────────────────────────┤
                    │ • Strict age & income caps  │
                    │ • State & gender mandates   │
                    │ • Category & occupation rule│
                    │ • Mathematical match score  │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │    Personalized Results     │
                    ├─────────────────────────────┤
                    │ • 🟢 Strong Match (>=75%)   │
                    │ • 🟡 Possible (45-74%)      │
                    │ • ⚪ Unlikely (<45%)        │
                    │ • Criteria Breakdown Matrix │
                    └──────────────┬──────────────┘
                                   │
         ┌─────────────────────────┴───────────────────────────┐
         │                                                     │
         ▼                                                     ▼
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│        Gemini Explainer         │           │    Scheme Activity Tracking     │
│ • Plain-language translation    │           │ • Viewed Schemes Log            │
│ • Hindi (हिंदी) & Marathi       │           │ • Saved Bookmarks Tracker       │
│ • Nuance & exception assistance │           │ • Personal "Applied" Milestones │
└─────────────────────────────────┘           │ • Citizen Profile Dashboard     │
                                              └─────────────────────────────────┘
```

---

## 🔑 Core Architecture Principle

> **"AI understands and explains.  
> The deterministic rules engine evaluates eligibility.  
> The user profile remembers the citizen's journey."**

- **AI Understands**: Gemini extracts citizen intent from conversational text without forcing users through intimidating bureaucratic drop-downs.
- **Rules Evaluate**: Hardcoded, mathematical logic validates strict legal rules with 100% predictability and zero hallucinations.
- **SchemeSathi Explains**: Every recommendation explicitly enumerates which criteria matched, which failed, and what remains unknown.
- **Profile Remembers**: Secure user profiles store personalized details and track application milestones across sessions.

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
| **Sukanya Samriddhi Yojana** | Central | Women & Family | 8.2% Sovereign Tax-Free Interest | `indiapost.gov.in` |
| **PM Matru Vandana (PMMVY)** | Central | Women & Family | ₹5,000 - ₹6,000 Maternity Cash | `pmmvy.wcd.gov.in` |
| **Atal Pension Yojana (APY)** | Central | Social Welfare | Guaranteed ₹1k - ₹5k/mo Pension | `npscra.nsdl.co.in` |
| **PM Shram Yogi Maan-dhan** | Central | Social Welfare | ₹3,000/mo Pension + 50% Govt Match | `maandhan.in` |
| **MJPJAY Maharashtra** | State (MH) | Healthcare | ₹5 Lakh Cashless Cover | `jeevandayee.gov.in` |
| **Majhi Ladki Bahin** | State (MH) | Women & Family | ₹1,500 / month Direct DBT | `ladkibahin.maharashtra.gov.in` |
| **MahaDBT Scholarship** | State (MH) | Education | 50% - 100% College Tuition Waiver | `mahadbt.maharashtra.gov.in` |
| **PM Fasal Bima (PMFBY)** | Central | Agriculture | Crop Damage Protection @ 1.5% Prem. | `pmfby.gov.in` |
| **Stand-Up India** | Central | Business | ₹10 Lakh - ₹1 Crore Enterprise Loan | `standupmitra.in` |

---

## 🧪 User Journey

```
[ NEW CITIZEN ]
       │
       ▼
1. Create Account (/register) ──────► Enters Name, Email, Username, Password
       │
       ▼
2. Setup Profile (/profile)   ──────► Enters State, Occupation, Income, Category
       │
       ▼
3. Discover Schemes           ──────► Uses Natural Language Query or Guided Questionnaire
       │
       ▼
4. Check Eligibility          ──────► Inspects Match Score, Matched vs. Unmet Criteria
       │
       ▼
5. Take Action                ──────► Bookmarks (Save) or Marks Scheme as Applied
       │
       ▼
6. Personal Dashboard         ──────► Tracks History, Bookmarks, and Application Milestones

─────────────────────────────────────────────────────────────────────────────

[ RETURNING CITIZEN ]
       │
       ▼
1. Sign In (/login)           ──────► Enters Credentials
       │
       ▼
2. Personal Dashboard         ──────► Inspects Saved Schemes & Recent Activity
       │
       ▼
3. Continue Discovery         ──────► Explores New Schemes or Launches AI Assistant
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router, Server Components & Route Handlers)
- **Frontend Core**: React 18, TypeScript 5.6
- **Styling & Icons**: Tailwind CSS 3.4, Lucide React, Framer Motion
- **Generative AI**: Google Gemini AI (`@google/generative-ai`)
- **Authentication & Security**:
  - Salting & Password Hashing: `bcryptjs`
  - Session Management: HMAC-SHA256 Signed HTTP Session Cookies (`schemesaathi_session`)
  - User Isolation: Authenticated session verification on all private profile and activity endpoints
- **Data & Persistence Layer**:
  - Production-ready PostgreSQL & Supabase Database integration (`@supabase/supabase-js`) with Row Level Security (RLS) policies
  - Resilient local persistent auth engine for offline and local development
- **Deterministic Rules Engine**: Custom mathematical scoring engine (`/lib/eligibility/engine.ts`)
- **Deployment Platform**: Vercel

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd SchemeSaathi
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to create `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and configure your keys:
```env
# Google Gemini API Key (Get a free key at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Production Database & Authentication (Optional for local development)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Optional: Session Encryption Secret
SESSION_SECRET=your_secure_random_session_secret_key_here
```

> [!IMPORTANT]
> - `.env.local` must **never** be committed to GitHub or version control.
> - Real API keys and secrets should never be placed in `README.md` or `.env.example`.
> - `.env.example` contains variable names and placeholders only.

> [!NOTE]
> **Zero-Key Fallback Mode**: The entire platform (Questionnaire, Rules Engine, 18 Schemes, Comparison Table, Document Checklists, Saved Tracker, Local Authentication, and Heuristic NLP Parser) runs seamlessly **even without** an external API key!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Vercel Deployment

SchemeSathi AI is built and optimized for continuous deployment on **Vercel**:

```
Local Changes ──► Git Commit ──► Git Push ──► GitHub ──► Vercel (Auto-Build) ──► Live SchemeSathi
```

### Deployment Steps:
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `SchemeSaathi` repository.
4. In the **Environment Variables** settings on Vercel, configure:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL` (if using remote database)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using remote database)
   - `SESSION_SECRET`
5. Click **Deploy**. Vercel will build and deploy the production application automatically on every push to `main`.

---

## 🔒 Privacy & Official Safety Principles

- **No Aadhaar or Sensitive Secrets**: SchemeSathi AI never asks for, collects, or stores 12-digit Aadhaar numbers, OTPs, or bank passwords.
- **Genuine Government URLs**: All official portals link exclusively to validated government domains (`.gov.in`, `.nic.in`, `.org.in`).
- **User-Specific Data Protection**: Profile details and activity history are isolated to the authenticated user's account and session.
- **Environment Variable Protection**: All API keys and secrets are loaded server-side and never exposed to client browser bundles.
- **Disclaimer of Authority**: SchemeSathi provides eligibility guidance and does not replace official government departments.

---

## ⚠️ Disclaimer

SchemeSathi AI provides informational eligibility guidance based on published public scheme information and the deterministic rules implemented in the platform.

- Final eligibility, approval, benefit amount, document acceptance, and sanctioning decisions are made exclusively by the relevant Central or State Government authority.
- SchemeSathi AI does not replace official government portals or authorities.
- Marking a scheme as "Applied" within SchemeSathi AI acts as a personal organizational tracker and does not transmit an application to the government.

---

## 🏆 Why SchemeSathi AI Stands Out

| Dimension | Typical Government Portals | Generic AI Chatbots | SchemeSathi AI |
|---|---|---|---|
| **Eligibility Assessment** | Manual browsing of complex PDFs | Prone to hallucinations & wrong rules | **100% Deterministic mathematical rules engine** |
| **User Interface** | Dense bureaucratic forms | Free-form text without checklists | **Clean, accessible citizen cards + Readiness meter** |
| **Personalization** | Requires starting over on every visit | Stateless chats that forget user details | **Persistent profile, viewed history & application milestones** |
| **Language Access** | Mostly formal English & complex Hindi | Variable accuracy in regional vernacular | **Contextual multilingual support (English, Hindi, Marathi)** |
| **Verification & Safety** | Hard to discern real vs. phishing links | May invent hallucinated URLs | **Guaranteed official government domain verification** |

> **"AI understands the citizen.  
> Rules evaluate eligibility.  
> SchemeSathi explains the result.  
> The profile remembers the journey."**

Instead of merely acting as a search catalogue, SchemeSathi AI guides citizens through the complete journey: **discovering** programs, **understanding** nuances, **verifying** documents, **saving** bookmarks, and **tracking** personal milestones.

---

## 🌍 Social Impact

- **Empowering Grassroots Citizens**: Enables smallholder farmers, informal daily-wage earners, and first-generation college students to understand their entitlements in minutes.
- **Bridging the Digital Divide**: Brings simple language explanations and vernacular accessibility to families who struggle with administrative English.
- **Eliminating Touts & Exploitation**: Direct, verified links and transparent document requirements protect underprivileged applicants from predatory middlemen.
- **Document Preparedness**: Eliminates wasted visits to government offices by providing accurate, upfront document checklists.

---

## 👥 Authors

Built with dedication for Indian citizens:

1. **Anshita Maturkar**
2. **Vedant Borkar**
3. **Gourav Bhendarkar**

Built for the AI Hackathon with ❤️ for Indian citizens.

---

## 📄 License

This project is open-source and distributed under the **MIT License**. See the `LICENSE` file for more details.
