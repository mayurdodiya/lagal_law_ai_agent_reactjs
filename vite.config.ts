import path from "path";
import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react"

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    host: "::",
    port: 8080,
  },
  // .filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
