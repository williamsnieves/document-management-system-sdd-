import { NextRequest, NextResponse } from 'next/server';

import {
  ApprovalError,
  approvalStore,
  getDocumentVersionForApproval,
} from '@/lib/approvals/store';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { getCurrentUser, requireAnyPermission } from '@/lib/auth/middleware';

export async function GET(
  _request: NextRequest,
  { params }: { params: { documentId: string } },
) {
  const auth = requireAnyPermission([
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.APPROVE,
  ]);
  if (!auth.allowed) {
    return auth.response;
  }

  try {
    const user = getCurrentUser();
    const detail = approvalStore.getDetail(params.documentId, user.id);
    const version = getDocumentVersionForApproval(params.documentId);

    return NextResponse.json({
      ...detail,
      version,
    });
  } catch (error) {
    if (error instanceof ApprovalError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }
    throw error;
  }
}
