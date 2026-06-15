'use client';

import { useState, useRef } from 'react';
import { AlertTriangle, Upload, X } from 'lucide-react';
import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@base-ui/react/button';
import type { Document, Version } from '@/lib/documents/types';
import styles from './ConflictResolution.module.css';

interface ConflictResolutionProps {
  document: Document;
  versions: Version[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConflictResolution({ document, versions, open, onClose, onSuccess }: ConflictResolutionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('Manual merge of conflicting versions');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conflictingVersions = versions.filter(v => v.status === 'conflict');

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select the merged file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      const response = await fetch(`/api/documents/${document.id}/resolve-conflict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resolve conflict');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>
              <AlertTriangle size={18} className={styles.warningIcon} />
              Resolve Version Conflict
            </Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close">
              <X size={18} />
            </Dialog.Close>
          </div>

          <div className={styles.content}>
            <p className={styles.description}>
              Multiple users uploaded versions concurrently. Please review the conflicting versions and upload a manually merged final version.
            </p>

            <div className={styles.versionsList}>
              {conflictingVersions.map(v => (
                <div key={v.id} className={styles.versionItem}>
                  <span className={styles.versionNum}>v{v.versionNumber}</span>
                  <a href={v.fileUrl} target="_blank" rel="noreferrer" className={styles.downloadLink}>
                    Download
                  </a>
                </div>
              ))}
            </div>

            <div
              className={styles.dropzone}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <Upload size={24} aria-hidden />
              <p>{file ? file.name : 'Click to select merged file'}</p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.xlsx"
                className={styles.hiddenInput}
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setError(null);
                }}
              />
            </div>

            <label className={styles.field}>
              <span>Resolution Note</span>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                className={styles.input}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.actions}>
            <Button className={styles.cancelBtn} onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button className={styles.submitBtn} onClick={handleSubmit} disabled={uploading || !file}>
              {uploading ? 'Resolving...' : 'Upload Merged Version'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
