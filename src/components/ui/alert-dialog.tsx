'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange?.(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const AlertDialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

export const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);

export const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl font-sans font-bold text-neutral-900">{children}</h3>
);

export const AlertDialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-neutral-500 leading-relaxed mt-2">{children}</p>
);

export const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">{children}</div>
);

export const AlertDialogAction = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-[#00693e] text-white rounded-lg text-sm font-bold tracking-wide transition-transform active:scale-95"
  >
    {children}
  </button>
);

export const AlertDialogCancel = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-lg text-sm font-medium transition-transform active:scale-95"
  >
    {children}
  </button>
);
