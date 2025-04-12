'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-success' : 'bg-error';
  const textColor = type === 'success' ? 'text-success-content' : 'text-error-content';
  const Icon = type === 'success' ? CheckCircleIcon : XCircleIcon;

  return (
    <div className={`toast toast-top toast-end z-50 transition-all duration-300 ease-in-out transform ${isExiting ? 'translate-x-[100%] opacity-0' : 'translate-x-0 opacity-100'}`}>
      <div className={`alert ${bgColor} ${textColor} shadow-lg`}>
        <Icon className="h-6 w-6" />
        <span>{message}</span>
        <button 
          className="btn btn-ghost btn-sm btn-circle" 
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose();
            }, 300);
          }}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 