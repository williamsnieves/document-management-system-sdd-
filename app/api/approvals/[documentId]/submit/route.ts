import { NextRequest, NextResponse } from 'next/server';

import { ApprovalError, approvalStore } from '@/lib/approvals/store';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { getCurrentUser, requireAnyPermission } from '@/lib/auth/middleware';

export async function POST(
  _request: NextRequest,
  { params }: { params: { documentId: string } },
) {
  const auth = requireAnyPermission([
    PERMISSIONS.UPLOAD,
    PERMISSIONS.EDIT_METADATA,
  ]);
  if (!auth.allowed) {
    return auth.response;
  }

  try {
    const user = getCurrentUser();
    const workflow = approvalStore.submit({
      documentId: params.documentId,
      userId: user.id,
      userName: user.name,
    });

    return NextResponse.json({ workflow });
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
