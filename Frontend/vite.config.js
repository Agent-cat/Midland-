import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          maps: ["@react-google-maps/api"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    compress: true,
  },
});
