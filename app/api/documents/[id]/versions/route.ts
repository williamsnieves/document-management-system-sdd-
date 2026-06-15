import { NextRequest, NextResponse } from 'next/server';
import { documentStore, UploadError } from '@/lib/documents/store';
import { getCurrentUser, requireUpload, requireViewDocuments } from '@/lib/documents/access';

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

  const versions = documentStore.getVersions(params.id);
  return NextResponse.json({ versions });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireUpload();
  if (!auth.allowed) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const baseVersionId = formData.get('baseVersionId') as string | undefined;
    const description = formData.get('description') as string | undefined;
    const buffer = Buffer.from(await file.arrayBuffer());
    const user = getCurrentUser();

    const version = await documentStore.uploadVersion(params.id, {
      file: {
        name: file.name,
        type: file.type || inferMimeType(file.name),
        size: file.size,
        buffer,
      },
      userId: user.id,
      baseVersionId,
      description,
    });

    return NextResponse.json({ version }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}

function inferMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (ext === 'xlsx') return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  return '';
}
