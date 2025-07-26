import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Eliminado: importación de lovable-tagger

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Plugins adicionales pueden agregarse aquí
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
