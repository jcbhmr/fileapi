import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import noBundle from "vite-plugin-no-bundle";

export default defineConfig({
  build: {
    target: "esnext",
    ssr: true,
    lib: {
      entry: [
        "src/index.ts",
        "src/internal/Worker-node-worker.js",
        "src/internal/yellowlet-worker.js",
      ],
      formats: ["es"],
      fileName: "index",
    },
  },
  plugins: [/* dts(), */ noBundle()],
});
