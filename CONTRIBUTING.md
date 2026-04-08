# Contributing

## Development setup

```bash
pnpm install
```

## Validation

Run the package checks before opening a release or pull request:

```bash
pnpm run lint
pnpm run test
pnpm run typecheck
pnpm run build
pnpm run pack:check
```

## Scope

Keep MediaForge focused on reusable media processing concerns:

- media ingest and frame extraction
- timeline shaping and manifest-friendly exports
- serializable preprocessing tasks
- browser and Node worker-safe runtime contracts

Avoid coupling the package to product-specific UI, scene rendering, or application orchestration layers.

## Release guidance

- update `README.md` when the public API or install story changes
- update `CHANGELOG.md` for user-visible packaging, runtime, or API changes
- confirm public npm metadata in `package.json` is still accurate before publishing
