import { useContext } from 'react';
import { ToastContext } from './ToastContext';
import type { ToastContextType } from './toast-utils';

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}