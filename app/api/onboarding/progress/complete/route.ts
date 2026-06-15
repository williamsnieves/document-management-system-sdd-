import { NextResponse } from 'next/server';
import { getOnboardingProgress, updateOnboardingProgress } from '@/lib/onboarding';
import { getOnboardingUser } from '@/lib/onboarding/demo-user';
import { recordAuditEvent } from '@/lib/audit/store';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const user = getOnboardingUser();
    const progress = await getOnboardingProgress(user.id);
    
    if (!progress) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 });
    }

    const updated = await updateOnboardingProgress(user.id, {
      completedAt: new Date().toISOString(),
      currentStep: 'launch'
    });

    await recordAuditEvent({
      userId: user.id,
      actionType: 'permission.update',
      resourceType: 'system',
      resourceId: user.id,
      resourceLabel: 'Onboarding Completion',
      severity: 'success',
      metadata: { component: 'onboarding_complete' }
    });

    // Set cookie for middleware route guard
    cookies().set('onboarding_complete', 'true', { path: '/' });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
