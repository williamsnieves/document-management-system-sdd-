'use client';

import styles from './StorageUsageWidget.module.css';

export function StorageUsageWidget() {
  const used = 45; // GB
  const total = 100; // GB
  const percentage = (used / total) * 100;
  
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <span className={styles.title}>Storage</span>
        <span className={styles.usage}>{used}GB / {total}GB</span>
      </div>
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
