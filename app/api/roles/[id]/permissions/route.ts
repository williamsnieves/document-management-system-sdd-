import { NextResponse } from 'next/server';
import { recordAuditEvent } from '@/lib/audit/store';
import { requireRoleManagement } from '@/lib/auth/middleware';
import { validateUpdateRolePermissionsInput } from '@/lib/roles/schemas';
import { getRoleStore } from '@/lib/roles/store';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = requireRoleManagement();
  if (!auth.allowed) {
    return auth.response;
  }

  const { id } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const validation = validateUpdateRolePermissionsInput(body);
  if (!validation.success || !validation.data) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const store = getRoleStore();
  const existingRole = store.getRoleById(id);

  if (!existingRole) {
    return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
  }

  const role = store.updateRolePermissions(id, validation.data.permissions);

  if (!role) {
    return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
  }

  recordAuditEvent({
    userId: auth.user.id,
    actionType: 'permission.update',
    resourceType: 'role',
    resourceId: id,
    resourceLabel: role.name,
    metadata: {
      permissions: validation.data.permissions,
      previousPermissions: existingRole.permissions,
    },
  });

  return NextResponse.json({ role });
}
