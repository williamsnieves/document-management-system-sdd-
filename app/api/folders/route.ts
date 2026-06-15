import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/documents/access';
import { documentStore, UploadError } from '@/lib/documents/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json(
        { error: 'Folder name is required.' },
        { status: 400 },
      );
    }

    const user = getCurrentUser();
    const folder = documentStore.createFolder({
      name,
      userId: user.id,
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { error: 'Failed to create folder.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  const folders = documentStore.getFolders();
  return NextResponse.json({ folders });
}
