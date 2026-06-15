import { NextRequest, NextResponse } from 'next/server';

import { formatAuditExportTimestamp } from '@/lib/audit';
import { queryAuditEvents } from '@/lib/audit/store';
import type { AuditActionType, AuditSeverity } from '@/lib/audit/types';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { requirePermission } from '@/lib/auth/middleware';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.VIEW_AUDIT_LOGS);
  if (!auth.allowed) {
    return auth.response;
  }

  const { searchParams } = request.nextUrl;

  const result = queryAuditEvents({
    dateRange:
      (searchParams.get('dateRange') as '24h' | '7d' | '30d' | 'all') ?? '24h',
    eventType:
      (searchParams.get('eventType') as AuditActionType | 'all') ?? 'all',
    userId: searchParams.get('userId') ?? 'all',
    severity:
      (searchParams.get('severity') as AuditSeverity | 'all') ?? 'all',
    page: 1,
    pageSize: 10000,
  });

  const header =
    'Timestamp,User,Action,Resource,IP,Location,Severity\n';
  const rows = result.events
    .map((event) =>
      [
        formatAuditExportTimestamp(event.timestamp),
        event.userName,
        event.action,
        event.resourceLabel,
        event.ip,
        event.location,
        event.severity,
      ]
        .map(escapeCsv)
        .join(','),
    )
    .join('\n');

  const csv = header + rows;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="audit-log.csv"',
    },
  });
}
