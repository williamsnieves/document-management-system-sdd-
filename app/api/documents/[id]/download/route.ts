import { NextRequest, NextResponse } from 'next/server';
import { documentStore } from '@/lib/documents/store';
import { requireViewDocuments } from '@/lib/documents/access';
import { readFile } from 'fs/promises';
import path from 'path';

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
  const currentVersion = versions.find(v => v.versionNumber === document.currentVersion);
  
  if (!currentVersion) {
    return NextResponse.json({ error: 'Current version not found' }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), currentVersion.fileUrl);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${document.name}.${document.fileType}"`,
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found on disk' }, { status: 404 });
  }
}
