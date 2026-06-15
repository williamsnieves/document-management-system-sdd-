## 1. Data Model & API

- [x] 1.1 Extend Version schema with baseVersionId, description, conflictResolved flag
- [x] 1.2 Implement `GET /api/documents/[id]` detail endpoint
- [x] 1.3 Implement `GET /api/documents/[id]/versions` version history endpoint
- [x] 1.4 Implement `POST /api/documents/[id]/versions` new version upload
- [x] 1.5 Implement `POST /api/documents/[id]/versions/[versionId]/restore` promote version
- [x] 1.6 Implement conflict detection on concurrent version creation
- [x] 1.7 Implement `POST /api/documents/[id]/resolve-conflict` manual merge endpoint
- [x] 1.8 Implement `PATCH /api/documents/[id]/metadata` for tags and classification
- [x] 1.9 Implement `GET /api/documents/[id]/download` for live version binary

## 2. Document Detail UI

- [x] 2.1 Create DocumentDetailPage with breadcrumbs and header actions
- [x] 2.2 Create StatusBadge component (Approved, Draft, In Review, Conflict)
- [x] 2.3 Create DocumentPreview viewer with zoom, pagination, print, expand toolbar
- [x] 2.4 Create VersionHistorySidebar timeline component
- [x] 2.5 Create AccessPermissionsCard with manage access link
- [x] 2.6 Create ClassificationCard with tags and confidentiality
- [x] 2.7 Create AuditHealthCard with integrity, backup, retention, score

## 3. Version & Conflict Flows

- [x] 3.1 Wire new version upload from detail page FAB/menu
- [x] 3.2 Display conflict indicator in library and detail when conflict exists
- [x] 3.3 Create ConflictResolution UI with version comparison and merge upload
- [x] 3.4 Wire restore version action with confirmation dialog

## 4. Share & Permissions

- [x] 4.1 Create ShareDialog for inviting users
- [x] 4.2 Record share and permission changes as audit events
