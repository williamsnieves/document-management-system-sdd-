import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/documents/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const document = documentStore.getDocumentById(params.id);
  
  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  return NextResponse.json({ document });
}
