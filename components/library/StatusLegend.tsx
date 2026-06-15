import type { DocumentStatus } from '@/lib/documents/types';
import { STATUS_LABELS } from '@/lib/documents/types';

import styles from './StatusLegend.module.css';

const STATUSES: DocumentStatus[] = ['approved', 'in_review', 'draft'];

interface StatusLegendProps {
  selected?: DocumentStatus[];
  onChange?: (statuses: DocumentStatus[]) => void;
}

export function StatusLegend({ selected = [], onChange }: StatusLegendProps) {
  const toggle = (status: DocumentStatus) => {
    if (!onChange) return;
    if (selected.includes(status)) {
      onChange(selected.filter((s) => s !== status));
    } else {
      onChange([...selected, status]);
    }
  };

  return (
    <section className={styles.panel} aria-label="Status legend">
      <h2 className={styles.heading}>Status</h2>
      <ul className={styles.list}>
        {STATUSES.map((status) => {
          const isActive = selected.includes(status);
          return (
            <li key={status}>
              <button
                type="button"
                className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                onClick={() => toggle(status)}
                aria-pressed={onChange ? isActive : undefined}
              >
                <span
                  className={`${styles.dot} ${styles[status]}`}
                  aria-hidden
                />
                <span>{STATUS_LABELS[status]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function statusClassName(status: DocumentStatus): string {
  return styles[status] ?? '';
}
