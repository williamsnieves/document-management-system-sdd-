import { NextResponse } from 'next/server';
import { getOnboardingConfig, saveOnboardingConfig } from '@/lib/onboarding';

export async function GET(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const config = await getOnboardingConfig(params.roleId);
    if (!config) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const body = await request.json();
    const config = await saveOnboardingConfig(params.roleId, body);
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
