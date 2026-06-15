'use client';

import { Tag, Plus } from 'lucide-react';
import type { Document } from '@/lib/documents/types';
import styles from './Cards.module.css';

interface ClassificationCardProps {
  document: Document;
}

export function ClassificationCard({ document }: ClassificationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Tag size={16} />
          Classification
        </h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Confidentiality Level</h4>
          <span className={`${styles.levelBadge} ${document.accessLevel === 'restricted' ? styles.levelRestricted : styles.levelStandard}`}>
            {document.accessLevel === 'restricted' ? 'Restricted Internal' : 'Internal Use'}
          </span>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Tags</h4>
          <div className={styles.tags}>
            {document.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
            <button className={styles.addTagBtn}>
              <Plus size={14} />
              Add Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
