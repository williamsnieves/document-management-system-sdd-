## 1. Data Model & API

- [ ] 1.1 Extend Version schema with baseVersionId, description, conflictResolved flag
- [ ] 1.2 Implement `GET /api/documents/[id]` detail endpoint
- [ ] 1.3 Implement `GET /api/documents/[id]/versions` version history endpoint
- [ ] 1.4 Implement `POST /api/documents/[id]/versions` new version upload
- [ ] 1.5 Implement `POST /api/documents/[id]/versions/[versionId]/restore` promote version
- [ ] 1.6 Implement conflict detection on concurrent version creation
- [ ] 1.7 Implement `POST /api/documents/[id]/resolve-conflict` manual merge endpoint
- [ ] 1.8 Implement `PATCH /api/documents/[id]/metadata` for tags and classification
- [ ] 1.9 Implement `GET /api/documents/[id]/download` for live version binary

## 2. Document Detail UI

- [ ] 2.1 Create DocumentDetailPage with breadcrumbs and header actions
- [ ] 2.2 Create StatusBadge component (Approved, Draft, In Review, Conflict)
- [ ] 2.3 Create DocumentPreview viewer with zoom, pagination, print, expand toolbar
- [ ] 2.4 Create VersionHistorySidebar timeline component
- [ ] 2.5 Create AccessPermissionsCard with manage access link
- [ ] 2.6 Create ClassificationCard with tags and confidentiality
- [ ] 2.7 Create AuditHealthCard with integrity, backup, retention, score

## 3. Version & Conflict Flows

- [ ] 3.1 Wire new version upload from detail page FAB/menu
- [ ] 3.2 Display conflict indicator in library and detail when conflict exists
- [ ] 3.3 Create ConflictResolution UI with version comparison and merge upload
- [ ] 3.4 Wire restore version action with confirmation dialog

## 4. Share & Permissions

- [ ] 4.1 Create ShareDialog for inviting users
- [ ] 4.2 Record share and permission changes as audit events
