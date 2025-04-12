import React, { ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
};

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  headerContent, 
  footerContent 
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="font-bold text-lg">{title}</h3>
          {headerContent && headerContent}
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        {footerContent && (
          <div className="modal-footer">
            {footerContent}
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
} 