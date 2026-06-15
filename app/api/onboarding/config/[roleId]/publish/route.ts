import { NextResponse } from 'next/server';
import { publishOnboardingConfig } from '@/lib/onboarding';
import { recordAuditEvent } from '@/lib/audit/store';
import { getCurrentUser } from '@/lib/auth/middleware';

export async function POST(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const config = await publishOnboardingConfig(params.roleId);
    const user = getCurrentUser();
    
    await recordAuditEvent({
      userId: user.id,
      actionType: 'permission.update',
      resourceType: 'system',
      resourceId: params.roleId,
      resourceLabel: 'Onboarding Config',
      severity: 'success',
      metadata: { component: 'onboarding_config' }
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
