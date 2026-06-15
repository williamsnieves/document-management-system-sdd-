import { NextRequest, NextResponse } from 'next/server';

import { formatAuditTimestamp } from '@/lib/audit';
import { queryAuditEvents } from '@/lib/audit/store';
import type { AuditActionType, AuditSeverity } from '@/lib/audit/types';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { requirePermission } from '@/lib/auth/middleware';

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

  const lines = [
    'Audit Log Report',
    `Generated: ${new Date().toLocaleString()}`,
    `Total Events: ${result.pagination.total}`,
    '',
    ...result.events.map(
      (event) =>
        `${formatAuditTimestamp(event.timestamp)} | ${event.userName} | ${event.action} | ${event.resourceLabel} | ${event.ip} (${event.location}) | ${event.severity}`,
    ),
  ];

  const pdfStub = `%PDF-1.4 stub\n${lines.join('\n')}`;

  return new NextResponse(pdfStub, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="audit-log.pdf"',
    },
  });
}
