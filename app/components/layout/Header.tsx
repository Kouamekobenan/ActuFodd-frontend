"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Logo } from "../../lib/constants/constant";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, LayoutDashboard } from "lucide-react"; // Utilisation de lucide-react pour des icônes propres

const NAV_LINKS = [
  { name: "Accueil", href: "/page" },
  { name: "Tendances", href: "/module/categories/views/page" },
  { name: "Portrait & rencontre", href: "/module/portrait" },
  { name: "Recettes", href: "/module/recette" },
  { name: "Vidéos", href: "/module/video" },
  { name: "Restau In", href: "/module/restau" },
  { name: "Agenda", href: "/module/agenda" },
  { name: "Contact", href: "/module/contact" },
];

export default function Header() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 transition-opacity hover:opacity-90"
        >
          <Image src={Logo} width={80} height={20} alt="Logo" priority />
        </Link>
        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-semibold text-gray-600 transition-colors hover:text-black uppercase tracking-wider"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        {/* Actions (Admin + Mobile Toggle) */}
        <div className="flex items-center gap-4">
          {/* Bouton Admin - Visible si connecté (Desktop & Mobile) */}
          {user && (
            <Link
              href="/module/admin/dashboard"
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all shadow-md"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {/* Menu Mobile - Animation d'ouverture */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-100 ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)} // Ferme le menu au clic
              className="text-sm font-bold text-gray-700 hover:text-black uppercase tracking-wide border-b border-gray-50 pb-2"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
