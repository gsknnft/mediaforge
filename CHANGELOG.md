# Changelog

All notable changes to `@gsknnft/mediaforge` will be documented in this file.

## 0.1.0

### Added

- public package metadata for npm publishing
- consumer install and production-readiness documentation
- contributor guidance for lint, test, build, and release checks
- runtime task protocol validation for malformed worker messages
- Node worker exit failure handling
- regression tests for runtime task request validation

### Changed

- made the package publishable as a public-facing npm package
- made the clean script cross-platform
- made the formatting script run in check mode
- added prepublish and pack verification scripts

### Notes

- optional native `canvas` support remains optional for Node.js environments that need it
- additional dependency upgrades and stricter lint/type rules are tracked as future hardening work
