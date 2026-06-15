'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@base-ui/react/button';
import { Upload } from 'lucide-react';
import styles from './FloatingUploadButton.module.css';
import { dispatchOpenUpload } from '@/components/library';

export function FloatingUploadButton() {
  const pathname = usePathname();
  
  // Show FAB only on Dashboard and Library pages
  const isVisible = pathname === '/dashboard' || pathname === '/library';
  
  if (!isVisible) return null;

  return (
    <Button className={styles.fab} onClick={() => dispatchOpenUpload()} aria-label="Quick Upload">
      <Upload size={24} />
    </Button>
  );
}
