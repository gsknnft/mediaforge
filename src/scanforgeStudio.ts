import { RuntimeTaskRegistry } from "./runtime/taskProtocol";

export const SCANFORGE_STUDIO_TASKS = Object.freeze({
  PROVIDER_GENERATE: "scanforge.provider.generate",
  PROVIDER_STATUS: "scanforge.provider.status",
  PROVIDER_RESULT: "scanforge.provider.result",
});

export type ScanForgeProviderId = "triposr" | "local-reconstruction" | "custom" | string;

export type ScanForgeJobStatus =
  | "queued"
  | "running"
  | "complete"
  | "failed"
  | "cancelled";

export interface ScanForgeInputAsset {
  id: string;
  uri: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  role?: "source" | "mask" | "reference" | "calibration" | string;
}

export interface ScanForgeGenerateInput {
  id?: string;
  label?: string;
  assets: ScanForgeInputAsset[];
  source?: "upload" | "matrix" | "capture" | "batch" | string;
  metadata?: Record<string, unknown>;
}

export interface ScanForgeGenerateOptions {
  providerId?: ScanForgeProviderId;
  baselineId?: string;
  parameters?: Record<string, unknown>;
  retainArtifacts?: boolean;
}

export interface ScanForgeStudioJob {
  jobId: string;
  providerId: ScanForgeProviderId;
  status: ScanForgeJobStatus;
  createdAt: number;
  updatedAt: number;
  label?: string;
  message?: string;
  progress?: number;
  artifactIds?: string[];
}

export interface ScanForgeArtifact {
  id: string;
  uri: string;
  kind: "mesh" | "texture" | "preview" | "log" | "workspace" | string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt?: number;
  retained?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ScanForgeTopologyMetrics {
  vertices?: number;
  faces?: number;
  materials?: number;
  textureCount?: number;
}

export interface ScanForgeStudioResult {
  jobId: string;
  providerId: ScanForgeProviderId;
  status: Extract<ScanForgeJobStatus, "complete">;
  artifacts: ScanForgeArtifact[];
  topology?: ScanForgeTopologyMetrics;
  visibleDefects?: string[];
  metrics?: Record<string, number>;
  completedAt?: number;
}

export interface ScanForgeStudioProvider {
  id: ScanForgeProviderId;
  displayName?: string;
  capabilities?: string[];
  generate(
    input: ScanForgeGenerateInput,
    options?: ScanForgeGenerateOptions,
  ): Promise<ScanForgeStudioJob> | ScanForgeStudioJob;
  status(jobId: string): Promise<ScanForgeStudioJob> | ScanForgeStudioJob;
  result(jobId: string): Promise<ScanForgeStudioResult> | ScanForgeStudioResult;
}

export interface ScanForgeProviderRunSheet {
  inputAsset: string;
  provider: ScanForgeProviderId;
  parameters: Record<string, unknown>;
  outputSizeBytes: number;
  topology: Required<ScanForgeTopologyMetrics>;
  visibleDefects: string[];
  baselineId?: string;
  pass: boolean;
  artifactUris: string[];
  notes: string[];
  createdAt: number;
}

export interface ScanForgeRetentionPlanEntry {
  artifact: ScanForgeArtifact;
  action: "keep" | "delete";
  reason: string;
}

function nowMs(): number {
  return Date.now();
}

function normalizeProgress(value?: number): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.max(0, Math.min(1, value));
}

function normalizeTopology(
  topology?: ScanForgeTopologyMetrics,
): Required<ScanForgeTopologyMetrics> {
  return {
    vertices: Math.max(0, Math.round(topology?.vertices ?? 0)),
    faces: Math.max(0, Math.round(topology?.faces ?? 0)),
    materials: Math.max(0, Math.round(topology?.materials ?? 0)),
    textureCount: Math.max(0, Math.round(topology?.textureCount ?? 0)),
  };
}

function assertGenerateInput(input: ScanForgeGenerateInput): void {
  if (!Array.isArray(input.assets) || input.assets.length === 0) {
    throw new Error("ScanForge generate input requires at least one asset");
  }
  for (const asset of input.assets) {
    if (!asset.id || !asset.uri) {
      throw new Error("ScanForge assets require id and uri");
    }
  }
}

export function normalizeScanForgeJob(
  job: ScanForgeStudioJob,
): ScanForgeStudioJob {
  return {
    ...job,
    progress: normalizeProgress(job.progress),
    createdAt: Number.isFinite(job.createdAt) ? job.createdAt : nowMs(),
    updatedAt: Number.isFinite(job.updatedAt) ? job.updatedAt : nowMs(),
  };
}

export function registerScanForgeStudioProviderTasks(
  registry: RuntimeTaskRegistry,
  provider: ScanForgeStudioProvider,
): void {
  registry.register<{
    input: ScanForgeGenerateInput;
    options?: ScanForgeGenerateOptions;
  }, ScanForgeStudioJob>(SCANFORGE_STUDIO_TASKS.PROVIDER_GENERATE, async (payload) => {
    assertGenerateInput(payload.input);
    return normalizeScanForgeJob(
      await provider.generate(payload.input, {
        ...payload.options,
        providerId: payload.options?.providerId ?? provider.id,
      }),
    );
  });

  registry.register<{ jobId: string }, ScanForgeStudioJob>(
    SCANFORGE_STUDIO_TASKS.PROVIDER_STATUS,
    async ({ jobId }) => {
      if (!jobId) throw new Error("ScanForge status requires jobId");
      return normalizeScanForgeJob(await provider.status(jobId));
    },
  );

  registry.register<{ jobId: string }, ScanForgeStudioResult>(
    SCANFORGE_STUDIO_TASKS.PROVIDER_RESULT,
    async ({ jobId }) => {
      if (!jobId) throw new Error("ScanForge result requires jobId");
      return provider.result(jobId);
    },
  );
}

export function buildScanForgeProviderRunSheet(args: {
  input: ScanForgeGenerateInput;
  providerId: ScanForgeProviderId;
  result: ScanForgeStudioResult;
  parameters?: Record<string, unknown>;
  baselineId?: string;
  notes?: string[];
  pass?: boolean;
  createdAt?: number;
}): ScanForgeProviderRunSheet {
  const topology = normalizeTopology(args.result.topology);
  const outputSizeBytes = args.result.artifacts.reduce(
    (total, artifact) => total + Math.max(0, artifact.sizeBytes ?? 0),
    0,
  );
  const visibleDefects = args.result.visibleDefects ?? [];
  const pass =
    args.pass ??
    (args.result.status === "complete" &&
      visibleDefects.length === 0 &&
      args.result.artifacts.some((artifact) => artifact.kind === "mesh"));

  return {
    inputAsset: args.input.assets.map((asset) => asset.uri).join(", "),
    provider: args.providerId,
    parameters: args.parameters ?? {},
    outputSizeBytes,
    topology,
    visibleDefects,
    baselineId: args.baselineId,
    pass,
    artifactUris: args.result.artifacts.map((artifact) => artifact.uri),
    notes: args.notes ?? [],
    createdAt: args.createdAt ?? nowMs(),
  };
}

export function planScanForgeArtifactRetention(args: {
  artifacts: ScanForgeArtifact[];
  now?: number;
  retentionMs?: number;
  keepRetained?: boolean;
  keepLatestByKind?: Partial<Record<ScanForgeArtifact["kind"], number>>;
}): ScanForgeRetentionPlanEntry[] {
  const now = args.now ?? nowMs();
  const retentionMs = Math.max(0, args.retentionMs ?? 24 * 60 * 60 * 1000);
  const keepRetained = args.keepRetained ?? true;
  const keepLatestByKind = args.keepLatestByKind ?? { mesh: 3, preview: 3 };
  const sorted = [...args.artifacts].sort(
    (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0),
  );
  const keptByKind = new Map<string, number>();

  return sorted.map((artifact) => {
    if (keepRetained && artifact.retained) {
      return { artifact, action: "keep", reason: "retained artifact" };
    }

    const kindLimit = keepLatestByKind[artifact.kind] ?? 0;
    const keptCount = keptByKind.get(artifact.kind) ?? 0;
    if (kindLimit > keptCount) {
      keptByKind.set(artifact.kind, keptCount + 1);
      return {
        artifact,
        action: "keep",
        reason: `latest ${artifact.kind} artifact`,
      };
    }

    const age = now - (artifact.createdAt ?? 0);
    if (age > retentionMs) {
      return {
        artifact,
        action: "delete",
        reason: `older than ${retentionMs}ms retention window`,
      };
    }

    return { artifact, action: "keep", reason: "inside retention window" };
  });
}

export function createMemoryScanForgeStudioProvider(args?: {
  id?: ScanForgeProviderId;
  resultFactory?: (
    job: ScanForgeStudioJob,
    input: ScanForgeGenerateInput,
    options?: ScanForgeGenerateOptions,
  ) => ScanForgeStudioResult;
}): ScanForgeStudioProvider {
  const id = args?.id ?? "custom";
  const jobs = new Map<string, ScanForgeStudioJob>();
  const inputs = new Map<string, ScanForgeGenerateInput>();
  const optionsByJob = new Map<string, ScanForgeGenerateOptions | undefined>();

  return {
    id,
    displayName: "Memory ScanForge provider",
    capabilities: ["generate", "status", "result"],
    generate(input, options) {
      assertGenerateInput(input);
      const createdAt = nowMs();
      const jobId = input.id ?? `${id}-${createdAt}`;
      const job: ScanForgeStudioJob = {
        jobId,
        providerId: options?.providerId ?? id,
        status: "complete",
        createdAt,
        updatedAt: createdAt,
        label: input.label,
        progress: 1,
        artifactIds: [`${jobId}:mesh`],
      };
      jobs.set(jobId, job);
      inputs.set(jobId, input);
      optionsByJob.set(jobId, options);
      return job;
    },
    status(jobId) {
      const job = jobs.get(jobId);
      if (!job) throw new Error(`Unknown ScanForge job ${jobId}`);
      return job;
    },
    result(jobId) {
      const job = jobs.get(jobId);
      const input = inputs.get(jobId);
      if (!job || !input) throw new Error(`Unknown ScanForge job ${jobId}`);
      if (args?.resultFactory) {
        return args.resultFactory(job, input, optionsByJob.get(jobId));
      }
      return {
        jobId,
        providerId: job.providerId,
        status: "complete",
        artifacts: [
          {
            id: `${jobId}:mesh`,
            uri: `memory://${jobId}.glb`,
            kind: "mesh",
            mimeType: "model/gltf-binary",
            sizeBytes: 0,
            createdAt: job.updatedAt,
          },
        ],
        topology: {},
        visibleDefects: [],
        completedAt: job.updatedAt,
      };
    },
  };
}
