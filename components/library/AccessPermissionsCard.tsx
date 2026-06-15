'use client';

import { Users, Shield } from 'lucide-react';
import type { Document } from '@/lib/documents/types';
import styles from './Cards.module.css';

interface AccessPermissionsCardProps {
  document: Document;
}

export function AccessPermissionsCard({ document }: AccessPermissionsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Users size={16} />
          Access Permissions
        </h3>
        <button className={styles.linkBtn}>Manage</button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.permissionRow}>
          <div className={styles.permissionInfo}>
            <span className={styles.permissionName}>Document Owner</span>
            <span className={styles.permissionRole}>Owner</span>
          </div>
        </div>
        <div className={styles.permissionRow}>
          <div className={styles.permissionInfo}>
            <span className={styles.permissionName}>Legal Team</span>
            <span className={styles.permissionRole}>Editor</span>
          </div>
        </div>
        <div className={styles.permissionRow}>
          <div className={styles.permissionInfo}>
            <span className={styles.permissionName}>All Employees</span>
            <span className={styles.permissionRole}>{document.accessLevel === 'restricted' ? 'None' : 'Viewer'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
