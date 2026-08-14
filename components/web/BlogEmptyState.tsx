import { FileSearch, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogEmptyStateProps {
  title?: string;
  description?: string;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

export function BlogEmptyState({
  title = "No insights found",
  description = "We couldn't find any articles matching your search or filters. Try adjusting your search term or clearing filters.",
  hasActiveFilters = false,
  onResetFilters,
}: BlogEmptyStateProps) {
  return (
    <div className="flex flex-1 h-full w-full flex-col items-center justify-center rounded-none border border-dashed border-border/80 bg-muted/10 p-8 text-center animate-in fade-in-50">      
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border">
        <FileSearch className="h-6 w-6 text-muted-foreground stroke-[1.8]" />
      </div>

      <div className="mt-4 max-w-sm space-y-1.5">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {hasActiveFilters && onResetFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="mt-5 gap-2 font-mono text-xs uppercase tracking-wider"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}