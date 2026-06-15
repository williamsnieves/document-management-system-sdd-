import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/documents/store';
import { recordAuditEvent } from '@/lib/audit/record';
import { getCurrentUser } from '@/lib/documents/access';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { email } = await request.json();
    const document = documentStore.getDocumentById(params.id);
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const user = getCurrentUser();

    recordAuditEvent({
      userId: user.id,
      actionType: 'document.shared',
      resourceType: 'document',
      resourceId: document.id,
      resourceLabel: document.name,
      metadata: { sharedWith: email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Share failed.' }, { status: 500 });
  }
}
