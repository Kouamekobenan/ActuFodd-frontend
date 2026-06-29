"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Presentation() {
  const t = useTranslations("presentation");
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-300" />

      <div className="container mx-auto px-5 md:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Text ── */}
          <div className="flex flex-col">

            {/* Badge */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-orange-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-orange-600">
                {t("badge")}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-gray-900">
              Actu
              <span className="relative inline-block text-orange-500">
                foody
                {/* underline decoration */}
                <span className="absolute -bottom-1 left-0 h-1 w-full bg-orange-200 rounded-full" />
              </span>
              <span className="text-gray-400">.com</span>
            </h1>

            {/* Excerpt + expand */}
            <div className="mb-6">
              <p className="text-base md:text-lg leading-relaxed text-gray-600">
                {t("excerpt")}
              </p>
              {/* Expanded text */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-base md:text-lg leading-relaxed text-gray-600 border-l-4 border-orange-200 pl-4">
                  {t("fullText")}
                </p>
              </div>

              {/* Toggle button */}
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-4 flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors group"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> {t("collapse")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    {t("readMore")}
                  </>
                )}
              </button>
            </div>
            {/* Stats row */}
            {/* <div className="mb-8 flex items-center gap-6 md:gap-8 py-5 border-y border-gray-100">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl md:text-2xl font-black text-gray-900">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div> */}
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/module/categories/views/page">
                <button className="group flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02]">
                  {t("discoverTrends")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/module/recette">
                <button className="flex items-center gap-2 border-2 border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-50">
                  {t("ourRecipes")}
                </button>
              </Link>
            </div>
          </div>
          {/* ── Right: Image ── */}
          <div className="relative">
            {/* Decorative background square */}
            <div className="absolute -top-4 -right-4 w-3/4 h-3/4 bg-orange-50 rounded-3xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-1/2 h-1/2 bg-gray-100 rounded-3xl -z-10" />

            {/* Main image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                alt="Plat gastronomique"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                sizes="(max-width: 1024px) 80vw, 50vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating tag bottom-left */}
              {/* <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                  <p className="text-[10px] uppercase tracking-widest text-orange-600 font-black mb-0.5">
                    Média culinaire
                  </p>
                  <p className="text-sm font-bold text-gray-900">Basé en Afrique & Moyen-Orient</p>
                </div>
                <div className="bg-orange-600 rounded-2xl px-4 py-3 shadow-lg text-center">
                  <p className="text-xs font-black text-white/80 uppercase tracking-wide">Depuis</p>
                  <p className="text-lg font-black text-white leading-none">2025</p>
                </div>
              </div> */}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
