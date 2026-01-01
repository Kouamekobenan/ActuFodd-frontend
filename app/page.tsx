"use client";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-x-hidden bg-white p-4 sm:p-8">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTEsMTQ2LDYwLDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      {/* Floating Shapes - Hidden on very small screens to avoid clutter */}
      <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="hidden sm:block absolute bottom-32 right-20 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6 md:space-y-8 max-w-3xl mx-auto w-full">
        {/* Logo */}
        <div className="relative group">
          <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative bg-white p-2 md:p-3 rounded-full shadow-xl ring-2 ring-orange-100 transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.jpeg"
              alt="ActuFoody logo"
              width={100} // Plus petit sur mobile
              height={100}
              className="rounded-full md:w-[140px] md:h-[140px]"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-2 md:space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 animate-gradient">
            ActuFoody
          </h1>
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            <p className="text-orange-600 text-[10px] md:text-sm font-bold tracking-widest uppercase">
              Bientôt Disponible
            </p>
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-4 px-2">
          <p className="text-lg md:text-2xl text-gray-700 font-light leading-relaxed max-w-2xl">
            Nous préparons une expérience sur l&apos;actualité culinaire{" "}
            <span className="text-orange-600 font-semibold">
              exceptionnelle
            </span>
            <br className="hidden sm:block" /> pour vous informer sur les
            meilleurs plats.
          </p>

          {/* Tags - Better wrap on mobile */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 pt-2">
            {[
              { emoji: "🍽️", label: "Découvertes" },
              { emoji: "⭐", label: "Recommandations" },
              { emoji: "📍", label: "Proximité" },
            ].map((tag, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-gray-600 bg-orange-50/50 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-orange-100"
              >
                <span className="text-xl">{tag.emoji}</span>
                <span className="text-xs md:text-sm font-semibold">
                  {tag.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-gray-500 text-xs md:text-sm font-medium">
            Lancement prévu prochainement
          </p>
        </div>

        {/* Newsletter Section */}
        <div className="w-full max-w-md pt-4">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-5 md:p-6 shadow-lg">
            <p className="text-gray-700 text-xs md:text-sm text-center mb-4 font-medium">
              Soyez notifié du lancement 🔔
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-4 py-3 bg-white border border-orange-200 rounded-xl text-sm md:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <button className="whitespace-nowrap px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
                M&apos;avertir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Adjusted for small screens */}
      <footer className="mt-12 mb-6 text-center z-10 px-4 md:absolute md:bottom-6">
        <p className="text-gray-600 text-[10px] md:text-xs font-medium">
          © {new Date().getFullYear()} ActuFoody — Tous droits réservés
        </p>
        <p className="text-gray-400 text-[10px] mt-1">
          Fait avec ❤️ pour les amoureux de la gastronomie
        </p>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </main>
  );
}
