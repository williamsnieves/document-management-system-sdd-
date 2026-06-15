import { NextRequest, NextResponse } from 'next/server';

import {
  getAuditUsers,
  queryAuditEvents,
} from '@/lib/audit/store';
import type { AuditActionType, AuditSeverity } from '@/lib/audit/types';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { requirePermission } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  const auth = requirePermission(PERMISSIONS.VIEW_AUDIT_LOGS);
  if (!auth.allowed) {
    return auth.response;
  }

  const { searchParams } = request.nextUrl;

  const dateRange =
    (searchParams.get('dateRange') as '24h' | '7d' | '30d' | 'all') ?? '24h';
  const eventType =
    (searchParams.get('eventType') as AuditActionType | 'all') ?? 'all';
  const userId = searchParams.get('userId') ?? 'all';
  const severity =
    (searchParams.get('severity') as AuditSeverity | 'all') ?? 'all';
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '10');

  const result = queryAuditEvents({
    dateRange,
    eventType,
    userId,
    severity,
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : 10,
  });

  return NextResponse.json({
    ...result,
    users: getAuditUsers(),
  });
}
