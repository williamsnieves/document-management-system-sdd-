import { NextRequest, NextResponse } from 'next/server';
import { documentStore, UploadError } from '@/lib/documents/store';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const document = documentStore.updateMetadata(params.id, body);
    return NextResponse.json({ document });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  }
}
