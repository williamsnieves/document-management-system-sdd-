import { NextResponse } from 'next/server';
import { getOnboardingProgress, initializeOnboardingProgress } from '@/lib/onboarding';
import { getOnboardingUser } from '@/lib/onboarding/demo-user';

export async function GET(request: Request) {
  try {
    const user = getOnboardingUser();
    const roleId = user.roleIds[0];
    
    let progress = await getOnboardingProgress(user.id);
    if (!progress) {
      progress = await initializeOnboardingProgress(user.id, roleId);
    }
    
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
