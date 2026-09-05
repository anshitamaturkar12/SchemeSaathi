import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { SavedSchemesProvider } from "@/context/SavedSchemesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "SchemeSathi AI | Your Personal Government Scheme Eligibility Assistant",
  description:
    "Discover government schemes you may be eligible for, understand your welfare benefits, and apply with confidence. Powered by AI and deterministic rules engine.",
  keywords: [
    "Government Schemes",
    "India Welfare",
    "PM Kisan",
    "Ayushman Bharat",
    "Scholarship",
    "Eligibility Checker",
    "SchemeSathi AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <LanguageProvider>
          <AuthProvider>
            <ProfileProvider>
              <SavedSchemesProvider>
                <Navbar />
                <main className="flex-1 w-full">{children}</main>
                <Footer />
              </SavedSchemesProvider>
            </ProfileProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

