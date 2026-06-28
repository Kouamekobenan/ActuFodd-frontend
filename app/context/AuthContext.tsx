"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { api } from "../common/database/api";
import { User, UserRole } from "../module/auth/domain/user.entity";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User; accessToken: string }>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const saveTokens = (accessToken: string, refreshToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    }
  };

  const clearTokens = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string }> => {
    const res = await api.post("/auth/login", { email, password });
    const { user: userData, access_token, refresh_token } = res.data.data;

    if (!access_token || !userData) {
      throw new Error("Réponse de connexion invalide du serveur");
    }

    saveTokens(access_token, refresh_token);
    setUser(userData);
    setIsAuthenticated(true);

    return { user: userData, accessToken: access_token };
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { access_token, refresh_token } = res.data.data;

    if (!access_token) {
      throw new Error("Réponse d'inscription invalide du serveur");
    }

    saveTokens(access_token, refresh_token);
    // fetch user profile after registration
    const meRes = await api.get("/auth/me");
    const userData: User = meRes.data.data;
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          await api.post("/auth/logout", { refreshToken });
        } catch {
          // silent — we clear tokens regardless
        }
      }
    }
    clearTokens();
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
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      // New API: data.data is the user object directly
      const userData: User = res.data.data;

      if (isMounted.current && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        await logout();
      }
    } catch (error: any) {
      if (error.response?.status === 401 && isMounted.current) {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    refreshUser();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout, refreshUser }}
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
