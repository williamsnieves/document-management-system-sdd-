'use client';

import { Calendar, Layers, Shield, User } from 'lucide-react';

import {
  DATE_RANGE_OPTIONS,
  EVENT_TYPE_OPTIONS,
  SEVERITY_OPTIONS,
} from '@/lib/audit/constants';
import type {
  AuditActionType,
  AuditSeverity,
  DateRangeFilter,
} from '@/lib/audit/types';

import styles from './FilterBar.module.css';

export interface AuditFilters {
  dateRange: DateRangeFilter;
  eventType: AuditActionType | 'all';
  userId: string;
  severity: AuditSeverity | 'all';
}

interface FilterBarProps {
  filters: AuditFilters;
  users: { id: string; name: string }[];
  onChange: (filters: AuditFilters) => void;
}

export function FilterBar({ filters, users, onChange }: FilterBarProps) {
  const update = (partial: Partial<AuditFilters>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <div className={styles.bar}>
      <label className={styles.field}>
        <span className={styles.label}>Date Range</span>
        <div className={styles.selectWrap}>
          <Calendar size={16} className={styles.fieldIcon} aria-hidden />
          <select
            className={styles.select}
            value={filters.dateRange}
            onChange={(e) =>
              update({ dateRange: e.target.value as DateRangeFilter })
            }
          >
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Event Type</span>
        <div className={styles.selectWrap}>
          <Layers size={16} className={styles.fieldIcon} aria-hidden />
          <select
            className={styles.select}
            value={filters.eventType}
            onChange={(e) =>
              update({
                eventType: e.target.value as AuditActionType | 'all',
              })
            }
          >
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>User</span>
        <div className={styles.selectWrap}>
          <User size={16} className={styles.fieldIcon} aria-hidden />
          <select
            className={styles.select}
            value={filters.userId}
            onChange={(e) => update({ userId: e.target.value })}
          >
            <option value="all">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Severity</span>
        <div className={styles.selectWrap}>
          <Shield size={16} className={styles.fieldIcon} aria-hidden />
          <select
            className={styles.select}
            value={filters.severity}
            onChange={(e) =>
              update({ severity: e.target.value as AuditSeverity | 'all' })
            }
          >
            {SEVERITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );
}
