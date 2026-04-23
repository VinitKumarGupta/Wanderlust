import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // All /api/* calls → Express backend
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false,
            },
            // Proxy static CSS/favicon from Express public/ folder
            "/css": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
            "/favicon": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
        },
    },
});
