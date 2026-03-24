import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://fashion-1-mayu.onrender.com",
        changeOrigin: true,
        secure: true
      },
      "/uploads": {
        target: "https://fashion-1-mayu.onrender.com",
        changeOrigin: true,
        secure: true
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
