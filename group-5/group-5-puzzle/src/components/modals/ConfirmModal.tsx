"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ConfirmModal({
  title,
  body,
  action,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  action: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="w-full max-w-md border border-border bg-card p-7 shadow-vault animate-scale-in">
        <div className="mb-7 flex items-start justify-between">
          <div>
            <p className="eyebrow">Confirm action</p>
            <h2
              id="confirm-title"
              className="mt-2 font-display text-3xl text-foreground"
            >
              {title}
            </h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onCancel}
            aria-label="Close"
          >
            <X />
          </Button>
        </div>
        <p className="text-muted-foreground">{body}</p>
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {action}
          </Button>
        </div>
      </div>
    </div>
  );
}
