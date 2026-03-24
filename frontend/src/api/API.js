import axios from "axios";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || ""
);

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export const getAssetUrl = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export default API;
