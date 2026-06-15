'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { UploadDialog } from './UploadDialog';

interface UploadContextValue {
  openUpload: () => void;
  closeUpload: () => void;
  isOpen: boolean;
}

const UploadContext = createContext<UploadContextValue | null>(null);

export const UPLOAD_OPEN_EVENT = 'lexvault:open-upload';

interface UploadProviderProps {
  children: ReactNode;
  initialOpen?: boolean;
  onUploadSuccess?: (documentId: string) => void;
}

export function UploadProvider({
  children,
  initialOpen = false,
  onUploadSuccess,
}: UploadProviderProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const openUpload = useCallback(() => setIsOpen(true), []);
  const closeUpload = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = () => openUpload();
    window.addEventListener(UPLOAD_OPEN_EVENT, handler);
    return () => window.removeEventListener(UPLOAD_OPEN_EVENT, handler);
  }, [openUpload]);

  const value = useMemo(
    () => ({ openUpload, closeUpload, isOpen }),
    [openUpload, closeUpload, isOpen],
  );

  return (
    <UploadContext.Provider value={value}>
      {children}
      <UploadDialog
        open={isOpen}
        onClose={closeUpload}
        onSuccess={(documentId) => {
          closeUpload();
          onUploadSuccess?.(documentId);
        }}
      />
    </UploadContext.Provider>
  );
}

export function useUploadDialog(): UploadContextValue {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error('useUploadDialog must be used within UploadProvider');
  }
  return ctx;
}

/** Shell header/FAB can call this without importing UploadProvider internals */
export function dispatchOpenUpload(): void {
  window.dispatchEvent(new CustomEvent(UPLOAD_OPEN_EVENT));
}
