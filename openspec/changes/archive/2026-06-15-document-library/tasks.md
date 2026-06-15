## 1. Data Model & API

- [x] 1.1 Define Document and Version database schemas
- [x] 1.2 Implement `GET /api/documents` with filter, sort, search, pagination
- [x] 1.3 Implement `POST /api/documents/upload` with file validation and audit event
- [x] 1.4 Implement `POST /api/folders` for folder creation
- [x] 1.5 Seed sample documents matching mockup data

## 2. Library UI

- [x] 2.1 Create LibraryPage with title and sort/view toggle
- [x] 2.2 Create CategoryFilter panel with checkboxes and counts
- [x] 2.3 Create StatusLegend component
- [x] 2.4 Create DocumentTable with columns per spec
- [x] 2.5 Create DocumentGrid view variant
- [x] 2.6 Create LibraryRecentActivity feed component
- [x] 2.7 Create SecurityStatusCard component

## 3. Search Integration

- [x] 3.1 Read `q` param from URL and pass to documents API
- [x] 3.2 Implement empty search results state
- [x] 3.3 Add debounced search for library-local search input (if separate from header)

## 4. Upload Flow

- [x] 4.1 Create UploadDialog/Page component
- [x] 4.2 Wire header Upload and FAB to upload flow
- [x] 4.3 Handle upload errors and permission denied states
- [x] 4.4 Redirect to document detail after successful upload (optional)

## 5. Permissions

- [x] 5.1 Enforce upload permission via roles middleware
- [x] 5.2 Filter visible documents by user access level
