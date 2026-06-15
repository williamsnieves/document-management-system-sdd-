import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/documents/store';
import { requireViewDocuments } from '@/lib/documents/access';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireViewDocuments();
  if (!auth.allowed) {
    return auth.response;
  }

  const document = documentStore.getDocumentById(params.id);
  
  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  return NextResponse.json({ document });
}
