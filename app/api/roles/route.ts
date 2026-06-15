import { NextResponse } from 'next/server';
import { requireRoleManagement } from '@/lib/auth/middleware';
import { validateCreateRoleInput } from '@/lib/roles/schemas';
import { getRoleStore } from '@/lib/roles/store';

export async function GET() {
  const auth = requireRoleManagement();
  if (!auth.allowed) {
    return auth.response;
  }

  const store = getRoleStore();
  const roles = store.listRoles();

  return NextResponse.json({ roles, total: roles.length });
}

export async function POST(request: Request) {
  const auth = requireRoleManagement();
  if (!auth.allowed) {
    return auth.response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const validation = validateCreateRoleInput(body);
  if (!validation.success || !validation.data) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const store = getRoleStore();
  const existingRoles = store.listRoles();
  const duplicate = existingRoles.some(
    (role) =>
      role.name.toLowerCase() === validation.data!.name.toLowerCase(),
  );

  if (duplicate) {
    return NextResponse.json(
      { error: 'A role with this name already exists.' },
      { status: 409 },
    );
  }

  const role = store.createRole(validation.data);

  return NextResponse.json({ role }, { status: 201 });
}
