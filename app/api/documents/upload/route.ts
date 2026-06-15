import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/documents/access';
import { documentStore, UploadError } from '@/lib/documents/store';
import type { DocumentCategory } from '@/lib/documents/types';
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 },
      );
    }

    const category = (formData.get('category') as DocumentCategory) ?? 'legal';
    const tagsRaw = formData.get('tags');
    const folderId = formData.get('folderId');
    const tags =
      typeof tagsRaw === 'string' && tagsRaw.length
        ? tagsRaw.split(',').map((t) => t.trim())
        : [];

    const buffer = Buffer.from(await file.arrayBuffer());
    const user = getCurrentUser();

    const document = await documentStore.upload({
      file: {
        name: file.name,
        type: file.type || inferMimeType(file.name),
        size: file.size,
        buffer,
      },
      category,
      tags,
      folderId: typeof folderId === 'string' ? folderId : undefined,
      userId: user.id,
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: 'Upload failed.' },
      { status: 500 },
    );
  }
}

function inferMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (ext === 'xlsx') {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  return '';
}
