import { CheckCircle2, Clock, FileEdit, AlertTriangle } from 'lucide-react';
import type { DocumentStatus } from '@/lib/documents/types';
import { STATUS_LABELS } from '@/lib/documents/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const Icon = {
    approved: CheckCircle2,
    in_review: Clock,
    draft: FileEdit,
    conflict: AlertTriangle,
  }[status];

  return (
    <span className={`${styles.badge} ${styles[status]} ${className}`}>
      <Icon size={14} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
