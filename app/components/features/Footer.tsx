"use client";
import React, { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  const footerNavigation = {
    explore: [
      { name: "À la une", href: "#" },
      { name: "Dernières Actualités", href: "#" },
      { name: "Recettes", href: "#" },
      { name: "Restaurants", href: "#" },
    ],
    support: [
      { name: "À propos", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Mentions Légales", href: "#" },
      { name: "Confidentialité", href: "#" },
    ],
    social: [
      { name: "Instagram", href: "#" },
      { name: "Facebook", href: "#" },
      { name: "YouTube", href: "#" },
    ],
  };

  const handleSubscribe = () => {
    if (email) {
      console.log("Inscription:", email);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-950 text-white pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-14 md:mb-16">
          {/* Section Logo & Bio */}
          <div className="space-y-4 sm:space-y-6">
            <a href="/" className="inline-block">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">
                Actu<span className="text-orange-600">Foody</span>
              </h2>
            </a>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Le premier journal digital dédié à l'exploration culinaire et à
              l'actualité gastronomique. Découvrez les saveurs de demain,
              aujourd'hui.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-orange-500 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          {/* Navigation: Explorer */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-orange-600 mb-6 sm:mb-8">
              Explorer
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {footerNavigation.explore.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation: Support */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-orange-600 mb-6 sm:mb-8">
              Informations
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Newsletter */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-orange-600 mb-6 sm:mb-8">
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm font-light">
              Inscrivez-vous pour recevoir nos critiques exclusives.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-600 transition-colors w-full"
              />
              <button
                onClick={handleSubscribe}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-widest py-3 rounded-lg transition-all active:scale-95 w-full"
              >
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Barre de Copyright */}
        <div className="pt-8 sm:pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center md:text-left">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            © {currentYear} ACTYFOODY — TOUS DROITS RÉSERVÉS.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <span className="text-[10px] text-gray-600 uppercase font-black">
              Design by actyfody Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
