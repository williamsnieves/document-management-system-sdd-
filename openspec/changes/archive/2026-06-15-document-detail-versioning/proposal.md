## Why

Users need to open a document, preview its content, inspect version history, manage metadata and access, and resolve version conflicts. This is core to the PRD requirements for versioning and supports the review step before approval (screen03).

## What Changes

- Add document detail page with breadcrumb navigation
- Add document preview viewer with zoom, page navigation, print, and expand controls
- Add version history timeline sidebar with current version highlight and conflict markers
- Add access permissions panel with role assignments
- Add classification panel (tags, confidentiality level)
- Add audit health panel (integrity check, backup, retention, doc score)
- Add actions: Share, Edit Metadata, Download Final
- Add version conflict detection and resolution workflow (PRD edge case)

## Capabilities

### New Capabilities

- `documents`: Document detail view, preview, metadata, permissions, version history, and conflict resolution

### Modified Capabilities

- (none)

## Impact

- New route `/library/[documentId]`
- Document detail, version list, and version promotion APIs
- File storage for document binaries and version snapshots
- Conflict detection on concurrent version uploads
- Depends on `library` and `app-shell`
