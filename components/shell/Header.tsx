'use client';

import { Bell, History, HelpCircle, Upload } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@base-ui/react/button';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import styles from './Header.module.css';
import { dispatchOpenUpload } from '@/components/library';
import { getCurrentUser } from '@/lib/auth/middleware';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { hasPermission } from '@/lib/roles/hasPermission';

export function Header() {
  const user = getCurrentUser();
  const canUpload = hasPermission(user, PERMISSIONS.UPLOAD);
  const canViewAudit = hasPermission(user, PERMISSIONS.VIEW_AUDIT_LOGS);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>LexVault DMS</h1>
      </div>

      <div className={styles.center}>
        <SearchBar />
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button className={styles.iconButton} aria-label="Help">
          <HelpCircle size={20} />
        </button>
        {canViewAudit && (
          <Link href="/audit-log" className={styles.iconButton} aria-label="History">
            <History size={20} />
          </Link>
        )}
        {canUpload && (
          <Button className={styles.uploadButton} onClick={() => dispatchOpenUpload()}>
            <Upload size={16} />
            Upload
          </Button>
        )}
        <UserMenu />
      </div>
    </header>
  );
}
