import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        // Production optimization
        target: "ES2020",
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            format: {
                comments: false,
            },
        },
        // Chunk splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks for better caching
                    vendor: ["react", "react-dom"],
                    router: ["react-router-dom"],
                    axios: ["axios"],
                    lucide: ["lucide-react"],
                },
                // Asset file names
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split(".");
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|gif|svg/.test(ext)) {
                        return `assets/images/[name]-[hash][extname]`;
                    } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
                        return `assets/fonts/[name]-[hash][extname]`;
                    } else if (ext === "css") {
                        return `assets/css/[name]-[hash][extname]`;
                    }
                    return `assets/[name]-[hash][extname]`;
                },
                // Chunk file names
                chunkFileNames: "js/[name]-[hash].js",
                entryFileNames: "js/[name]-[hash].js",
            },
        },
        // Source maps for production debugging
        sourcemap: false,
        // Chunk size warning threshold
        chunkSizeWarningLimit: 500,
        // Report compressed size
        reportCompressedSize: true,
    },
    // Optimization config
    optimizeDeps: {
        // Pre-bundle dependencies for faster cold starts
        include: [
            "react",
            "react-dom",
            "react-router-dom",
            "axios",
            "lucide-react",
        ],
    },
});
