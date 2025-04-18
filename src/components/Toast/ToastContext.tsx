'use client';

import { createContext, useState } from 'react';
import Toast from '@/components/Toast/Toast';
import type { ToastType } from '@/components/Toast/Toast';
import type { ToastContextType, ToastState, ToastProviderProps } from './toast-utils';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastType = 'success'): void => {
    const id = Date.now();
    setToast({ message, type, id });
  };

  const handleClose = (): void => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={handleClose}
        />
      )}
    </ToastContext.Provider>
  );
}
