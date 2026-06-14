## 1. Data Model & Service

- [ ] 1.1 Define AuditEvent schema (append-only)
- [ ] 1.2 Implement AuditService.record() central emitter
- [ ] 1.3 Define event type constants for all document and security actions
- [ ] 1.4 Add database indexes on timestamp, userId, action, severity

## 2. API

- [ ] 2.1 Implement `GET /api/audit` with filters (dateRange, eventType, user, severity) and pagination
- [ ] 2.2 Implement `GET /api/audit/export/csv`
- [ ] 2.3 Implement `GET /api/audit/export/pdf`

## 3. Audit Log UI

- [ ] 3.1 Create AuditLogPage with header and export buttons
- [ ] 3.2 Create FilterBar with four dropdown filters
- [ ] 3.3 Create AuditEventTable with status badges and resource links
- [ ] 3.4 Create PaginationFooter with record count
- [ ] 3.5 Add permission guard for View Audit Logs role

## 4. Instrumentation

- [ ] 4.1 Emit audit events from document upload, version, approve, reject flows
- [ ] 4.2 Emit audit events from permission and security policy changes
- [ ] 4.3 Emit audit events for unauthorized action attempts
