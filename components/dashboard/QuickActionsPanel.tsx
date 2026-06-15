'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@base-ui/react/button';
import { FolderPlus, Share2, Upload } from 'lucide-react';

import { dispatchOpenUpload } from '@/components/library';

import styles from './QuickActionsPanel.module.css';

interface QuickActionsPanelProps {
  onCreateFolder: () => void;
}

export function QuickActionsPanel({ onCreateFolder }: QuickActionsPanelProps) {
  const router = useRouter();

  return (
    <section className={styles.panel} aria-label="Quick actions">
      <h2 className={styles.heading}>Quick Actions</h2>
      <ul className={styles.list}>
        <li>
          <Button
            className={styles.action}
            type="button"
            onClick={() => dispatchOpenUpload()}
          >
            <Upload size={16} aria-hidden />
            Upload New Document
          </Button>
        </li>
        <li>
          <Button
            className={styles.action}
            type="button"
            onClick={onCreateFolder}
          >
            <FolderPlus size={16} aria-hidden />
            Create Folder
          </Button>
        </li>
        <li>
          <Button
            className={styles.action}
            type="button"
            onClick={() => router.push('/settings')}
          >
            <Share2 size={16} aria-hidden />
            Share Workspace
          </Button>
        </li>
      </ul>
    </section>
  );
}
