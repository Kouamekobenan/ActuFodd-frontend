import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function Presentation() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Texte de présentation */}
          <div className="flex-1 text-justify lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-orange-600">
              L'univers culinaire
            </span>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 lg:text-7xl">
              Actu<span className="text-orange-500">foody.com</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 lg:text-xl">
              est un média numérique ivoirien dédié à l’univers de la
              gastronomie sous toutes ses formes : cuisine, agriculture,
              innovation alimentaire, patrimoine culinaire, métiers du goût et
              culture de l’assiette. Né d’une passion pour les saveurs locales
              et une curiosité pour les tendances mondiales, actufoody .com
              raconte la nourriture comme on raconte une histoire avec rigueur,
              respect et émotion. Nous donnons la parole aux cuisiniers de rue
              comme aux chefs étoilés, aux producteurs de fonio comme aux
              food-techs émergentes, aux chercheurs en nutrition comme aux
              activistes de la souveraineté alimentaire. Basé à Abidjan,
              actufoody.com s’adresse à une audience exigeante, curieuse et
              engagée en Côte d’Ivoire, en Afrique et dans la diaspora.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/module/categories/views/page">
                <button className="rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white transition-transform hover:scale-105 hover:bg-gray-800">
                  Découvrir les tendances
                </button>
              </Link>
              <Link href="/module/recette">
                {" "}
                <button className="rounded-lg border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50">
                  Nos recettes
                </button>{" "}
              </Link>
            </div>
          </div>
          {/* Image de présentation */}
          <div className="relative flex-1">
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                alt="Plat gastronomique"
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            {/* Décoration d'arrière-plan */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-64 w-64 rounded-full bg-orange-100 blur-3xl opacity-70"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
