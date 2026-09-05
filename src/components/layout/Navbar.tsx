"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useSavedSchemes } from "@/context/SavedSchemesContext";
import { useAuth } from "@/context/AuthContext";
import LanguageSelector from "./LanguageSelector";
import {
  Sparkles,
  Search,
  Compass,
  Scale,
  Bookmark,
  Bot,
  LayoutDashboard,
  Menu,
  X,
  FileCheck2,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { count: savedCount } = useSavedSchemes();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const navLinks = [
    { href: "/", label: t("navHome"), icon: null },
    { href: "/find", label: t("navFind"), icon: Search },
    { href: "/schemes", label: t("navExplore"), icon: Compass },
    { href: "/compare", label: t("navCompare"), icon: Scale },
    {
      href: "/saved",
      label: t("navSaved"),
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : null,
    },
    { href: "/assistant", label: t("navAssistant"), icon: Bot, isAi: true },
    { href: "/dashboard", label: t("navDashboard"), icon: LayoutDashboard },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 rounded-lg p-1"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center text-white shadow-md shadow-navy-950/10 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5 text-sky-300" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-[8px] font-bold text-navy-950 shadow-sm">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-navy-900 leading-none">
                SchemeSathi <span className="text-sky-600 font-extrabold text-sm uppercase px-1.5 py-0.5 rounded bg-sky-50 ml-0.5">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide mt-0.5 hidden sm:inline">
                Govt Scheme Eligibility
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? "text-navy-900 bg-navy-50 font-semibold"
                      : "text-slate-600 hover:text-navy-800 hover:bg-slate-50"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 ${
                        link.isAi
                          ? "text-sky-600"
                          : active
                          ? "text-navy-700"
                          : "text-slate-400"
                      }`}
                    />
                  )}
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-navy-800 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSelector />

            {/* Auth Controls */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/profile"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    pathname.startsWith("/profile")
                      ? "bg-navy-900 text-white shadow-sm"
                      : "text-navy-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/80"
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.full_name.split(" ")[0]}</span>
                  <span className="sm:hidden">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Link
                  href="/login"
                  className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs sm:text-sm font-semibold text-navy-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            <Link
              href="/find"
              className="hidden md:inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-navy-800 to-navy-900 hover:from-navy-700 hover:to-navy-800 rounded-xl shadow-sm hover:shadow transition-all transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t("findMySchemes")}</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-navy-50 text-navy-900 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4 text-navy-600" />}
                  <span>{link.label}</span>
                </div>
                {link.badge !== null && link.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-navy-800 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Mobile Auth Section */}
          <div className="pt-3 pb-2 border-t border-slate-200">
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    pathname.startsWith("/profile")
                      ? "bg-navy-50 text-navy-900"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <User className="w-4 h-4 text-sky-600" />
                  <span>My Profile ({user.full_name})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-navy-900 bg-white hover:bg-slate-50 text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 px-3 rounded-xl border border-navy-800 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/find"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-xl shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t("findMySchemes")}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
