"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

type ToastVariant = "success" | "error";
type Toast = { id: number; title: string; description?: string; variant: ToastVariant };
type ToastContextValue = { toast: (toast: Omit<Toast, "id">) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((nextToast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...nextToast, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4500);
  }, []);
  const removeToast = (id: number) => setToasts((current) => current.filter((item) => item.id !== id));

  return <ToastContext.Provider value={{ toast }}>{children}<div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex max-w-sm flex-col gap-3 sm:left-auto sm:right-6"><div aria-live="polite" className="space-y-3">{toasts.map((item) => <div key={item.id} className={`pointer-events-auto flex gap-3 rounded-2xl border bg-white/95 p-4 shadow-healthcare backdrop-blur ${item.variant === "success" ? "border-primary/20" : "border-healthcare-pink/30"}`}><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${item.variant === "success" ? "bg-healthcare-lavender text-primary" : "bg-pink-50 text-healthcare-pink"}`}>{item.variant === "success" ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-healthcare-ink">{item.title}</p>{item.description && <p className="mt-1 text-sm text-healthcare-soft-ink">{item.description}</p>}</div><button type="button" onClick={() => removeToast(item.id)} aria-label="Dismiss notification" className="text-healthcare-soft-ink hover:text-primary"><X className="size-4" /></button></div>)}</div></div></ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider.");
  return context;
}
