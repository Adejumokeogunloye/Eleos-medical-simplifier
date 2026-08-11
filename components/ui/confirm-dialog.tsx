"use client";

import { useEffect, useId, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = { open: boolean; title: string; description: string; confirmLabel: string; isConfirming?: boolean; onCancel: () => void; onConfirm: () => void };

export function ConfirmDialog({ open, title, description, confirmLabel, isConfirming = false, onCancel, onConfirm }: ConfirmDialogProps) {
  const descriptionId = useId(); const confirmButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!open) return; confirmButton.current?.focus(); const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && !isConfirming) onCancel(); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [isConfirming, onCancel, open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-healthcare-ink/40 px-5" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby={descriptionId}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><span className="flex size-11 items-center justify-center rounded-xl bg-pink-50 text-healthcare-rose-ink"><AlertTriangle className="size-5" aria-hidden="true" /></span><h2 id="confirm-dialog-title" className="mt-4 text-xl font-bold text-healthcare-ink">{title}</h2><p id={descriptionId} className="mt-2 text-sm leading-6 text-healthcare-soft-ink">{description}</p><div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={onCancel} disabled={isConfirming}>Cancel</Button><Button ref={confirmButton} onClick={onConfirm} disabled={isConfirming} className="bg-healthcare-rose-ink hover:bg-healthcare-rose-ink/90">{isConfirming ? "Deleting…" : confirmLabel}</Button></div></div></div>;
}
