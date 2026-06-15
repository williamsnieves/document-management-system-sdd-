'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Download, Share2, Edit, AlertTriangle } from 'lucide-react';
import { Button } from '@base-ui/react/button';

import type { Document, Version, Owner } from '@/lib/documents/types';
import { CATEGORY_LABELS } from '@/lib/documents/types';
import { formatAbsoluteDate } from '@/lib/documents/format';

import { StatusBadge } from '@/components/library/StatusBadge';
import { DocumentPreview } from '@/components/library/DocumentPreview';
import { VersionHistorySidebar } from '@/components/library/VersionHistorySidebar';
import { AccessPermissionsCard } from '@/components/library/AccessPermissionsCard';
import { ClassificationCard } from '@/components/library/ClassificationCard';
import { AuditHealthCard } from '@/components/library/AuditHealthCard';
import { ConflictResolution } from '@/components/library/ConflictResolution';
import { ShareDialog } from '@/components/library/ShareDialog';
import { UploadDialog } from '@/components/library/UploadDialog';

import styles from './page.module.css';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [owners, setOwners] = useState<Record<string, Owner>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showShare, setShowShare] = useState(false);
  const [showConflict, setShowConflict] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchData = async () => {
    try {
      const [docRes, verRes, listRes] = await Promise.all([
        fetch(`/api/documents/${documentId}`),
        fetch(`/api/documents/${documentId}/versions`),
        fetch('/api/documents?pageSize=1'), // Just to get owners map easily
      ]);

      if (!docRes.ok) throw new Error('Document not found');
      
      const docData = await docRes.json();
      const verData = await verRes.json();
      const listData = await listRes.json();

      setDocument(docData.document);
      setVersions(verData.versions);
      setOwners(listData.owners || {});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [documentId]);

  if (loading) {
    return <div className={styles.loading}>Loading document...</div>;
  }

  if (error || !document) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error || 'Document not found'}</p>
        <Button onClick={() => router.push('/library')}>Back to Library</Button>
      </div>
    );
  }

  const currentVersion = versions.find(v => v.versionNumber === document.currentVersion) || versions[0];
  const hasConflict = document.status === 'conflict';

  const handleRestore = async (versionId: string) => {
    if (!window.confirm('Are you sure you want to restore this version?')) return;
    try {
      const res = await fetch(`/api/documents/${documentId}/versions/${versionId}/restore`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to restore version');
      }
    } catch (err) {
      alert('Error restoring version');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link href="/library" className={styles.breadcrumbLink}>Library</Link>
        <ChevronRight size={14} className={styles.breadcrumbIcon} />
        <span className={styles.breadcrumbText}>{CATEGORY_LABELS[document.category]}</span>
        <ChevronRight size={14} className={styles.breadcrumbIcon} />
        <span className={styles.breadcrumbCurrent}>{document.name}</span>
      </div>

      <header className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{document.name}</h1>
            <StatusBadge status={document.status} />
          </div>
          <div className={styles.metaRow}>
            <span>{document.documentId}</span>
            <span>•</span>
            <span>Last updated {formatAbsoluteDate(document.updatedAt)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          {hasConflict && (
            <Button className={styles.resolveBtn} onClick={() => setShowConflict(true)}>
              <AlertTriangle size={16} />
              Resolve Conflict
            </Button>
          )}
          <Button className={styles.actionBtn} onClick={() => setShowShare(true)}>
            <Share2 size={16} />
            Share
          </Button>
          <Button className={styles.actionBtn}>
            <Edit size={16} />
            Edit Metadata
          </Button>
          <Button 
            className={styles.primaryBtn} 
            onClick={() => window.open(`/api/documents/${document.id}/download`, '_blank')}
          >
            <Download size={16} />
            Download Final
          </Button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.mainColumn}>
          <DocumentPreview document={document} currentVersion={currentVersion} />
        </div>
        
        <div className={styles.sideColumn}>
          <VersionHistorySidebar 
            versions={versions} 
            currentVersionNumber={document.currentVersion}
            owners={owners}
            onRestore={handleRestore}
            onUploadNew={() => setShowUpload(true)}
          />
          <AccessPermissionsCard document={document} />
          <ClassificationCard document={document} />
          <AuditHealthCard document={document} />
        </div>
      </div>

      {showShare && (
        <ShareDialog 
          document={document} 
          open={showShare} 
          onClose={() => setShowShare(false)} 
        />
      )}

      {showConflict && (
        <ConflictResolution 
          document={document} 
          versions={versions} 
          open={showConflict} 
          onClose={() => setShowConflict(false)}
          onSuccess={fetchData}
        />
      )}

      {showUpload && (
        <UploadDialog 
          open={showUpload} 
          onClose={() => setShowUpload(false)} 
          onSuccess={fetchData} 
          documentId={documentId}
        />
      )}
    </div>
  );
}
