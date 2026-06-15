import { NextRequest, NextResponse } from 'next/server';

import {
  documentStore,
  parseCategories,
  parseStatuses,
} from '@/lib/documents/store';
import { requireViewDocuments } from '@/lib/documents/access';
import type { DocumentSortField, SortOrder } from '@/lib/documents/types';

export async function GET(request: NextRequest) {
  const auth = requireViewDocuments();
  if (!auth.allowed) {
    return auth.response;
  }

  const { searchParams } = request.nextUrl;

  const category = parseCategories(searchParams.get('category'));
  const status = parseStatuses(searchParams.get('status'));
  const q = searchParams.get('q') ?? undefined;
  const sort = (searchParams.get('sort') as DocumentSortField) ?? 'updatedAt';
  const order = (searchParams.get('order') as SortOrder) ?? 'desc';
  const page = Number(searchParams.get('page') ?? '1');
  const pageSize = Number(searchParams.get('pageSize') ?? '20');
  const view = searchParams.get('view') === 'grid' ? 'grid' : 'list';

  const result = documentStore.list({
    category,
    status,
    q,
    sort,
    order,
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : 20,
    view,
  });

  const activity = documentStore.getRecentActivity(5);

  return NextResponse.json({ ...result, activity });
}
