"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

import { useUiStore } from "@/store/useUiStore";

export function ToastViewport() {
  const toast = useUiStore((state) => state.toast);
  const clearToast = useUiStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => {
      clearToast();
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[120] w-full max-w-sm">
      <div className="pointer-events-auto overflow-hidden rounded-[24px] border border-emerald-200 bg-white shadow-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-primary to-orange-400" />
        <div className="flex items-start gap-3 p-4">
          <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-primary">{toast.title}</p>
            {toast.description && (
              <p className="mt-1 text-sm leading-6 text-text-secondary">
                {toast.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={clearToast}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
