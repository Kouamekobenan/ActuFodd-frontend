import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-orange-20000 to-red-200 text-white p-4">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo (facultatif) */}
        {/* <Image
          src="/logo.png" 
          alt="ActuFood logo"
          width={120}
          height={120}
          className="rounded-full shadow-lg"
        /> */}

        {/* Titre principal */}
        <h1 className="text-5xl font-extrabold">🍽️ ActuFood</h1>

        {/* Message d’attente */}
        <p className="text-lg max-w-md">
          Notre site est actuellement en{" "}
          <span className="font-semibold">développement</span>.
          <br /> Nous préparons quelque chose de délicieux pour vous !
        </p>

        {/* Ligne de séparation */}
        <div className="w-24 h-1 bg-white/60 rounded-full"></div>

        {/* Message complémentaire */}
        <p className="text-sm opacity-80">
          Revenez bientôt pour découvrir l’univers <strong>ActuFood</strong> 🍔
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-xs opacity-70">
        © {new Date().getFullYear()} ActuFood — Tous droits réservés
      </footer>
    </main>
  );
}
