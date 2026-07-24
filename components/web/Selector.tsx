"use client";

import { Checkbox } from "../ui/checkbox";
import { Trash2 } from "lucide-react";

interface SelectorProps {
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onToggleAll: (checked: boolean) => void;
  onDelete?: () => void;
}

export function Selector({isAllSelected, isSomeSelected, onToggleAll, onDelete}: SelectorProps) {

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-background border border-border/50 rounded-md select-none focus-within:ring-1">
      <Checkbox
        id="checkbox-delete"
        checked={isAllSelected}
        onCheckedChange={(checked) => onToggleAll(!!checked)}
      />

      {isSomeSelected ? (
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          title="Delete selected items"
        >
          <Trash2 className="h-4 w-4 transition-transform active:scale-90" />
        </button>
      ) : (
        <label htmlFor="checkbox-delete" className="font-medium text-foreground cursor-pointer">
          Select
        </label>
      )}
    </div>
  );
}