'use client';

import { Menu } from '@base-ui/react/menu';
import { User, LogOut, Settings } from 'lucide-react';
import styles from './UserMenu.module.css';

export function UserMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger className={styles.trigger}>
        <div className={styles.avatar}>
          <User size={18} />
        </div>
      </Menu.Trigger>
      
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={8}>
          <Menu.Popup className={styles.popup}>
            <div className={styles.userInfo}>
              <div className={styles.name}>John Doe</div>
              <div className={styles.email}>john@legalcorp.com</div>
            </div>
            
            <div className={styles.separator} />
            
            <Menu.Item className={styles.item}>
              <Settings size={16} />
              Account Settings
            </Menu.Item>
            
            <Menu.Item className={styles.item}>
              <LogOut size={16} />
              Sign Out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
