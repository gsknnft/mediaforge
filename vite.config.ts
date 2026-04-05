import path from "path";
import { defineConfig } from "vite";
import ts from "./tsconfig.json";

const externalDeps = [
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
  // keep only runtime externals here
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
        "browser-worker": path.resolve(
          __dirname,
          "src/runtime/browserWorker.ts",
        ),
      },
      name: "qmedia-core",
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        format === "es" ? `${entryName}.js` : `${entryName}.cjs`,
    },
    outDir: "dist",
    rollupOptions: {
      external: [...externalDeps, ...tsPaths],
    },
  },
});
