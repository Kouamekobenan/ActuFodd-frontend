
// common/database/api.ts
import axios from "axios";

export const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  baseURL: "https://actufoody-backend-production.up.railway.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 INTERCEPTEUR : Gère les erreurs 401 (token expiré)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token invalide/expiré → nettoyage automatique
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("user_id");
//         window.location.href = "/page"; // Redirection
//       }
//     }
//     return Promise.reject(error);
//   }
// );