import path from "path";
import { defineConfig } from "vite";
import ts from "./tsconfig.json";

const externalDeps = [
  // Node built-ins
  "fs",
  "path",
  "os",
  "http",
  "https",
  "stream",
  "zlib",
  "events",
  "buffer",
  "util",
  "crypto",
  "child_process",
  "readline",
  "worker_threads",
  // React — must never be bundled; consumers provide their own copy
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
];

const tsPaths =
  ts.compilerOptions &&
  "paths" in ts.compilerOptions &&
  ts.compilerOptions.paths
    ? Object.keys(ts.compilerOptions.paths).map((key) => key.replace("/*", ""))
    : [];

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        core: path.resolve(__dirname, "src/core.ts"),
        browser: path.resolve(__dirname, "src/browser.ts"),
        "scanforge-browser": path.resolve(
          __dirname,
          "src/scanforge-browser.ts",
        ),
        "browser-worker": path.resolve(
          __dirname,
          "src/runtime/browserWorker.ts",
        ),
      },
      name: "qmedia-core",
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        format === "es" ? `${entryName}.mjs` : `${entryName}.cjs`,
    },
    outDir: "dist",
    rollupOptions: {
      external: [...externalDeps, ...tsPaths],
    },
  },
});
