import { NextResponse } from 'next/server';
import { rotateEncryptionKeys } from '@/lib/security';
import { recordAuditEvent } from '@/lib/audit/store';
import { requireRoleManagement } from '@/lib/auth/middleware';

export async function POST() {
  const auth = requireRoleManagement();
  if (!auth.allowed) {
    return auth.response;
  }

  try {
    const newPolicy = rotateEncryptionKeys();

    // Record audit event
    recordAuditEvent({
      userId: auth.user.id,
      actionType: 'security.policy',
      resourceType: 'system',
      resourceId: 'encryption-keys',
      resourceLabel: 'Encryption Keys',
      severity: 'critical',
      metadata: {
        action: 'key_rotation',
      },
    });

    return NextResponse.json(newPolicy);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to rotate encryption keys' },
      { status: 500 }
    );
  }
}
