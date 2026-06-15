'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@base-ui/react/button';
import { FolderPlus, LayoutGrid, List, Search } from 'lucide-react';

import type {
  ActivityEvent,
  Document,
  DocumentCategory,
  DocumentStatus,
  DocumentView,
  Owner,
} from '@/lib/documents/types';

import { CategoryFilter } from './CategoryFilter';
import { DocumentGrid } from './DocumentGrid';
import { DocumentTable } from './DocumentTable';
import { EmptySearchState } from './EmptySearchState';
import { LibraryRecentActivity } from './LibraryRecentActivity';
import { SecurityStatusCard } from './SecurityStatusCard';
import { StatusLegend } from './StatusLegend';
import { UploadProvider } from './UploadProvider';
import { useDebouncedValue } from './useDebouncedValue';
import { CreateFolderDialog } from './CreateFolderDialog';

import styles from './LibraryWorkspace.module.css';

interface LibraryData {
  documents: Document[];
  owners: Record<string, Owner>;
  categoryCounts: Record<DocumentCategory, number>;
  activity: ActivityEvent[];
  pagination: {
    page: number;
    total: number;
  };
}

const DEFAULT_CATEGORIES: DocumentCategory[] = ['legal', 'finance', 'hr'];

export function LibraryWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlQuery = searchParams.get('q') ?? '';
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const debouncedLocalQuery = useDebouncedValue(localQuery, 300);

  const selectedCategories = useMemo(() => {
    const raw = searchParams.get('category');
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = raw.split(',').filter(Boolean) as DocumentCategory[];
    return parsed.length ? parsed : DEFAULT_CATEGORIES;
  }, [searchParams]);

  const selectedStatuses = useMemo(() => {
    const raw = searchParams.get('status');
    if (!raw) return [] as DocumentStatus[];
    return raw.split(',').filter(Boolean) as DocumentStatus[];
  }, [searchParams]);

  const view: DocumentView =
    searchParams.get('view') === 'grid' ? 'grid' : 'list';
  const sort = searchParams.get('sort') ?? 'updatedAt';
  const uploadOpen = searchParams.get('upload') === 'true';

  const activeQuery = urlQuery || debouncedLocalQuery;

  const [data, setData] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [folderOpen, setFolderOpen] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      startTransition(() => {
        router.replace(`/library?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  useEffect(() => {
    setLocalQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (debouncedLocalQuery === urlQuery) {
      return;
    }
    updateParams({ q: debouncedLocalQuery || null });
  }, [debouncedLocalQuery, urlQuery, updateParams]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeQuery) params.set('q', activeQuery);
      if (
        selectedCategories.length &&
        selectedCategories.length < DEFAULT_CATEGORIES.length
      ) {
        params.set('category', selectedCategories.join(','));
      }
      if (selectedStatuses.length) {
        params.set('status', selectedStatuses.join(','));
      }
      params.set('sort', sort);
      params.set('order', 'desc');
      params.set('view', view);

      const response = await fetch(`/api/documents?${params.toString()}`);
      const json = await response.json();
      if (!cancelled) {
        setData(json);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [activeQuery, selectedCategories, selectedStatuses, sort, view]);

  const handleCategoryChange = (categories: DocumentCategory[]) => {
    const allSelected =
      categories.length === DEFAULT_CATEGORIES.length &&
      DEFAULT_CATEGORIES.every((c) => categories.includes(c));
    updateParams({
      category: allSelected ? null : categories.join(','),
    });
  };

  const handleStatusChange = (statuses: DocumentStatus[]) => {
    updateParams({
      status: statuses.length ? statuses.join(',') : null,
    });
  };

  const clearSearch = () => {
    setLocalQuery('');
    updateParams({ q: null });
  };

  const documents = data?.documents ?? [];
  const showEmptySearch = Boolean(activeQuery) && documents.length === 0 && !loading;

  return (
    <UploadProvider
      initialOpen={uploadOpen}
      onUploadSuccess={() => {
        updateParams({ upload: null });
      }}
    >
      <div className={styles.workspace}>
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>Library Workspace</h1>
          <div className={styles.controls}>
            <div className={styles.localSearch}>
              <Search size={16} aria-hidden className={styles.searchIcon} />
              <input
                type="search"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search documents…"
                className={styles.searchInput}
                aria-label="Search documents"
              />
            </div>
            <Button
              type="button"
              className={styles.folderBtn}
              onClick={() => setFolderOpen(true)}
            >
              <FolderPlus size={16} aria-hidden />
              Create Folder
            </Button>
            <label className={styles.sortControl}>
              <span className={styles.sortLabel}>Sort</span>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className={styles.sortSelect}
              >
                <option value="updatedAt">Last Modified</option>
                <option value="name">Name</option>
                <option value="documentId">Document ID</option>
              </select>
            </label>
            <div className={styles.viewToggle} role="group" aria-label="View mode">
              <button
                type="button"
                className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
                onClick={() => updateParams({ view: 'list' })}
                aria-pressed={view === 'list'}
              >
                <List size={16} aria-hidden />
                List
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${view === 'grid' ? styles.viewBtnActive : ''}`}
                onClick={() => updateParams({ view: 'grid' })}
                aria-pressed={view === 'grid'}
              >
                <LayoutGrid size={16} aria-hidden />
                Grid
              </button>
            </div>
          </div>
        </header>

        <div className={styles.body}>
          <aside className={styles.filters}>
            <CategoryFilter
              selected={selectedCategories}
              counts={data?.categoryCounts ?? { legal: 124, finance: 82, hr: 45 }}
              onChange={handleCategoryChange}
            />
            <StatusLegend
              selected={selectedStatuses}
              onChange={handleStatusChange}
            />
          </aside>

          <div className={styles.main}>
            <div className={isPending || loading ? styles.loading : undefined}>
              {showEmptySearch ? (
                <EmptySearchState query={activeQuery} onClear={clearSearch} />
              ) : view === 'grid' ? (
                <DocumentGrid
                  documents={documents}
                  owners={data?.owners ?? {}}
                />
              ) : (
                <DocumentTable
                  documents={documents}
                  owners={data?.owners ?? {}}
                />
              )}
            </div>
            {data?.activity && data.activity.length > 0 && (
              <LibraryRecentActivity events={data.activity} />
            )}
          </div>

          <aside className={styles.aside}>
            <SecurityStatusCard />
          </aside>
        </div>
      </div>

      <CreateFolderDialog
        open={folderOpen}
        onClose={() => setFolderOpen(false)}
      />
    </UploadProvider>
  );
}
