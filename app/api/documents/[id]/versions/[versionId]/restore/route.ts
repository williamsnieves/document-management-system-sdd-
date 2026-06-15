import { NextRequest, NextResponse } from 'next/server';
import { documentStore, UploadError } from '@/lib/documents/store';
import { getCurrentUser, requireRestoreVersions } from '@/lib/documents/access';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; versionId: string } }
) {
  const auth = requireRestoreVersions();
  if (!auth.allowed) {
    return auth.response;
  }

  try {
    const user = getCurrentUser();
    const document = await documentStore.restoreVersion(params.id, params.versionId, user.id);
    return NextResponse.json({ document });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Restore failed.' }, { status: 500 });
  }
}
