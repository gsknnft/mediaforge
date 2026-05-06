/**
 * Cleanup TripoSR storage — interactive review of jobs to keep or delete.
 *
 * Reads job metadata from the JobStore JSON files and GLBs from storage/triposr/.
 * Prints a summary and deletes workspace dirs + GLBs for jobs you mark as trash.
 *
 * Usage:
 *   node cleanup-triposr-storage.mjs [--dry-run] [--auto-delete-failed]
 *
 * Flags:
 *   --dry-run             Print what would be deleted, don't actually delete
 *   --auto-delete-failed  Automatically delete all failed jobs without prompting
 *   --keep-latest N       Keep the N most recent complete jobs (default: keep all)
 */

import { readdir, readFile, rm, stat } from "fs/promises";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const BACKEND = resolve(__dirname, "../../../isolation/scanforge/backend");
const STORAGE = join(BACKEND, "storage/triposr");
const WORKSPACE = join(STORAGE, "workspace");
const JOB_STORE = join(BACKEND, "storage/jobs/triposr.json");

const DRY_RUN = process.argv.includes("--dry-run");
const AUTO_DELETE_FAILED = process.argv.includes("--auto-delete-failed");
const keepLatestArg = process.argv.find(a => a.startsWith("--keep-latest="));
const KEEP_LATEST = keepLatestArg ? parseInt(keepLatestArg.split("=")[1]) : null;

function fmtBytes(n) {
  if (n > 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  if (n > 1e3) return `${(n / 1e3).toFixed(0)} KB`;
  return `${n} B`;
}

async function dirSize(dir) {
  if (!existsSync(dir)) return 0;
  let total = 0;
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) total += await dirSize(p);
    else total += (await stat(p).catch(() => ({ size: 0 }))).size;
  }
  return total;
}

async function prompt(rl, q) {
  return new Promise(res => rl.question(q, res));
}

// Load job store
let jobs = {};
if (existsSync(JOB_STORE)) {
  const raw = await readFile(JOB_STORE, "utf8").catch(() => "{}");
  jobs = JSON.parse(raw);
}

// Scan GLB files in storage root
const glbFiles = (await readdir(STORAGE).catch(() => []))
  .filter(f => f.endsWith(".glb"))
  .map(f => ({ name: f, path: join(STORAGE, f) }));

// Scan workspace dirs
const workspaceDirs = (await readdir(WORKSPACE).catch(() => []))
  .map(d => ({ id: d, path: join(WORKSPACE, d) }));

console.log(`\nTriPoSR Storage Cleanup`);
console.log(`=======================`);
console.log(`Jobs in store: ${Object.keys(jobs).length}`);
console.log(`GLB files: ${glbFiles.length}`);
console.log(`Workspace dirs: ${workspaceDirs.length}`);
if (DRY_RUN) console.log(`\n[DRY RUN — nothing will be deleted]\n`);

// Build deletion candidates
const toDelete = [];

// 1. Failed jobs
const failedJobs = Object.values(jobs).filter(j => j.status === "failed");
console.log(`\nFailed jobs: ${failedJobs.length}`);
for (const j of failedJobs) {
  const wsDir = join(WORKSPACE, j.job_id);
  const wsSize = await dirSize(wsDir);
  console.log(`  [FAILED] ${j.job_id.slice(0, 8)} | ${j.label ?? "?"} | ws: ${fmtBytes(wsSize)}`);
  if (AUTO_DELETE_FAILED) toDelete.push({ type: "workspace", path: wsDir, job: j });
}

// 2. Complete jobs — show summary
const completeJobs = Object.values(jobs)
  .filter(j => j.status === "complete")
  .sort((a, b) => (b.completed_at ?? 0) - (a.completed_at ?? 0));

console.log(`\nComplete jobs: ${completeJobs.length}`);
for (let i = 0; i < completeJobs.length; i++) {
  const j = completeJobs[i];
  const glbPath = j.glb_path;
  const glbSize = glbPath && existsSync(glbPath) ? (await stat(glbPath)).size : 0;
  const wsSize = await dirSize(join(WORKSPACE, j.job_id));
  const date = j.completed_at ? new Date(j.completed_at * 1000).toLocaleDateString() : "?";
  const keepFlag = KEEP_LATEST !== null && i >= KEEP_LATEST ? " [OVER LIMIT]" : "";
  console.log(`  [${i + 1}] ${j.job_id.slice(0, 8)} | ${j.label ?? "?"} | ${date} | glb: ${fmtBytes(glbSize)} | ws: ${fmtBytes(wsSize)}${keepFlag}`);
  if (KEEP_LATEST !== null && i >= KEEP_LATEST) {
    toDelete.push({ type: "both", glbPath, wsPath: join(WORKSPACE, j.job_id), job: j });
  }
}

// 3. Orphaned GLBs (no matching job)
const jobGlbNames = new Set(
  Object.values(jobs).map(j => j.glb_path?.split("/").pop()).filter(Boolean)
);
const orphanGlbs = glbFiles.filter(f => !jobGlbNames.has(f.name));
if (orphanGlbs.length) {
  console.log(`\nOrphaned GLBs (no job record): ${orphanGlbs.length}`);
  for (const f of orphanGlbs) {
    const sz = (await stat(f.path)).size;
    console.log(`  ${f.name} | ${fmtBytes(sz)}`);
  }
}

// 4. Orphaned workspace dirs (no matching job)
const orphanWs = workspaceDirs.filter(d => !jobs[d.id]);
if (orphanWs.length) {
  console.log(`\nOrphaned workspace dirs: ${orphanWs.length}`);
  for (const d of orphanWs) {
    const sz = await dirSize(d.path);
    console.log(`  ${d.id.slice(0, 8)} | ${fmtBytes(sz)}`);
    toDelete.push({ type: "workspace", path: d.path });
  }
}

if (toDelete.length === 0 && !AUTO_DELETE_FAILED) {
  console.log("\nNothing flagged for auto-deletion. Run with --auto-delete-failed or --keep-latest=N to prune.");
  process.exit(0);
}

// Calculate total savings
let totalSize = 0;
for (const item of toDelete) {
  if (item.glbPath) totalSize += (await stat(item.glbPath).catch(() => ({ size: 0 }))).size;
  if (item.wsPath) totalSize += await dirSize(item.wsPath);
  if (item.path) totalSize += await dirSize(item.path);
}

console.log(`\nTo delete: ${toDelete.length} items (~${fmtBytes(totalSize)} freed)`);

if (DRY_RUN) {
  for (const item of toDelete) {
    if (item.glbPath) console.log(`  [DRY] rm ${item.glbPath}`);
    if (item.wsPath) console.log(`  [DRY] rm -rf ${item.wsPath}`);
    if (item.path) console.log(`  [DRY] rm -rf ${item.path}`);
  }
  process.exit(0);
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const answer = await prompt(rl, `\nProceed with deletion? [y/N] `);
rl.close();

if (answer.toLowerCase() !== "y") {
  console.log("Aborted.");
  process.exit(0);
}

for (const item of toDelete) {
  if (item.glbPath && existsSync(item.glbPath)) {
    await rm(item.glbPath);
    console.log(`  ✓ deleted ${item.glbPath.split("/").pop()}`);
  }
  const dir = item.wsPath ?? item.path;
  if (dir && existsSync(dir)) {
    await rm(dir, { recursive: true, force: true });
    console.log(`  ✓ deleted workspace ${dir.split("/").pop().slice(0, 8)}`);
  }
}

console.log(`\nDone. Freed ~${fmtBytes(totalSize)}.`);
