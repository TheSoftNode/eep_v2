"use client"

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  preventBackdropClose?: boolean;
  afterLeave?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  preventBackdropClose = false,
  afterLeave
}) => {
  // Size class mapping
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
    xl: 'sm:max-w-4xl',
    full: 'sm:max-w-7xl'
  };

  // Handle ESC key press (only needed if preventBackdropClose is true)
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !preventBackdropClose) {
        onClose();
      }
    };

    if (isOpen && preventBackdropClose) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, preventBackdropClose]);

  // Handle after leave effect
  useEffect(() => {
    if (!isOpen && afterLeave) {
      afterLeave();
    }
  }, [isOpen, afterLeave]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !preventBackdropClose) {
          onClose();
        }
      }}
    >
      <DialogContent
        className={`${sizeClasses[size]} dark:bg-gray-800 overflow-hidden`}
        onInteractOutside={(e) => {
          if (preventBackdropClose) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (preventBackdropClose) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </DialogTitle>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          )}
        </DialogHeader>
        <div className="mt-2 w-full">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;