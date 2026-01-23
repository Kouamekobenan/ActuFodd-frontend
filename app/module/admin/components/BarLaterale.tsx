import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function BarLaterale() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // On récupère 'user' et 'logout' du contexte

  const menuItems = [
    {
      href: "/module/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { href: "/module/admin/posts", label: "Posts", icon: FileText },
    {
      href: "/module/admin/categories",
      label: "Catégories",
      icon: FolderOpen,
    },
    { href: "/module/auth/views/register", label: "Admins", icon: Users },
  ];
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Accès restreint
          </h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder au panneau d'administration.
          </p>
          <Link
            href="/module/auth/views/login"
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // Composant réutilisable pour le profil utilisateur
  const UserProfile = () => (
    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl mb-4">
      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
        {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={20} />}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-semibold truncate">
          {user.name || "Administrateur"}
        </p>
        <p className="text-xs text-gray-400 truncate">{user.email}</p>
      </div>
      <button
        onClick={logout}
        className="text-gray-400 hover:text-red-400 transition-colors"
        title="Déconnexion"
      >
        <LogOut size={18} />
      </button>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 bg-gray-900 text-white shadow-lg">
        <div className="p-6 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-800">
          {/* Titre avec Icône */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Admin Panel
            </h1>
          </div>

          {/* Lien vers le site stylisé en bouton discret */}
          <Link
            href="/page"
            target="_blank"
            className="group flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-400 border border-gray-700 rounded-md hover:text-white hover:border-gray-500 hover:bg-gray-800 transition-all duration-200"
          >
            <span>Visitez le site</span>
            <ExternalLink
              size={14}
              className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <Icon className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Section Utilisateur Connecté (Desktop) */}
        <div className="p-4 border-t border-gray-800">
          <UserProfile />
          <div className="flex justify-between items-center px-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Version 1.0.0
            </p>
          </div>
        </div>
      </aside>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-800">
          {/* Titre avec Icône */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Admin Panel
            </h1>
          </div>

          {/* Lien vers le site stylisé en bouton discret */}
          <Link
            href="/page"
            target="_blank"
            className="group flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-400 border border-gray-700 rounded-md hover:text-white hover:border-gray-500 hover:bg-gray-800 transition-all duration-200"
          >
            <span>Visitez le site</span>
            <ExternalLink
              size={14}
              className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Section Utilisateur Connecté (Mobile Sidebar) */}
        <div className="absolute bottom-20 left-0 right-0 p-4 border-t border-gray-800">
          <UserProfile />
        </div>
      </aside>
      {/* Bottom Nav Bar (Mobile) - Ajout d'une marge pour ne pas cacher le contenu */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-800 z-30">
        <div className="flex items-center justify-around h-16">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full hover:bg-gray-800"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
