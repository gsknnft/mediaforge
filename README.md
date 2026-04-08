# @gsknnft/mediaforge

`@gsknnft/mediaforge` is a public media processing package for building timelines, extracting frames, running serializable preprocessing tasks, and exporting sprite atlases for browser and Node.js workloads.

It is used by `vera-shell`, `vera-campus-ui`, and ScanForge, but it is packaged to stand on its own as a reusable library.

## Migration Context

Inside older repo notes and historical branches, this package may still be referred to as `QMediaCore`.

Current intended reading:

- `QMediaCore` = legacy/internal name
- `@gsknnft/mediaforge` = current public package identity
- `MediaForge` = the bounded media-preprocess/runtime layer used by ScanForge, Vera Shell, and campus-facing products

The package role is unchanged by the rename: it stays focused on media ingest, preprocess pipelines, atlas export, and worker-safe runtime contracts.

## Install

```bash
pnpm add @gsknnft/mediaforge
```

Requirements:

- Node.js 18-24
- pnpm 10+ for local development
- optional native `canvas` support in Node.js for image-heavy server workloads

## Package Entry Points

- `@gsknnft/mediaforge`: core pipeline + runtime contracts
- `@gsknnft/mediaforge/core`: explicit pipeline/runtime-only surface
- `@gsknnft/mediaforge/browser`: browser-oriented GIF/media helpers
- `@gsknnft/mediaforge/browser-worker`: bundled browser worker entry for serializable preprocess tasks
- `@gsknnft/mediaforge/node`: node-side worker-thread adapter surface
- `@gsknnft/mediaforge/node-worker`: bundled node worker entry for serializable preprocess tasks

## Production Readiness Snapshot

The package is structured for public publishing and production intake:

- dual ESM/CJS exports with generated TypeScript declarations
- public npm metadata, license, repository, and issue tracker links
- prepublish validation via lint, test, build, and pack checks
- hardened runtime task request validation for worker-safe execution
- safer Node worker exit handling for failed worker-thread jobs
- updated consumer and contributor documentation

It is intentionally not a rendering or scene package. `three` and mesh-view concerns stay in ScanForge or other product surfaces. MediaForge stays narrow on purpose: media ingest, timeline shaping, serializable preprocess tasks, atlas export, and worker-friendly runtime contracts.

The package now owns its lightweight worker/canvas runtime internally instead of depending on the monorepo-only `@sigilnet/robust-workers` package. That keeps installs isolated and removes the `workspace:*` requirement for downstream consumers.

It supports:

- GIF/video/image frame extraction
- timeline + named clip planning
- optional timeline preprocessing hooks (anchor/mask/center stages)
- sprite atlas export + Vera Shell manifest export
- optional pixel-matrix exports as TypeScript constants
- optional compact bit-packed pixel output
- optional file-emitter utilities for split clip modules

## Suite Role

In the current suite split:

- `ScanForge` owns product workflow, upload UX, 3D viewing, and reconstruction orchestration.
- `GLBifier` owns the core image-to-GLB transform path inside ScanForge.
- `MediaForge` owns bounded media work around that engine: timeline extraction, sprite-style preprocessing, preview composition, and worker-safe task execution.

That separation keeps MediaForge publishable and reusable without dragging in unrelated 3D runtime baggage.

## What You Can Do Today

- build timelines from GIF, video, and still-image sources
- plan named clips for downstream animation or shell-facing consumption
- export sprite atlases and Vera Shell manifests
- split matrix sheets into reusable cells with serializable metadata
- align subject imagery onto fixed canvases for consistent downstream framing
- generate contact-sheet style preview boards for capture QA

## Near-Term Uses

- preprocess ScanForge uploads before reconstruction
- run preview generation off the main thread via explicit browser-worker paths
- batch-clean sprite or expression-sheet assets in shared UI tooling
- reuse the same manifest-driven media tasks in Vera-facing products and node-side jobs

## Future Expansion

- richer background-removal and subject-isolation presets
- replayable manifest pipelines for asset preparation
- node worker-thread execution for heavier offline preprocessing
- package-level helpers for worker-path wiring in bundlers and apps
- codec presets for thumbnailing, transcodes, and contact-sheet generation
- first-class queue/job orchestration adapters for batch media workflows
- manifest validation and schema export for safer automation pipelines
- optional observability hooks for metrics, tracing, and progress events

---

# Roadmap & Next Steps

See [ROADMAP.md](./ROADMAP.md) for the full roadmap and prioritized next steps.

**Immediate Priorities:**

- Expand unit/integration/fuzz test coverage for all analyzers, managers, and handlers
- Add per-analyzer and per-manager documentation with usage examples
- Implement centralized error handling and logging
- Integrate initial observability (metrics, tracing)
- Benchmark performance of core operations
- Conduct security audit (input validation, sandboxing)

**Mid-Term:**

- Plugin/extension system for custom analyzers, handlers, and pipeline stages
- API versioning and migration guides
- Rich developer documentation: architecture diagrams, API docs, usage guides
- Backward compatibility guarantees for public APIs
- Fuzz/property-based tests for analyzers

**Long-Term:**

- Built-in observability: advanced metrics, tracing, and error reporting
- Automated performance regression testing
- Community-driven plugin registry
- Support for additional media formats and runtimes

---

# TODO

See [TODO.md](./TODO.md) for the current prioritized TODO list.

**High Priority:**

- Add/expand unit and integration tests for all analyzers, managers, and handlers
- Write per-analyzer and per-manager documentation with usage examples
- Implement centralized error handling and logging
- Integrate initial observability (metrics, tracing)
- Benchmark performance of core operations
- Conduct security audit (input validation, sandboxing)

**Medium Priority:**

- Design and implement plugin/extension system
- Draft API versioning and migration guides
- Expand developer documentation (architecture diagrams, API docs)
- Ensure backward compatibility for public APIs
- Add fuzz/property-based tests for analyzers

**Low Priority:**

- Build community plugin registry
- Add support for more media formats/runtimes
- Automate performance regression testing

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines and best practices. For feature requests, bug reports, or feedback, open an issue or submit a pull request.

- richer background-removal and subject-isolation presets
- replayable manifest pipelines for asset preparation
- node worker-thread execution for heavier offline preprocessing
- package-level helpers for worker-path wiring in bundlers and apps
- codec presets for thumbnailing, transcodes, and contact-sheet generation
- first-class queue/job orchestration adapters for batch media workflows
- manifest validation and schema export for safer automation pipelines
- optional observability hooks for metrics, tracing, and progress events

## Public Package Guidance

Recommended production usage patterns:

- import from the narrowest entry point possible to avoid unnecessary browser-only code
- pass explicit worker entry paths when using browser or Node worker adapters
- treat runtime task payloads as plain serializable data
- keep optional native dependencies like `canvas` in the deployment environment only when needed
- run `pnpm run prepublishOnly` before publishing or cutting a release

## Core Pipeline

```ts
import {
  NamedClipPlanner,
  TimelineBuilder,
  VeraShellExporter,
} from "@gsknnft/mediaforge";

import { GIFProcessor } from "@gsknnft/mediaforge/browser";

const processor = GIFProcessor.getInstance(undefined, "/gif.worker.js");
const frames = await processor.extractFrames("/input.gif");
const timeline = TimelineBuilder.fromGifFrames(frames, "demo");
const clips = NamedClipPlanner.plan(timeline);

const result = await VeraShellExporter.exportSpriteSheet(
  { ...timeline, clips },
  { atlasUrl: "/sprites/demo-atlas.png" },
);
```

`result` includes:

- `imageBlob`
- `manifest` (atlas metadata)
- `veraShellManifest` (shell-friendly sprite config)

## Pixel Matrix Export

Enable pixel export in the same call:

```ts
const result = await VeraShellExporter.exportSpriteSheet(timeline, {
  atlasUrl: "/sprites/my-atlas.png",
  pixelMatrix: {
    enabled: true,
    mode: "binary", // "alpha-mask" | "binary" | "grayscale"
    outputFormat: "both", // "matrix" | "bit-packed" | "both"
    threshold: 120,
    frameStride: 2,
    maxFrames: 24,
    constPrefix: "DINO_IDLE",
    includeMetadataConst: true,
  },
});
```

## Preprocess Hooks

You can now inject preprocessing stages before atlas export (for anchor-lock,
segmentation, alpha-mask stabilization, or fixed-canvas centering):

```ts
import { PreprocessPipeline, VeraShellExporter } from "@gsknnft/mediaforge";

const result = await VeraShellExporter.exportSpriteSheet(timeline, {
  atlasUrl: "/sprites/my-atlas.png",
  preprocess: {
    enabled: true,
    stages: [
      {
        id: "align-anchor",
        run: async (frame) => {
          // return { imageData, preprocess: { anchor: { x, y } } };
        },
      },
      {
        id: "stabilize-mask",
        run: async (frame) => {
          // return { preprocess: { qualityScore: 0.95 } };
        },
      },
    ],
  },
});
```

`result.preprocess` includes the stage list and frame count for pipeline diagnostics.

For practical source assets with a mostly flat background, use the built-in preset:

```ts
import {
  createFlatBackgroundSpritePreprocess,
  VeraShellExporter,
} from "@gsknnft/mediaforge";

const preprocess = createFlatBackgroundSpritePreprocess({
  targetWidth: 256,
  targetHeight: 256,
  // Optional. If omitted, MediaForge estimates key color from corners.
  // keyColor: [18, 20, 24],
  keyTolerance: 44,
  alphaThreshold: 20,
  featherRadius: 1,
});

const result = await VeraShellExporter.exportSpriteSheet(timeline, {
  atlasUrl: "/sprites/vera-atlas.png",
  preprocess,
});
```

Preset stages:

- `segment-foreground`: chroma-key style background removal + soft alpha feathering
- `center-canvas`: center detected subject box on a fixed canvas for consistent sprite alignment

Pixel output fields:

- `result.pixelMatrix.frames`: `number[][]` frame matrices
- `result.pixelMatrix.constModule`: TS source text export
- `result.pixelMatrix.matrixModule`: matrix-only TS module (when `outputFormat: "both"`)
- `result.pixelMatrix.packedModule`: packed-only TS module (when `outputFormat: "both"`)
- `result.pixelMatrix.packedFrames`: `Uint8Array`-backed packed payloads

## Bit-Packed Mode

For compact payloads:

```ts
import { PixelMatrixExporter } from "@gsknnft/mediaforge";

const pixel = PixelMatrixExporter.exportTimeline(timeline, {
  mode: "binary",
  outputFormat: "bit-packed",
  threshold: 128,
  constPrefix: "VERA_IDLE",
});
```

Notes:

- bit-packed output supports only `binary` and `alpha-mask`
- `grayscale` with `bit-packed` or `both` throws a validation error

## File Emitter

Generate `.ts` module payloads for direct writing/downloading:

```ts
import { PixelMatrixFileEmitter } from "@gsknnft/mediaforge";

const files = PixelMatrixFileEmitter.emitModules(
  timeline,
  {
    mode: "binary",
    outputFormat: "both",
    constPrefix: "VERA_IDLE",
  },
  {
    baseFileName: "vera-idle",
    splitByClip: true,
    includeIndexFile: true,
  },
);
```

Each emitted entry contains:

- `fileName`
- `content` (TS source)
- `format` (`matrix` | `bit-packed` | `both`)
- `clipName?`
- `frameCount`

## Exported APIs (Pipeline)

From `@gsknnft/mediaforge` / `@gsknnft/mediaforge/core`:

- `TimelineBuilder`
- `NamedClipPlanner`
- `SpriteAtlasExporter`
- `VeraShellExporter`
- `PixelMatrixExporter`
- `PixelMatrixFileEmitter`
- pipeline `types`

## Task Runtime

Named-task scheduling is now part of the public runtime contract so browser workers and future node worker-thread adapters can share the same task names and payloads.

```ts
import { BrowserTaskAdapter } from "@gsknnft/mediaforge/browser";

const tasks = new BrowserTaskAdapter();

tasks.registerTask(
  "matrix.split",
  async (payload: { rows: number; cols: number }) => {
    return payload.rows * payload.cols;
  },
);

const total = await tasks.runTask<{ rows: number; cols: number }, number>(
  "matrix.split",
  { rows: 3, cols: 3 },
);
```

For node-side heavy TypeScript jobs, use the `NodeWorkerThreadsAdapter` from `@gsknnft/mediaforge/node` with a worker script that understands the shared task protocol.

For real off-main-thread execution, pass an explicit worker entry path when you construct the adapters:

- browser: use the built `@gsknnft/mediaforge/browser-worker` asset URL in your bundler/app
- node: point `NodeWorkerThreadsAdapter` at the built `@gsknnft/mediaforge/node-worker` file path

Built-in ScanForge preprocess tasks are now included:

- `scanforge.matrix.split`
- `scanforge.image.align`
- `scanforge.preview.generate`

The align surface can also be used as a plain post-process utility for non-expression assets. In addition to `alignImage(...)`, MediaForge now exposes `alignImageSet(...)` to normalize a whole capture set onto one shared scale and canvas framing without changing the surrounding pipeline.

These tasks operate on serializable RGBA buffers so they can run in browser workers or node worker threads without DOM-only payloads.

```ts
import {
  alignImageSet,
  BrowserTaskAdapter,
  SCANFORGE_PREPROCESS_TASKS,
} from "@gsknnft/mediaforge/browser";

const adapter = new BrowserTaskAdapter();

const split = await adapter.runTask(SCANFORGE_PREPROCESS_TASKS.MATRIX_SPLIT, {
  image: {
    width: 900,
    height: 900,
    data: new Uint8ClampedArray(900 * 900 * 4),
  },
  rows: 3,
  cols: 3,
});

const aligned = alignImageSet({
  images: [split.cells[0].image, split.cells[1].image],
  targetWidth: 512,
  targetHeight: 512,
  padding: 16,
  coverage: 0.9,
});
```

For ScanForge/GLBifier specifically, these tasks are meant for preprocess and preview work around the engine, not as a replacement for the core backend reconstruction pipeline.

## Build / Test / Publish Checks

```bash
pnpm install
pnpm run lint
pnpm run test
pnpm run typecheck
pnpm run build
pnpm run pack:check
```
