import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            scenes: path.resolve(__dirname, "src/scenes"),
            components: path.resolve(__dirname, "src/components"),
            state: path.resolve(__dirname, "src/state"),
        },
    },
});
