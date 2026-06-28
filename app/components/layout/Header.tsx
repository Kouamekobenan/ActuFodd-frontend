"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Logo } from "../../lib/constants/constant";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";

const NAV_LINKS = [
  { name: "Accueil", href: "/page" },
  { name: "Tendances", href: "/module/categories/views/page" },
  { name: "Portrait", href: "/module/portrait" },
  { name: "Recettes", href: "/module/recette" },
  { name: "Vidéos", href: "/module/video" },
  { name: "Restau In", href: "/module/restau" },
  { name: "Agenda", href: "/module/agenda" },
  { name: "Contact", href: "/module/contact" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 text-white hidden md:block">
        <div className="container mx-auto px-6 flex items-center justify-between py-1.5">
          <p className="text-[11px] tracking-wider text-gray-400 font-medium">
            Le média culinaire ivoirien — Afrique &amp; Moyen-Orient
          </p>
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <span>Abidjan, Côte d'Ivoire 🇨🇮</span>
          </div>
        </div>
      </div>

      {/* ── Main bar ───────────────────────────────────────────────────────── */}
      <div className="container mx-auto flex items-center justify-between px-5 md:px-6 py-3 md:py-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
          <Image src={Logo} width={90} height={24} alt="ActuFoody" priority />
        </Link>

        {/* Nav — Desktop */}
        <nav className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative px-3 py-2 text-[12px] font-bold uppercase tracking-widest transition-colors ${
                isActive(link.href)
                  ? "text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions — Desktop */}
        <div className="flex items-center gap-3">

          {user ? (
            // ── Logged-in user ──────────────────────────────────────────────
            <div className="hidden sm:flex items-center gap-2">
              {/* Admin link */}
              <Link
                href="/module/admin/dashboard"
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-all"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border-2 border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[11px] font-black uppercase">
                      {user.name?.charAt(0) ?? "A"}
                    </span>
                  </div>
                  <span className="text-[12px] font-bold text-gray-800 max-w-[90px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Connecté en tant que</p>
                      <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={async () => { setUserMenuOpen(false); await logout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                    >
                      <LogOut size={15} />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // ── Guest ───────────────────────────────────────────────────────
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/module/auth/views/login">
                <button className="flex items-center gap-2 border-2 border-gray-200 hover:border-orange-500 text-gray-700 hover:text-orange-600 px-4 py-2 rounded-xl text-[12px] font-bold transition-all">
                  <LogIn size={14} />
                  Se connecter
                </button>
              </Link>
            </div>
          )}

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="xl:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ────────────────────────────────────────────────────── */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 px-5 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${
                isActive(link.href)
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              )}
            </Link>
          ))}

          {/* Separator */}
          <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-black uppercase">
                      {user.name?.charAt(0) ?? "A"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/module/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold"
                >
                  <LayoutDashboard size={16} />
                  Dashboard Admin
                </Link>
                <button
                  onClick={async () => { setMobileOpen(false); await logout(); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                href="/module/auth/views/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-orange-200"
              >
                <LogIn size={16} />
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
