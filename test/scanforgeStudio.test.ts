import assert from "node:assert/strict";
import test from "node:test";

import {
  RuntimeTaskRegistry,
  executeTaskRequest,
} from "../src/runtime/taskProtocol";
import {
  SCANFORGE_STUDIO_TASKS,
  buildScanForgeProviderRunSheet,
  createMemoryScanForgeStudioProvider,
  planScanForgeArtifactRetention,
  registerScanForgeStudioProviderTasks,
} from "../src/scanforgeStudio";

const input = {
  id: "job-a",
  label: "baseline mesh",
  assets: [
    {
      id: "source",
      uri: "file:///source.png",
      mimeType: "image/png",
      sizeBytes: 1024,
    },
  ],
};

test("registerScanForgeStudioProviderTasks exposes generate, status, and result", async () => {
  const registry = new RuntimeTaskRegistry();
  const provider = createMemoryScanForgeStudioProvider({ id: "triposr" });
  registerScanForgeStudioProviderTasks(registry, provider);

  const generate = await executeTaskRequest(registry, {
    id: "req-generate",
    taskName: SCANFORGE_STUDIO_TASKS.PROVIDER_GENERATE,
    payload: {
      input,
      options: {
        baselineId: "known-good-v1",
        parameters: { foregroundRatio: 0.72 },
      },
    },
  });

  assert.equal(generate.ok, true);
  assert.equal(generate.id, "req-generate");
  if (!generate.ok) return;
  assert.equal(generate.result.providerId, "triposr");
  assert.equal(generate.result.status, "complete");

  const status = await executeTaskRequest(registry, {
    id: "req-status",
    taskName: SCANFORGE_STUDIO_TASKS.PROVIDER_STATUS,
    payload: { jobId: generate.result.jobId },
  });

  assert.equal(status.ok, true);
  if (!status.ok) return;
  assert.equal(status.result.progress, 1);

  const result = await executeTaskRequest(registry, {
    id: "req-result",
    taskName: SCANFORGE_STUDIO_TASKS.PROVIDER_RESULT,
    payload: { jobId: generate.result.jobId },
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.result.artifacts[0]?.kind, "mesh");
});

test("buildScanForgeProviderRunSheet records objective provider comparison fields", () => {
  const sheet = buildScanForgeProviderRunSheet({
    input,
    providerId: "local-reconstruction",
    baselineId: "known-good-v1",
    parameters: { steps: 64 },
    result: {
      jobId: "job-a",
      providerId: "local-reconstruction",
      status: "complete",
      artifacts: [
        {
          id: "mesh",
          uri: "file:///mesh.glb",
          kind: "mesh",
          sizeBytes: 4096,
        },
        {
          id: "preview",
          uri: "file:///preview.png",
          kind: "preview",
          sizeBytes: 512,
        },
      ],
      topology: {
        vertices: 1200.4,
        faces: 800.2,
        materials: 2,
        textureCount: 1,
      },
      visibleDefects: [],
    },
  });

  assert.equal(sheet.inputAsset, "file:///source.png");
  assert.equal(sheet.provider, "local-reconstruction");
  assert.equal(sheet.outputSizeBytes, 4608);
  assert.deepEqual(sheet.topology, {
    vertices: 1200,
    faces: 800,
    materials: 2,
    textureCount: 1,
  });
  assert.equal(sheet.pass, true);
  assert.deepEqual(sheet.artifactUris, ["file:///mesh.glb", "file:///preview.png"]);
});

test("buildScanForgeProviderRunSheet fails runs with visible defects by default", () => {
  const sheet = buildScanForgeProviderRunSheet({
    input,
    providerId: "triposr",
    result: {
      jobId: "job-a",
      providerId: "triposr",
      status: "complete",
      artifacts: [
        {
          id: "mesh",
          uri: "file:///mesh.glb",
          kind: "mesh",
        },
      ],
      visibleDefects: ["floating shell", "texture smear"],
    },
  });

  assert.equal(sheet.pass, false);
  assert.deepEqual(sheet.visibleDefects, ["floating shell", "texture smear"]);
});

test("planScanForgeArtifactRetention keeps retained/latest artifacts and flags old transient files", () => {
  const now = 10_000;
  const plan = planScanForgeArtifactRetention({
    now,
    retentionMs: 1_000,
    keepLatestByKind: { mesh: 1, preview: 1 },
    artifacts: [
      {
        id: "mesh-old",
        uri: "file:///mesh-old.glb",
        kind: "mesh",
        createdAt: 1_000,
      },
      {
        id: "mesh-new",
        uri: "file:///mesh-new.glb",
        kind: "mesh",
        createdAt: 9_500,
      },
      {
        id: "preview-old",
        uri: "file:///preview-old.png",
        kind: "preview",
        createdAt: 2_000,
        retained: true,
      },
      {
        id: "workspace-old",
        uri: "file:///workspace",
        kind: "workspace",
        createdAt: 2_000,
      },
    ],
  });

  const byId = new Map(plan.map((entry) => [entry.artifact.id, entry]));
  assert.equal(byId.get("mesh-new")?.action, "keep");
  assert.equal(byId.get("preview-old")?.action, "keep");
  assert.equal(byId.get("mesh-old")?.action, "delete");
  assert.equal(byId.get("workspace-old")?.action, "delete");
});
