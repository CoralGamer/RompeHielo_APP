"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Borrar todo",
  cancelText = "Cancelar",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-all duration-300" 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 z-10 shadow-2xl border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-200 flex flex-col text-center items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container/50 cursor-pointer bg-transparent border-none"
          title="Cerrar confirmación"
        >
          <X size={18} />
        </button>

        {/* Warning Icon */}
        <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full mb-4 mt-2">
          <AlertTriangle size={32} />
        </div>

        {/* Content */}
        <h3 className="font-extrabold text-lg text-foreground tracking-tight mb-2">
          {title}
        </h3>
        
        <p className="text-xs text-on-surface-variant leading-relaxed mb-6 px-2">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-surface-container/40 hover:bg-surface-container/70 border border-outline-variant/20 text-on-surface-variant font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-98"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-background font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-98 border-none"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
