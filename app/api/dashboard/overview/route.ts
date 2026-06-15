import { NextResponse } from 'next/server';

import { getDashboardOverview } from '@/lib/dashboard/overview';

export async function GET() {
  const overview = getDashboardOverview();
  return NextResponse.json(overview);
}
