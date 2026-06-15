import { NextResponse } from 'next/server';
import { requireRoleManagement } from '@/lib/auth/middleware';
import { getRoleStore } from '@/lib/roles/store';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = requireRoleManagement();
  if (!auth.allowed) {
    return auth.response;
  }

  const { id } = await context.params;
  const store = getRoleStore();
  const role = store.getRoleById(id);

  if (!role) {
    return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
  }

  return NextResponse.json({ role });
}
