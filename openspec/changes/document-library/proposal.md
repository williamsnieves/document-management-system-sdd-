## Why

Users must browse, filter, sort, and search the document library to find files across legal, finance, and HR categories. The library workspace (screen02) is the primary document discovery surface and the entry point for upload actions supporting the PRD Upload → Review → Approve flow.

## What Changes

- Add Library Workspace page with document list table
- Add category filters (Legal Documents, Finance & Audit, HR & Operations) with counts
- Add status legend (Approved, In Review, Draft)
- Add document table columns: name, owner, last modified, version
- Add sort and list/grid view toggle
- Add basic search across document names, IDs, tags, and owners
- Add Recent Activity feed and Security Status card on library page
- Add upload entry via header button and FAB

## Capabilities

### New Capabilities

- `library`: Document listing, filtering, sorting, categorization, and upload entry
- `search`: Basic cross-library document search

### Modified Capabilities

- (none)

## Impact

- New route `/library`
- Document list API with filter, sort, pagination, and search query params
- File upload API (multipart) initiating document records
- Depends on `app-shell`; feeds `document-detail-versioning` and `approval-workflow`
