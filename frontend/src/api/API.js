import axios from "axios";
import { authSession } from "../auth/sessionStorage";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const isAbsoluteUrl = (value = "") => /^https?:\/\//i.test(value);

const normalizeApiBaseUrl = (value = "") => {
  const trimmedValue = trimTrailingSlash(value);

  if (!trimmedValue || trimmedValue === "/api") {
    return "";
  }

  if (!isAbsoluteUrl(trimmedValue)) {
    return trimmedValue;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    return parsedUrl.pathname === "/api" ? parsedUrl.origin : trimmedValue;
  } catch {
    return trimmedValue;
  }
};

const normalizeAssetBaseUrl = (value = "") => {
  const trimmedValue = trimTrailingSlash(value);

  if (!trimmedValue || trimmedValue === "/uploads") {
    return "";
  }

  if (!isAbsoluteUrl(trimmedValue)) {
    return trimmedValue;
  }

  try {
    return new URL(trimmedValue).origin;
  } catch {
    return trimmedValue;
  }
};

const rawApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL || "");
const shouldUseSameOriginProxy =
  import.meta.env.PROD && (!rawApiBaseUrl || isAbsoluteUrl(rawApiBaseUrl));

export const API_BASE_URL = shouldUseSameOriginProxy ? "" : rawApiBaseUrl;
const ASSET_BASE_URL = shouldUseSameOriginProxy
  ? ""
  : normalizeAssetBaseUrl(import.meta.env.VITE_ASSET_URL || rawApiBaseUrl);

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    try {
      const partnerToken =
        authSession.getPartnerToken() || localStorage.getItem("partnerToken");
      const userToken =
        authSession.getUserToken() || localStorage.getItem("userToken");
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

export const getAssetUrl = (path = "") => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${ASSET_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export default API;
