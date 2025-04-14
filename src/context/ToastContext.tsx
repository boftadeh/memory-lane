'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

import Toast, { type ToastType } from '@/components/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

interface ToastState {
  message: string;
  type: ToastType;
  id: number;
}

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
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

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 