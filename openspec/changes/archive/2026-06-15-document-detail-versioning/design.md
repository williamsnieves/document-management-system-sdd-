## Context

Document detail is the versioning hub (screen03). Must handle preview, version history, permissions, metadata, and conflict resolution per PRD edge case.

## Goals / Non-Goals

**Goals:**
- In-browser PDF preview with toolbar controls
- Full version history with promote/restore
- Conflict detection on concurrent version creation
- Manual conflict resolution producing merged version

**Non-Goals:**
- Real-time collaborative editing (OT/CRDT)
- In-browser DOCX/XLSX editing
- Advanced OCR

## Decisions

### Decision: Version numbering semver-style

Versions use `major.minor.patch` (e.g., v4.2.1) auto-incremented on upload; admins can override description.

### Decision: Conflict detection via base version ID

Each new version records `baseVersionId`. If two versions share the same `baseVersionId`, flag conflict.

**Rationale:** Simple optimistic concurrency without complex merge algorithms.

### Decision: PDF preview via embedded viewer

Use `react-pdf` or iframe-based PDF rendering for v1. DOCX/XLSX show download-only placeholder.

### Decision: File storage abstraction

`StorageProvider` interface with local filesystem adapter for dev; S3-compatible adapter for production.

## Risks / Trade-offs

- **[Risk] Manual merge is UX-heavy** → v1 provides side-by-side version comparison + upload merged file; inline clause merge is future work
- **[Risk] Large PDF preview performance** → Lazy-load pages; default to first page

## Migration Plan

N/A — greenfield.

## Open Questions

- Retention policy enforcement: display-only in v1 or automated deletion — recommend display-only
