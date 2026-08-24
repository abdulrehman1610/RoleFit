import React, { useEffect } from "react";
import { Info, AlertTriangle, CheckCircle2, XCircle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "info" | "warning" | "error" | "success";
  text: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case "error":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200 shadow-xl",
          icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
        };
      case "warning":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/90 border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 shadow-xl",
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
      case "success":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 shadow-xl",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        };
      default:
        return {
          bg: "bg-slate-900 dark:bg-[#0F1626]/95 border-slate-800 dark:border-[#1C2638] text-white dark:text-slate-200 shadow-xl",
          icon: <Info className="w-5 h-5 text-emerald-400 shrink-0" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border shadow-lg flex items-start justify-between gap-3 text-xs sm:text-sm font-simple transition-all animate-fade-in ${style.bg}`}
    >
      <div className="flex items-start gap-2.5">
        {style.icon}
        <span className="leading-relaxed font-medium mt-0.5">{toast.text}</span>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
