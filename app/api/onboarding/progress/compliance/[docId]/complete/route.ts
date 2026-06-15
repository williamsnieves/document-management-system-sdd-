import { NextResponse } from 'next/server';
import { getOnboardingProgress, updateOnboardingProgress } from '@/lib/onboarding';
import { getCurrentUser } from '@/lib/auth/middleware';

export async function POST(
  request: Request,
  { params }: { params: { docId: string } }
) {
  try {
    const user = getCurrentUser();
    const progress = await getOnboardingProgress(user.id);
    
    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    const docIndex = progress.completedDocs.findIndex(d => d.documentId === params.docId);
    let completedDocs = [...progress.completedDocs];
    
    if (docIndex === -1) {
      completedDocs.push({
        documentId: params.docId,
        completedAt: new Date().toISOString()
      });
    }

    const updated = await updateOnboardingProgress(user.id, { completedDocs });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
