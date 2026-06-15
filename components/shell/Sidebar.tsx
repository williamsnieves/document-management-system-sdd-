'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import { LayoutDashboard, Library, FileCheck, Settings, History, HelpCircle, Plus } from 'lucide-react';
import styles from './Sidebar.module.css';
import { StorageUsageWidget } from './StorageUsageWidget';

export function Sidebar() {
  const pathname = usePathname();

  const isCurrent = (path: string) => pathname?.startsWith(path);

  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>
        <h2>LegalCorp DMS</h2>
        <span>Enterprise Edition</span>
      </div>

      <button className={styles.newWorkspace}>
        <Plus size={16} />
        New Workspace
      </button>

      <NavigationMenu.Root className={styles.navRoot} orientation="vertical">
        <NavigationMenu.List className={styles.navList}>
          <NavigationMenu.Item>
            <Link href="/dashboard" passHref legacyBehavior>
              <NavigationMenu.Link
                className={isCurrent('/dashboard') ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavigationMenu.Link>
            </Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Link href="/library" passHref legacyBehavior>
              <NavigationMenu.Link
                className={isCurrent('/library') ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
              >
                <Library size={18} />
                Library
              </NavigationMenu.Link>
            </Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Link href="/approvals" passHref legacyBehavior>
              <NavigationMenu.Link
                className={isCurrent('/approvals') ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
              >
                <FileCheck size={18} />
                Approvals
              </NavigationMenu.Link>
            </Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <Link href="/settings" passHref legacyBehavior>
              <NavigationMenu.Link
                className={isCurrent('/settings') ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
              >
                <Settings size={18} />
                Settings
              </NavigationMenu.Link>
            </Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <div className={styles.bottomSection}>
        <StorageUsageWidget />

        <div className={styles.bottomLinks}>
          <Link href="/audit-log" className={styles.bottomLink}>
            <History size={16} />
            Audit Log
          </Link>
          <Link href="/support" className={styles.bottomLink}>
            <HelpCircle size={16} />
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
