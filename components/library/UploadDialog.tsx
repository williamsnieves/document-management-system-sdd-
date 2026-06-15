'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Upload, X } from 'lucide-react';
import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@base-ui/react/button';

import { getCurrentUser } from '@/lib/auth/middleware';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { hasPermission } from '@/lib/roles/hasPermission';
import type { DocumentCategory } from '@/lib/documents/types';
import { CATEGORY_LABELS } from '@/lib/documents/types';

import styles from './UploadDialog.module.css';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (documentId: string) => void;
  documentId?: string; // If provided, uploads a new version instead of a new document
}

export function UploadDialog({ open, onClose, onSuccess, documentId }: UploadDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>('legal');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const canUpload = hasPermission(getCurrentUser(), PERMISSIONS.UPLOAD);

  const reset = useCallback(() => {
    setFile(null);
    setError(null);
    setUploading(false);
    setProgress(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!canUpload) {
      setError('You do not have permission to upload documents.');
      return;
    }
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (!documentId) {
        formData.append('category', category);
      }

      setProgress(40);
      const url = documentId ? `/api/documents/${documentId}/versions` : '/api/documents/upload';
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      setProgress(80);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Upload failed.');
        setUploading(false);
        return;
      }

      setProgress(100);
      const docId = documentId || data.document.id;
      onSuccess?.(docId);
      reset();
      if (!documentId) {
        router.push(`/documents/${docId}`);
      }
    } catch {
      setError('Network error. Please try again.');
      setUploading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Upload Document</Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close">
              <X size={18} />
            </Dialog.Close>
          </div>

          {!canUpload ? (
            <div className={styles.denied} role="alert">
              <AlertCircle size={20} aria-hidden />
              <p>You do not have permission to upload documents.</p>
            </div>
          ) : (
            <>
              <div
                className={styles.dropzone}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <Upload size={24} aria-hidden />
                <p>{file ? file.name : 'Click to select PDF, DOCX, or XLSX'}</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className={styles.hiddenInput}
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setError(null);
                  }}
                />
              </div>

              {!documentId && (
                <label className={styles.field}>
                  <span>Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                    disabled={uploading}
                  >
                    {(Object.keys(CATEGORY_LABELS) as DocumentCategory[]).map((key) => (
                      <option key={key} value={key}>
                        {CATEGORY_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {uploading && (
                <div className={styles.progressBar} aria-label="Upload progress">
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <div className={styles.actions}>
                <Button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleClose}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={uploading || !file}
                >
                  {uploading ? 'Uploading…' : 'Upload'}
                </Button>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
