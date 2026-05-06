import { build } from "esbuild";

const shared = {
  bundle: true,
  platform: "node",
  target: "node18",
  sourcemap: false,
  entryPoints: {
    node: "src/node.ts",
    "node-worker": "src/runtime/nodeWorker.ts",
  },
  outdir: "dist/node",
  external: ["node:*", "canvas", "sharp", "gifuct-js", "workerpool"],
};

await build({
  ...shared,
  format: "esm",
  outExtension: {
    ".js": ".mjs",
  },
});

await build({
  ...shared,
  format: "cjs",
  outExtension: {
    ".js": ".cjs",
  },
});
