import { NextResponse } from 'next/server';
import { getOnboardingProgress, initializeOnboardingProgress } from '@/lib/onboarding';
import { getCurrentUser } from '@/lib/auth/middleware';

export async function GET(request: Request) {
  try {
    const user = getCurrentUser();
    // Use the first role for simplicity, in a real app would select the active/primary role
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
