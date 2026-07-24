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
    <label 
      htmlFor="checkbox-delete" 
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-background border border-border/50 rounded-md cursor-pointer select-none focus-within:ring-1 hover:bg-accent/50 transition-colors"
    >
      <Checkbox
        id="checkbox-delete"
        checked={isAllSelected}
        onCheckedChange={(checked) => onToggleAll(!!checked)}
      />

      {isSomeSelected ? (
        <span 
          role="button"
          onClick={(e) => {
          }}
          className="flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-4 w-4 transition-transform active:scale-90" />
        </span>
      ) : (
        <span className="font-medium text-foreground">Select</span>
      )}
    </label>
  );
}