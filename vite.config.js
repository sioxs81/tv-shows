// vite.config.js
export default {
    base: "/tv-shows/",   // ← debe coincidir con el nombre de tu repo
    root: "src", 
    build: {
        outDir: "..dist",
        rollupOptions: {
            input: "src/index.html",
        },
    },
};