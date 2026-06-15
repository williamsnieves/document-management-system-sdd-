import { NextResponse } from 'next/server';
import { getOnboardingProgress, updateOnboardingProgress } from '@/lib/onboarding';
import { getCurrentUser } from '@/lib/auth/middleware';

export async function POST(
  request: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { percentComplete } = await request.json();
    const user = getCurrentUser();
    const progress = await getOnboardingProgress(user.id);
    
    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    const moduleIndex = progress.moduleProgress.findIndex(m => m.moduleId === params.moduleId);
    let moduleProgress = [...progress.moduleProgress];
    
    if (moduleIndex >= 0) {
      moduleProgress[moduleIndex].percentComplete = percentComplete;
    } else {
      moduleProgress.push({
        moduleId: params.moduleId,
        percentComplete
      });
    }

    const updated = await updateOnboardingProgress(user.id, { moduleProgress });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
