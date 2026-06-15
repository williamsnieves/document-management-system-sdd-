import { NextRequest, NextResponse } from 'next/server';

import { ApprovalError, approvalStore } from '@/lib/approvals/store';
import { getCurrentUser } from '@/lib/auth/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: { documentId: string } },
) {
  try {
    const user = getCurrentUser();
    const body = await request.json().catch(() => ({}));
    const workflow = approvalStore.approve({
      documentId: params.documentId,
      userId: user.id,
      userName: user.name,
      comment: typeof body.comment === 'string' ? body.comment : undefined,
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
