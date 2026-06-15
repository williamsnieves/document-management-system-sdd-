import type { LucideIcon } from 'lucide-react';

import styles from './MetricCard.module.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string;
  urgentLabel?: string;
  icon: LucideIcon;
  variant?: 'default' | 'dark';
  progressPercent?: number;
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  urgentLabel,
  icon: Icon,
  variant = 'default',
  progressPercent,
  subtitle,
}: MetricCardProps) {
  return (
    <article
      className={`${styles.card} ${variant === 'dark' ? styles.dark : ''}`}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <Icon size={18} className={styles.icon} aria-hidden />
      </div>
      <p className={styles.value}>{value}</p>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {progressPercent !== undefined && (
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
      {delta && (
        <p className={styles.delta}>
          <span className={styles.deltaPositive}>↑</span> {delta}
        </p>
      )}
      {urgentLabel && (
        <p className={styles.urgent}>
          <span className={styles.urgentIcon}>!</span> {urgentLabel}
        </p>
      )}
    </article>
  );
}
