import { NextRequest, NextResponse } from 'next/server';

import { approvalStore } from '@/lib/approvals/store';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { getCurrentUser, requireAnyPermission } from '@/lib/auth/middleware';

export async function GET(_request: NextRequest) {
  const auth = requireAnyPermission([
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.APPROVE,
  ]);
  if (!auth.allowed) {
    return auth.response;
  }

  const user = getCurrentUser();
  const queue = approvalStore.getPendingQueue(user.id);

  return NextResponse.json({ queue, currentUserId: user.id });
}
