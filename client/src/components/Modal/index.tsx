import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  // Ensure the modal is rendered in a portal attached to document.body
  const modalRoot = document.getElementById('modal-root') || document.body;

  // Close on Escape key press
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50" onClick={onClose}>
      <div className="bg-[#1C1410] rounded-lg p-4" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
}
