import axios from "axios";

// Remove trailing slash from base URL
const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

// Base URL from env
export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || ""
);

// Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // keep for cookie fallback
});

// 🔥 Interceptor — ALWAYS attach token
API.interceptors.request.use(
  (config) => {
    try {
      // Prefer partner token, fallback to user token
      const partnerToken = localStorage.getItem("partnerToken");
      const userToken = localStorage.getItem("userToken");

      const token = partnerToken || userToken;

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Token attach error:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Utility for assets
export const getAssetUrl = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export default API;