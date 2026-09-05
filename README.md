# SchemeSathi AI 
> **"Your Personal Government Scheme Eligibility Assistant"**  
> *Discover the government welfare schemes you may be eligible for — in minutes, not hours.*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini%20AI-1.5%20Flash-4285F4?style=flat&logo=google)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 The Real-World Problem

India runs hundreds of Central and State welfare programs, providing direct cash assistance, crop insurance, college tuition waivers, healthcare coverage, and collateral-free business capital.

However, millions of eligible citizens miss out because:
1. **Scattered Portals**: Schemes are fragmented across dozens of separate Ministry websites.
2. **Complex Legal Language**: Strict income ceilings, SECC matrices, and landholding rules are hard to parse.
3. **Unclear Document Requirements**: Citizens waste days in physical government offices before finding out they were missing an income or caste certificate.
4. **Middlemen & Scams**: Citizens often fall victim to touts claiming fees for schemes that are 100% free.

---

## 💡 The Solution: SchemeSathi AI

**SchemeSathi AI** bridges the gap between citizens and government welfare through:
- **Transparent Deterministic Eligibility Engine**: Mathematical rules-based scoring that explains *exactly why* you qualify (Matched vs. Unmet vs. To Verify).
- **Google Gemini AI Assistant**: Strictly grounded on verified scheme criteria to explain terms in simple everyday words, translate into Indian languages, and provide personalized guidance.
- **Natural Language Intent Parsing**: Type *"I am a 21-yr student from Maharashtra with ₹2L income"* → AI extracts your attributes → Feeds directly into the deterministic rules engine.
- **Official Source Protection**: Direct links to genuine `gov.in` and `nic.in` portals with official verification badges. Zero fake links.
- **Document Readiness Meter**: Interactive checklists allowing citizens to mark documents they possess and track readiness from 0% to 100%.
- **Multilingual Support**: Real-time language switching across **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.

---

## 🏛️ Architecture: Why Separate AI from Eligibility?

> [!IMPORTANT]
> **Key Hackathon Pitch & Judge Defense:**  
> Large Language Models (LLMs) can hallucinate legal rules or make inconsistent eligibility promises.  
> SchemeSathi AI strictly separates **Deterministic Computation** from **Generative AI Assistance**:

```
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

## 🚀 Getting Started

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

