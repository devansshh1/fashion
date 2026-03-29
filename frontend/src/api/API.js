import axios from "axios";
import { authSession } from "../auth/sessionStorage";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || ""
);

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const url = config.url || "";
  const userToken = authSession.getUserToken();
  const partnerToken = authSession.getPartnerToken();

  let token = null;

  if (url.startsWith("/api/posts/upload")) {
    token = partnerToken || userToken;
  } else if (url.startsWith("/api/auth/user") || url.startsWith("/api/posts/")) {
    token = userToken;
  } else if (url.startsWith("/api/auth/partner") || url.startsWith("/api/partner")) {
    token = partnerToken;
  } else if (url.startsWith("/api/food")) {
    token = partnerToken || userToken;
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAssetUrl = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export default API;
