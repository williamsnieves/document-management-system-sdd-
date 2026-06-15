import { NextRequest, NextResponse } from 'next/server';

import { ApprovalError, approvalStore } from '@/lib/approvals/store';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { getCurrentUser, requireAnyPermission } from '@/lib/auth/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: { documentId: string } },
) {
  const auth = requireAnyPermission([
    PERMISSIONS.VIEW_DOCUMENTS,
    PERMISSIONS.APPROVE,
    PERMISSIONS.REQUEST_CHANGES,
  ]);
  if (!auth.allowed) {
    return auth.response;
  }

  try {
    const user = getCurrentUser();
    const body = await request.json();

    if (!body.comment || typeof body.comment !== 'string') {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 },
      );
    }

    const event = approvalStore.addComment({
      documentId: params.documentId,
      userId: user.id,
      userName: user.name,
      comment: body.comment.trim(),
      attachmentName:
        typeof body.attachmentName === 'string'
          ? body.attachmentName
          : undefined,
    });

    return NextResponse.json({ event });
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
