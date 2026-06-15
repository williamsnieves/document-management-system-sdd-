import type { Document, Owner } from '../documents/types';
import { OWNERS } from '../documents/owners';

export function normalizeSearchQuery(q: string | undefined): string {
  return (q ?? '').trim().toLowerCase();
}

export function matchesSearchQuery(
  document: Document,
  q: string,
  owners: Record<string, Owner> = OWNERS,
): boolean {
  const normalized = normalizeSearchQuery(q);
  if (!normalized) {
    return true;
  }

  const owner = owners[document.ownerId];
  const haystack = [
    document.name,
    document.documentId,
    ...document.tags,
    owner?.name ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalized);
}

export function filterDocumentsBySearch(
  documents: Document[],
  q: string | undefined,
  owners: Record<string, Owner> = OWNERS,
): Document[] {
  const normalized = normalizeSearchQuery(q);
  if (!normalized) {
    return documents;
  }

  return documents.filter((doc) => matchesSearchQuery(doc, normalized, owners));
}
