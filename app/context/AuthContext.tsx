"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { api } from "../common/database/api";
import { User } from "../module/auth/domain/user.entity";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ user: User; accessToken: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  // Helper pour sauvegarder le token
  const saveToken = (accessToken: string, userId?: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      if (userId) localStorage.setItem("user_id", userId);
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string }> => {
    try {
      const res = await api.post(`/auth/login`, { email, password });
      console.log("📦 Réponse complète du backend:", res.data);

      // ✅ Extraction depuis res.data.data
      const userData = res.data.data.user;
      const accessToken = res.data.data.token.access_token;

      console.log("👤 User extrait:", userData);
      console.log("🔑 Access Token extrait:", accessToken);

      // Vérification de sécurité
      if (!accessToken || !userData) {
        console.error("❌ Token ou user manquants dans la réponse!");
        throw new Error("Réponse de connexion invalide du serveur");
      }

      // Sauvegarde locale
      saveToken(accessToken, userData.id);

      // Mise à jour du contexte global
      setUser(userData);
      setIsAuthenticated(true);

      // Retourne les données au frontend
      return {
        user: userData,
        accessToken: accessToken,
      };
    } catch (error: any) {
      console.error("❌ Erreur lors du login:", error);
      console.error("❌ Réponse d'erreur:", error.response?.data);
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("🔒 Aucun token trouvé, utilisateur non connecté");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Tentative de récupération de l'utilisateur...");
      console.log("🔑 Token utilisé:", token.substring(0, 20) + "...");

      const res = await api.get(`/auth/me`);
      console.log("📦 Réponse /auth/me:", res.data);

      // ✅ Adaptez selon la structure réelle de votre backend
      // Essaie plusieurs structures possibles
      const userData = res.data.data?.user || res.data.user || res.data;

      if (isMounted.current && userData) {
        console.log("✅ Utilisateur récupéré avec succès:", userData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.warn("⚠️ Données utilisateur manquantes dans la réponse");
        logout();
      }
    } catch (error: any) {
      console.error(
        "❌ Erreur lors de la récupération de l'utilisateur:",
        error,
      );
      console.error("❌ Détails de l'erreur:", error.response?.data);

      // Si le token est invalide ou expiré, déconnexion automatique
      if (error.response?.status === 401) {
        console.warn("⚠️ Session expirée (401), déconnexion automatique");
        if (isMounted.current) logout();
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 AuthProvider monté - initialisation");
    isMounted.current = true;

    // Log du token présent au démarrage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      console.log("🔍 Token au démarrage:", token ? "Présent" : "Absent");
    }

    refreshUser();

    return () => {
      console.log("🛑 AuthProvider démonté");
      isMounted.current = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, refreshUser }}
    >
      {!loading ? (
        children
      ) : (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">
            Chargement de votre session...
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};
