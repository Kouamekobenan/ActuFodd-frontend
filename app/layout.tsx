import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// 🎯 SEO optimisé pour ActuFoody
export const metadata: Metadata = {
  // Informations de base
  title: {
    default: "ActuFoody - Toute l'actualité culinaire en Côte d'Ivoire",
    template: "%s | ActuFoody",
  },
  description:
    "Découvrez les dernières tendances culinaires, plats du jour et restaurants incontournables en Côte d'Ivoire. Commandez vos repas préférés en quelques clics sur ActuFoody.",
  // Mots-clés pertinents
  keywords: [
    "ActuFoody",
    "actualité culinaire",
    "restaurants Côte d'Ivoire",
    "plat du jour Abidjan",
    "commande repas en ligne",
    "tendances food",
    "livraison restaurant",
    "cuisine ivoirienne",
    "food delivery",
    "restaurants Abidjan",
  ],
  // Auteur et informations du site
  authors: [{ name: "ActuFoody" }],
  creator: "ActuFoody",
  publisher: "ActuFoody",

  // Configuration de la langue et région
  applicationName: "ActuFoody",
  category: "Food & Beverage",

  // Open Graph (réseaux sociaux)
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://www.actufoody.com",
    siteName: "ActuFoody",
    title: "ActuFoody - Toute l'actualité culinaire en Côte d'Ivoire",
    description:
      "Découvrez les dernières tendances culinaires, plats du jour et restaurants incontournables en Côte d'Ivoire.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ActuFoody - Actualité culinaire",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "ActuFoody - Toute l'actualité culinaire en Côte d'Ivoire",
    description:
      "Découvrez les dernières tendances culinaires, plats du jour et restaurants incontournables.",
    images: ["/twitter-image.jpg"],
    creator: "@actufoody",
  },

  // Robots et indexation
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icônes et manifeste
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/logo.jpeg", sizes: "16x16", type: "image/jpeg" },
      { url: "/images/logo.jpeg", sizes: "32x32", type: "image/jpeg" },
    ],
    apple: [{ url: "/images/logo.jpeg", sizes: "180x180", type: "image/jpeg" }],
  },
  manifest: "/site.webmanifest",

  // Vérification
  verification: {
    google: "votre-code-google-verification",
  },

  // Autres métadonnées
  metadataBase: new URL("https://www.actufoody.com"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-CI": "/",
      "fr-FR": "/fr",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#FF6B35" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ActuFoody",
              description:
                "Plateforme d'actualités culinaires et de commande de repas en Côte d'Ivoire",
              url: "https://www.actufoody.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.actufoody.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "ActuFoody",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.actufoody.com/logo.png",
                },
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
