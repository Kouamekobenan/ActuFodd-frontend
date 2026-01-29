"use client";

import React from "react";
import { Send } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/features/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-orange-100 selection:text-orange-900">
      <Header />

      {/* Réduction du padding haut sur mobile (pt-12 -> pt-6) */}
      <main className="pt-6 md:pt-12 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* --- Section Header --- */}
            <header className="mb-10 md:mb-16 text-center">
              <div className="inline-flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                {/* Optionnel : ajout d'un petit texte ici si besoin */}
              </div>

              {/* Taille de texte adaptative : text-3xl sur mobile, 5xl+ sur desktop */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                Contactez-<span className="text-orange-600 italic">nous</span>
              </h1>
            </header>

            {/* --- Formulaire centré --- */}
            <section>
              {/* Padding réduit sur mobile (p-6) pour gagner de la place latérale */}
              <div className="bg-white rounded-[2rem] p-6 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 mx-auto">
                <form
                  className="space-y-5 md:space-y-6"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
                      >
                        Nom & Prénoms
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Ex: Marc Lefebvre"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all placeholder:text-gray-400 text-base"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="marc@entreprise.com"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all placeholder:text-gray-400 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="tel"
                      className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
                    >
                      Téléphone
                    </label>
                    <input
                      id="tel"
                      type="tel"
                      placeholder="Ex: 01000299"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all placeholder:text-gray-400 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all placeholder:text-gray-400 resize-none text-base"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-4 md:py-5 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 group shadow-lg shadow-gray-900/10 hover:shadow-orange-600/20 active:scale-95 md:hover:scale-[1.02]"
                  >
                    <span className="text-sm md:text-base">
                      Envoyer ma demande
                    </span>
                    <Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
