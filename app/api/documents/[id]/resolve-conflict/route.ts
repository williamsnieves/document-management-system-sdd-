import { NextRequest, NextResponse } from 'next/server';
import { documentStore, UploadError } from '@/lib/documents/store';
import { getCurrentUser } from '@/lib/documents/access';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const description = formData.get('description') as string || 'Manual conflict resolution';
    const buffer = Buffer.from(await file.arrayBuffer());
    const user = getCurrentUser();

    const version = await documentStore.resolveConflict(params.id, {
      file: {
        name: file.name,
        type: file.type || inferMimeType(file.name),
        size: file.size,
        buffer,
      },
      userId: user.id,
      description,
    });

    return NextResponse.json({ version }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Conflict resolution failed.' }, { status: 500 });
  }
}

function inferMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (ext === 'xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  return '';
}
