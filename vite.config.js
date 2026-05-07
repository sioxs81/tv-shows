// vite.config.js
export default {
    base: "/tv-shows/",   // ← debe coincidir con el nombre de tu repo
    build: {
        outDir: "dist",
        rollupOptions: {
            input: "src/index.html",
        },
    },
};