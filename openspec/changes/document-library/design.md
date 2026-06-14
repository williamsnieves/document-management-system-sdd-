## Context

Library is the primary document discovery and upload surface (screen02). Includes basic search per PRD. Depends on app shell and roles for permission checks.

## Goals / Non-Goals

**Goals:**
- Filterable, sortable document table
- Category and status filtering
- File upload creating document + v1 records
- Search via `q` URL param

**Non-Goals:**
- Advanced OCR / full-text document content search
- Real-time collaborative editing
- External cloud storage integrations

## Decisions

### Decision: Document data model

```
Document { id, name, documentId, category, status, ownerId, updatedAt, currentVersion, tags[] }
Version { id, documentId, versionNumber, status, createdBy, createdAt, fileUrl }
```

### Decision: `GET /api/documents` with query params

Supports `category`, `status`, `q`, `sort`, `page`, `view=list|grid`.

### Decision: Upload via `POST /api/documents/upload`

Multipart upload stores file, creates Document + Version v1.0.0 in Draft status, emits audit event.

### Decision: Allowed file types

PDF, DOCX, XLSX for v1 (matching mockup icons). Reject others with 400.

## Risks / Trade-offs

- **[Risk] Large file uploads** → Set max size limit (e.g., 50MB); show progress indicator
- **[Risk] Search only on metadata** → Acceptable per PRD "basic search"; content indexing is out of scope

## Migration Plan

N/A — greenfield.

## Open Questions

- Folder hierarchy: flat workspace with folder tags for v1, or nested folders — recommend flat with `folderId` optional field
