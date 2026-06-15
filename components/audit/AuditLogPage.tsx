'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@base-ui/react/button';
import { FileDown, FileText } from 'lucide-react';

import { getCurrentUser } from '@/lib/auth/middleware';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { hasPermission } from '@/lib/roles/hasPermission';
import type { AuditEvent, AuditQueryResult } from '@/lib/audit/types';

import { AuditEventTable } from './AuditEventTable';
import { FilterBar, type AuditFilters } from './FilterBar';
import { PaginationFooter } from './PaginationFooter';

import styles from './AuditLogPage.module.css';

const DEFAULT_FILTERS: AuditFilters = {
  dateRange: '24h',
  eventType: 'all',
  userId: 'all',
  severity: 'all',
};

function buildQueryString(filters: AuditFilters, page: number): string {
  const params = new URLSearchParams({
    dateRange: filters.dateRange,
    eventType: filters.eventType,
    userId: filters.userId,
    severity: filters.severity,
    page: String(page),
    pageSize: '10',
  });
  return params.toString();
}

export function AuditLogPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const canView = hasPermission(user, PERMISSIONS.VIEW_AUDIT_LOGS);

  const [filters, setFilters] = useState<AuditFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<
    (AuditQueryResult & { users: { id: string; name: string }[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(
    () => buildQueryString(filters, page),
    [filters, page],
  );

  const loadEvents = useCallback(async () => {
    if (!canView) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/audit?${queryString}`);
      if (response.status === 403) {
        router.replace('/dashboard');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to load audit events.');
      }
      const result = await response.json();
      setData(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load audit events.',
      );
    } finally {
      setLoading(false);
    }
  }, [canView, queryString, router]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleFilterChange = (next: AuditFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    window.location.href = `/api/audit/export/${format}?${queryString.replace(/page=\d+&?/, '').replace(/pageSize=\d+&?/, '')}`;
  };

  if (!canView) {
    return (
      <div className={styles.denied}>
        <h1 className={styles.deniedTitle}>Access Denied</h1>
        <p className={styles.deniedText}>
          You do not have permission to view audit logs. Contact your
          administrator to request the View Audit Logs role.
        </p>
        <Button
          className={styles.deniedBtn}
          type="button"
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Audit Log</h1>
          <p className={styles.description}>
            Comprehensive history of all document actions and system events
          </p>
        </div>
        <div className={styles.exportActions}>
          <Button
            className={styles.exportBtn}
            type="button"
            onClick={() => handleExport('pdf')}
          >
            <FileText size={16} aria-hidden />
            Export PDF
          </Button>
          <Button
            className={styles.exportBtn}
            type="button"
            onClick={() => handleExport('csv')}
          >
            <FileDown size={16} aria-hidden />
            Export CSV
          </Button>
        </div>
      </header>

      <FilterBar
        filters={filters}
        users={data?.users ?? []}
        onChange={handleFilterChange}
      />

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading audit events…</div>
      ) : (
        <>
          <AuditEventTable events={(data?.events ?? []) as AuditEvent[]} />
          {data && (
            <PaginationFooter
              page={data.pagination.page}
              pageSize={data.pagination.pageSize}
              total={data.pagination.total}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
