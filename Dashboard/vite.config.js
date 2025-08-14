import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    host: true, // so it listens on all addresses
    allowedHosts: ["bfd7b46fba24.ngrok-free.app"], // add your ngrok host here
  },
});
