import { NextResponse } from 'next/server';
import { getSecurityPolicy, updateSecurityPolicy } from '@/lib/security';
import { recordAuditEvent } from '@/lib/audit/store';
import { requireRoleManagement } from '@/lib/auth/middleware';

export async function GET() {
  const auth = requireRoleManagement();
  if (!auth.allowed) {
    return auth.response;
  }

  const policy = getSecurityPolicy();
  return NextResponse.json(policy);
}

export async function PUT(request: Request) {
  const auth = requireRoleManagement();
  if (!auth.allowed) {
    return auth.response;
  }

  try {
    const updates = await request.json();
    const newPolicy = updateSecurityPolicy(updates);

    // Record audit event
    recordAuditEvent({
      userId: auth.user.id,
      actionType: 'security.policy',
      resourceType: 'system',
      resourceId: 'security-policy',
      resourceLabel: 'Security Policy',
      severity: 'critical',
      metadata: {
        updates,
      },
    });

    return NextResponse.json(newPolicy);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update security policy' },
      { status: 500 }
    );
  }
}
