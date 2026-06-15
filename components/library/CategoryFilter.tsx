'use client';

import { Checkbox } from '@base-ui/react/checkbox';
import { Check } from 'lucide-react';

import type { DocumentCategory } from '@/lib/documents/types';
import { CATEGORY_LABELS } from '@/lib/documents/types';

import styles from './CategoryFilter.module.css';

const ALL_CATEGORIES: DocumentCategory[] = ['legal', 'finance', 'hr'];

interface CategoryFilterProps {
  selected: DocumentCategory[];
  counts: Record<DocumentCategory, number>;
  onChange: (categories: DocumentCategory[]) => void;
}

export function CategoryFilter({
  selected,
  counts,
  onChange,
}: CategoryFilterProps) {
  const toggle = (category: DocumentCategory) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <section className={styles.panel} aria-label="Category filters">
      <h2 className={styles.heading}>Categories</h2>
      <ul className={styles.list}>
        {ALL_CATEGORIES.map((category) => {
          const checked = selected.includes(category);
          return (
            <li key={category} className={styles.item}>
              <label className={styles.label}>
                <Checkbox.Root
                  checked={checked}
                  onCheckedChange={() => toggle(category)}
                  className={styles.checkbox}
                >
                  <Checkbox.Indicator className={styles.indicator}>
                    <Check size={12} aria-hidden />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span className={styles.labelText}>
                  {CATEGORY_LABELS[category]}
                </span>
                <span className={styles.count}>{counts[category]}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
