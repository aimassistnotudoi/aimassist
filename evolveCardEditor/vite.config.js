import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";

const htmlFiles = glob.sync("**/*.html", {
    cwd: __dirname,
    ignore: ["node_modules/**", "dist/**"],
});

const input = Object.fromEntries(
    htmlFiles.map((file) => [
        file.replace(/\.html$/, ""),
        resolve(__dirname, file),
    ])
);

export default defineConfig({
    base: "/aimassist/evolveCardEditor/",
    build: {
        rollupOptions: {
            input,
        },
    },
});