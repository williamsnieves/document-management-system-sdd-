'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@base-ui/react/button';
import { Dialog } from '@base-ui/react/dialog';
import {
  Cloud,
  FileStack,
  Filter,
  FileDown,
  Clock,
} from 'lucide-react';

import { CreateFolderDialog } from '@/components/library/CreateFolderDialog';
import { UploadProvider } from '@/components/library/UploadProvider';
import type { DashboardOverview } from '@/lib/dashboard/types';

import { DocumentLifecycleTimeline } from './DocumentLifecycleTimeline';
import { MetricCard } from './MetricCard';
import { QuickActionsPanel } from './QuickActionsPanel';
import { RecentActivityTable } from './RecentActivityTable';
import { SystemStatusPanel } from './SystemStatusPanel';

import styles from './DashboardPage.module.css';

function MetricSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonLine} />
      <div className={`${styles.skeletonLine} ${styles.skeletonLineLarge}`} />
    </div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dashboard/overview');
      if (!response.ok) {
        throw new Error('Failed to load dashboard data.');
      }
      const overview = (await response.json()) as DashboardOverview;
      setData(overview);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load dashboard data.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const handleExport = () => {
    window.location.href = '/api/dashboard/export/pdf';
  };

  return (
    <UploadProvider>
      <div className={styles.page}>
        <header className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Organizational Overview</h1>
            {data && (
              <p className={styles.subtitle}>
                Status as of {data.statusDate}
              </p>
            )}
          </div>
          <div className={styles.headerActions}>
            <Button
              className={styles.headerBtn}
              type="button"
              onClick={() => setFilterOpen(true)}
            >
              <Filter size={16} aria-hidden />
              Filter
            </Button>
            <Button
              className={`${styles.headerBtn} ${styles.headerBtnPrimary}`}
              type="button"
              onClick={handleExport}
            >
              <FileDown size={16} aria-hidden />
              Export Report
            </Button>
          </div>
        </header>

        {error && (
          <div className={styles.error} role="alert">
            <p>{error}</p>
            <Button
              className={styles.retryBtn}
              type="button"
              onClick={() => void loadOverview()}
            >
              Retry
            </Button>
          </div>
        )}

        <div className={styles.metricsRow}>
          {loading ? (
            <>
              <MetricSkeleton />
              <MetricSkeleton />
              <MetricSkeleton />
            </>
          ) : data ? (
            <>
              <MetricCard
                title="Total Documents"
                value={data.metrics.totalDocuments.value}
                delta={data.metrics.totalDocuments.delta}
                icon={FileStack}
              />
              <MetricCard
                title="Pending Approvals"
                value={data.metrics.pendingApprovals.value}
                urgentLabel={
                  data.metrics.pendingApprovals.urgentLabel
                    ? `${data.metrics.pendingApprovals.urgentLabel}`
                    : undefined
                }
                icon={Clock}
              />
              <MetricCard
                title="Cloud Storage Usage"
                value={data.metrics.storage.usedLabel}
                subtitle={`${data.metrics.storage.percentUsed}% of ${data.metrics.storage.totalLabel} allocated`}
                progressPercent={data.metrics.storage.percentUsed}
                icon={Cloud}
                variant="dark"
              />
            </>
          ) : null}
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.mainColumn}>
            {loading ? (
              <div className={styles.skeletonPanel}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
              </div>
            ) : data ? (
              <RecentActivityTable rows={data.recentActivity} />
            ) : null}
          </div>
          <aside className={styles.sideColumn}>
            <QuickActionsPanel onCreateFolder={() => setFolderOpen(true)} />
            {data && <SystemStatusPanel status={data.systemStatus} />}
          </aside>
        </div>

        {loading ? (
          <div className={styles.skeletonPanel}>
            <div className={styles.skeletonLine} />
          </div>
        ) : data?.featuredDocument ? (
          <DocumentLifecycleTimeline document={data.featuredDocument} />
        ) : null}

        <CreateFolderDialog
          open={folderOpen}
          onClose={() => setFolderOpen(false)}
        />

        <Dialog.Root open={filterOpen} onOpenChange={setFilterOpen}>
          <Dialog.Portal>
            <Dialog.Backdrop className={styles.dialogBackdrop} />
            <Dialog.Popup className={styles.dialogPopup}>
              <Dialog.Title className={styles.dialogTitle}>
                Filter Dashboard
              </Dialog.Title>
              <Dialog.Description className={styles.dialogDescription}>
                Date range filtering will be available in a future release.
                Currently showing all-time aggregated data.
              </Dialog.Description>
              <Button
                className={styles.dialogClose}
                type="button"
                onClick={() => setFilterOpen(false)}
              >
                Close
              </Button>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </UploadProvider>
  );
}
