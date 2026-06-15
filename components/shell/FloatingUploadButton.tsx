'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@base-ui/react/button';
import { Upload } from 'lucide-react';
import styles from './FloatingUploadButton.module.css';
import { dispatchOpenUpload } from '@/components/library';
import { getCurrentUser } from '@/lib/auth/middleware';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { hasPermission } from '@/lib/roles/hasPermission';

export function FloatingUploadButton() {
  const pathname = usePathname();
  const user = getCurrentUser();
  const canUpload = hasPermission(user, PERMISSIONS.UPLOAD);

  const isVisible =
    canUpload && (pathname === '/dashboard' || pathname === '/library');

  if (!isVisible) return null;

  return (
    <Button className={styles.fab} onClick={() => dispatchOpenUpload()} aria-label="Quick Upload">
      <Upload size={24} />
    </Button>
  );
}
