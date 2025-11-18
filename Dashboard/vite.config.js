import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/dashboard/", // 👈 tells Vite to serve from this path
  server: {
    https: false,
    host: true, // listen on all interfaces
    allowedHosts: [
      "aa3a145cacab.ngrok-free.app",
      "192.168.1.128",
    ],
  },
});
