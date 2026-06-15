## 1. Data Model & Service

- [x] 1.1 Define AuditEvent schema (append-only)
- [x] 1.2 Implement AuditService.record() central emitter
- [x] 1.3 Define event type constants for all document and security actions
- [x] 1.4 Add database indexes on timestamp, userId, action, severity

## 2. API

- [x] 2.1 Implement `GET /api/audit` with filters (dateRange, eventType, user, severity) and pagination
- [x] 2.2 Implement `GET /api/audit/export/csv`
- [x] 2.3 Implement `GET /api/audit/export/pdf`

## 3. Audit Log UI

- [x] 3.1 Create AuditLogPage with header and export buttons
- [x] 3.2 Create FilterBar with four dropdown filters
- [x] 3.3 Create AuditEventTable with status badges and resource links
- [x] 3.4 Create PaginationFooter with record count
- [x] 3.5 Add permission guard for View Audit Logs role

## 4. Instrumentation

- [x] 4.1 Emit audit events from document upload, version, approve, reject flows
- [x] 4.2 Emit audit events from permission and security policy changes
- [x] 4.3 Emit audit events for unauthorized action attempts
