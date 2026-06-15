'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs } from '@base-ui/react/tabs';
import styles from './SettingsSubNav.module.css';

const TABS = [
  { id: 'overview', label: 'Overview', path: '/settings' },
  { id: 'users', label: 'Users', path: '/settings/users' },
  { id: 'roles', label: 'Role Management', path: '/settings/roles' },
  { id: 'security', label: 'Security', path: '/settings/security' },
];

export function SettingsSubNav() {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = TABS.find(tab => pathname === tab.path)?.id || 'overview';

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    const tab = TABS.find(t => t.id === value);
    if (tab) {
      router.push(tab.path);
    }
  };

  return (
    <Tabs.Root 
      value={currentTab} 
      onValueChange={handleTabChange}
      className={styles.root}
    >
      <Tabs.List className={styles.list}>
        {TABS.map((tab) => (
          <Tabs.Tab 
            key={tab.id} 
            value={tab.id} 
            className={(state) => state.active ? `${styles.tab} ${styles.activeTab}` : styles.tab}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
