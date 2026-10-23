import axios from "axios";

// Axios instance with base URL (Production URL from env or fallback to /api for dev proxy)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// Request interceptor — JWT token header mein attach karo (agar localStorage mein hai)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — 401 par expired session handle karo
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Login ya register endpoint ke 401 par reload mat karo (error message UI me dikhana hai)
    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/me");

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;

