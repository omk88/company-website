"use client";

import { Checkbox } from "../ui/checkbox";
import { Trash2 } from "lucide-react";

interface SelectorProps<T extends string> {
  isAllSelected: boolean;
  isSomeSelected: boolean;
  selectedIds: T[];
  onToggleAll: (checked: boolean) => void;
  renderDeleteDialog: (
    selectedIds: T[],
    trigger: React.ReactNode
  ) => React.ReactNode;
}

export function Selector<T extends string>({isAllSelected, isSomeSelected, selectedIds, onToggleAll, renderDeleteDialog}: SelectorProps<T>) {

  const triggerButton = (
    <button
      type="button"
      className="flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
    >
      <Trash2 className="h-4 w-4 transition-transform active:scale-90" />
    </button>
  );

  return (
    <div className="h-8 inline-flex items-center gap-2 px-3 text-xs bg-background border border-border/50 rounded-md select-none focus-within:ring-1">
      <Checkbox
        className="cursor-pointer"
        id="checkbox-delete"
        checked={isAllSelected}
        onCheckedChange={(checked) => onToggleAll(!!checked)}
      />

      {isSomeSelected ? (
        renderDeleteDialog(selectedIds, triggerButton)
      ) : (
        <label htmlFor="checkbox-delete" className="font-medium text-foreground cursor-pointer">
          Select
        </label>
      )}
    </div>
  );
}