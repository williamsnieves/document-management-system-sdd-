'use client';

import { Button } from '@base-ui/react/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import styles from './PaginationFooter.module.css';

interface PaginationFooterProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function PaginationFooter({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationFooterProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <footer className={styles.footer}>
      <p className={styles.count}>
        Showing {start}-{end} of {total.toLocaleString()} events
      </p>
      <div className={styles.controls}>
        <Button
          className={styles.btn}
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} aria-hidden />
          Previous
        </Button>
        <Button
          className={styles.btn}
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={16} aria-hidden />
        </Button>
      </div>
    </footer>
  );
}
