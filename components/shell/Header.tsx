'use client';

import { Bell, History, HelpCircle, Upload } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@base-ui/react/button';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import styles from './Header.module.css';
// Ensure to ignore if it doesn't exist during dev without document-library agent
import { dispatchOpenUpload } from '@/components/library';

export function Header() {
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
        <Link href="/audit-log" className={styles.iconButton} aria-label="History">
          <History size={20} />
        </Link>
        <Button className={styles.uploadButton} onClick={() => dispatchOpenUpload()}>
          <Upload size={16} />
          Upload
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
