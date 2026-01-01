"use client";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-white p-4">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.03),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTEsMTQ2LDYwLDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      {/* Floating Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-32 right-20 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-3xl mx-auto">
        {/* Logo with Subtle Shadow */}
        <div className="relative group">
          <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative bg-white p-3 rounded-full shadow-xl ring-2 ring-orange-100 transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.jpeg"
              alt="ActuFoody logo"
              width={140}
              height={140}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-3">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 animate-gradient">
            ActuFoody
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
            <p className="text-orange-600 text-sm font-bold tracking-widest uppercase">
              Bientôt Disponible
            </p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-4 px-4">
          <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed max-w-2xl">
            Nous préparons une expérience sur l&apos;actualité culinaire{" "}
            <span className="text-orange-600 font-semibold">
              exceptionnelle
            </span>
            <br className="hidden sm:block" />
            pour vous permettre d&apos;être informés meilleurs aux plats des
            restaurants.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-gray-600 bg-orange-50 px-4 py-2 rounded-full">
              <span className="text-2xl">🍽️</span>
              <span className="text-sm font-semibold">Découvertes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-orange-50 px-4 py-2 rounded-full">
              <span className="text-2xl">⭐</span>
              <span className="text-sm font-semibold">Recommandations</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-orange-50 px-4 py-2 rounded-full">
              <span className="text-2xl">📍</span>
              <span className="text-sm font-semibold">Proximité</span>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex flex-col items-center gap-4 pt-6">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            Lancement prévu prochainement
          </p>
        </div>

        {/* Newsletter/Notify Section */}
        <div className="w-full max-w-md pt-8">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 shadow-lg">
            <p className="text-gray-700 text-sm text-center mb-4 font-medium">
              Soyez notifié du lancement 🔔
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-4 py-3 bg-white border border-orange-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95">
                Notifier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center z-10 px-4">
        <p className="text-gray-600 text-xs font-medium">
          © {new Date().getFullYear()} ActuFoody — Tous droits réservés
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Fait avec ❤️ pour les amoureux de la gastronomie
        </p>
      </footer>

      {/* Custom CSS for animations */}
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
