## 1. Data Model & API

- [ ] 1.1 Define Document and Version database schemas
- [ ] 1.2 Implement `GET /api/documents` with filter, sort, search, pagination
- [ ] 1.3 Implement `POST /api/documents/upload` with file validation and audit event
- [ ] 1.4 Implement `POST /api/folders` for folder creation
- [ ] 1.5 Seed sample documents matching mockup data

## 2. Library UI

- [ ] 2.1 Create LibraryPage with title and sort/view toggle
- [ ] 2.2 Create CategoryFilter panel with checkboxes and counts
- [ ] 2.3 Create StatusLegend component
- [ ] 2.4 Create DocumentTable with columns per spec
- [ ] 2.5 Create DocumentGrid view variant
- [ ] 2.6 Create LibraryRecentActivity feed component
- [ ] 2.7 Create SecurityStatusCard component

## 3. Search Integration

- [ ] 3.1 Read `q` param from URL and pass to documents API
- [ ] 3.2 Implement empty search results state
- [ ] 3.3 Add debounced search for library-local search input (if separate from header)

## 4. Upload Flow

- [ ] 4.1 Create UploadDialog/Page component
- [ ] 4.2 Wire header Upload and FAB to upload flow
- [ ] 4.3 Handle upload errors and permission denied states
- [ ] 4.4 Redirect to document detail after successful upload (optional)

## 5. Permissions

- [ ] 5.1 Enforce upload permission via roles middleware
- [ ] 5.2 Filter visible documents by user access level
