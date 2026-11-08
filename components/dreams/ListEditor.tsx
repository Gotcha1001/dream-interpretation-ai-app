"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Small shell for "add another" repeating field groups in the profile form. */
export function ListEditor({
  label,
  hint,
  addLabel,
  onAdd,
  children,
  empty,
}: {
  label: string;
  hint?: string;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
  empty: boolean;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">{label}</h3>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {empty && (
        <p className="text-xs italic text-muted-foreground">
          Nothing added yet.
        </p>
      )}
      {children}
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus size={14} className="mr-1" /> {addLabel}
      </Button>
    </div>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="Remove"
      className="text-muted-foreground hover:text-red-500"
    >
      <Trash2 size={15} />
    </Button>
  );
}
