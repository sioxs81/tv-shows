// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
    base: "/tv-shows/",
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
});