"use client";

import React from "react";
import { Send, ArrowRight } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/features/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-orange-100 selection:text-orange-900">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* --- Section Header --- */}
            <header className="mb-20">
              <div className="inline-flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-orange-700 text-xs font-bold uppercase tracking-widest">
                  Support Disponible
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
                Parlons de votre{" "}
                <span className="text-orange-600 italic">projet.</span>
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                Besoin d'un renseignement ou d'une étude personnalisée ? Notre
                équipe d'experts vous accompagne dans chaque étape de votre
                projet.
              </p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* --- Left Column: Info Cards --- */}
              <aside className="lg:col-span-5 space-y-4">
                {/* Visual Decorative Element */}
                <div className="hidden lg:block p-8 bg-orange-600 rounded-[2.5rem] text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">
                      Une question urgente ?
                    </h3>
                    <p className="text-orange-100 mb-6">
                      Nos conseillers vous répondent en direct sur notre chat.
                    </p>
                    <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-bold text-sm inline-flex items-center hover:bg-orange-50 transition-colors">
                      Lancer le chat <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-500 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </aside>

              {/* --- Right Column: Form --- */}
              <section className="lg:col-span-7">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/40 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Envoyez un message
                  </h2>

                  <form
                    className="space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Marc Lefebvre"
                          className="w-full bg-gray-50 border-transparent border-2 focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="marc@entreprise.com"
                          className="w-full bg-gray-50 border-transparent border-2 focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                        Sujet de votre demande
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Réservation groupe ou partenariat"
                        className="w-full bg-gray-50 border-transparent border-2 focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Comment pouvons-nous vous aider ?"
                        className="w-full bg-gray-50 border-transparent border-2 focus:border-orange-500 focus:bg-white px-5 py-4 rounded-2xl outline-none transition-all placeholder:text-gray-300 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 group shadow-lg shadow-gray-900/10 hover:shadow-orange-600/20"
                    >
                      <span>Envoyer ma demande</span>
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
