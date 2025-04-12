import React, { ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, title, subTitle, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="modal-header flex justify-between items-start mb-4">
            <div>
            <h3 className="font-bold text-lg">{title}</h3>
          {subTitle && (
            <div className="text-sm opacity-70">
              {subTitle}
            </div>
          )}
            </div>
          <button 
            className="btn btn-sm btn-circle" 
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
} 