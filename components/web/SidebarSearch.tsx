"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpdateParams } from "@/hooks/use-update-search-params";

export function SidebarSearch({ defaultValue }: { defaultValue: string }) {
  const { setParam } = useUpdateParams();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParam("search", value.trim() || null);
    }, 250);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground stroke-[1.5]" />
      <Input
        type="text"
        placeholder="Search insights..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 pr-9 h-9 text-xs bg-background border-border/50 rounded-md focus-visible:ring-1 focus-visible:ring-primary w-full"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-sm hover:bg-muted"
        >
          <X className="h-3.5 w-3.5 stroke-[2]" />
        </button>
      )}
    </div>
  );
}