const fs = require("node:fs");
const path = require("node:path");

const distTypesDir = path.resolve(__dirname, "..", "dist", "types");
const candidates = [
  path.join(distTypesDir, "index.d.ts"),
  path.join(distTypesDir, "packages", "QMediaCore", "src", "index.d.ts"),
  path.join(distTypesDir, "QMediaCore", "src", "index.d.ts"),
  path.join(distTypesDir, "src", "index.d.ts"),
];

const sourceDts = candidates.find((candidate) => fs.existsSync(candidate));
if (!sourceDts) {
  throw new Error(
    "Unable to locate generated declaration entrypoint. Checked: " +
      candidates.join(", "),
  );
}

const sourceRoot = path.dirname(sourceDts);

function copyTree(srcDir, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const outPath = path.join(outDir, entry.name);
    if (entry.isDirectory()) {
      copyTree(srcPath, outPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, outPath);
    }
  }
}

// Mirror the declaration tree to dist/types so relative re-exports from index.d.ts
// (e.g. ./pipeline, ./assets/...) resolve in consumer projects.
if (sourceRoot !== distTypesDir) {
  copyTree(sourceRoot, distTypesDir);
}

const targetDts = path.join(distTypesDir, "index.d.ts");
fs.mkdirSync(distTypesDir, { recursive: true });
if (sourceDts !== targetDts) {
  fs.copyFileSync(sourceDts, targetDts);
}

const sourceMap = `${sourceDts}.map`;
const targetMap = `${targetDts}.map`;
if (fs.existsSync(sourceMap) && sourceMap !== targetMap) {
  fs.copyFileSync(sourceMap, targetMap);
}

console.log(
  `[fix-types-entry] mirrored ${path.relative(process.cwd(), sourceRoot)} -> dist/types`,
);
