## Context

Audit log is the PRD success metric — complete audit trail (screen05). Cross-cutting concern ingesting events from all modules.

## Goals / Non-Goals

**Goals:**
- Append-only audit event store
- Filterable, paginated UI
- CSV and PDF export
- IP/location metadata on events

**Non-Goals:**
- Blockchain immutability (UI label only; actual storage is append-only DB)
- Real-time streaming analytics
- Log retention auto-purge in v1

## Decisions

### Decision: Append-only AuditEvent table

```
AuditEvent { id, timestamp, userId, action, resourceType, resourceId, resourceLabel, ip, location, severity, metadata }
```

No UPDATE/DELETE on audit records.

### Decision: AuditService emitter pattern

All modules call `auditService.record(event)` — centralizes format and persistence.

### Decision: Severity mapping

| Action type | Default severity |
|-------------|-----------------|
| Normal CRUD | Success |
| Permission denied | Warning |
| Mass deletion, key rotation | Critical |

### Decision: Export via server-side generation

CSV: streaming response. PDF: template-based report library.

## Risks / Trade-offs

- **[Risk] High event volume** → Index on timestamp, userId, action; paginate at 50/page
- **[Risk] IP geolocation accuracy** → Use IP lookup service or store IP only for v1

## Migration Plan

N/A — greenfield. Instrument other modules as they are built.

## Open Questions

- None
