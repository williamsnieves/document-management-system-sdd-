'use client';

import { SearchX } from 'lucide-react';
import Link from 'next/link';

import styles from './EmptySearchState.module.css';

interface EmptySearchStateProps {
  query: string;
  onClear?: () => void;
}

export function EmptySearchState({ query, onClear }: EmptySearchStateProps) {
  return (
    <div className={styles.empty} role="status">
      <SearchX size={40} className={styles.icon} aria-hidden />
      <h3 className={styles.title}>No documents found</h3>
      <p className={styles.message}>
        No results for &ldquo;{query}&rdquo;. Try clearing your search or
        adjusting filters.
      </p>
      {onClear ? (
        <button type="button" className={styles.button} onClick={onClear}>
          Clear search
        </button>
      ) : (
        <Link href="/library" className={styles.button}>
          Clear search
        </Link>
      )}
    </div>
  );
}
