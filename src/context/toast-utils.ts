import { type ReactNode } from 'react';
import { type ToastType } from '@/components/Toast';

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

export interface ToastState {
  message: string;
  type: ToastType;
  id: number;
}

export interface ToastProviderProps {
  children: ReactNode;
} 