import { FileSearch } from "lucide-react";

interface BlogEmptyStateProps {
  title?: string;
  description?: string;
}

export function BlogEmptyState({
  title = "No insights found",
  description = "We couldn't find any articles matching your search or filters. Try adjusting your search term or clearing filters.",
}: BlogEmptyStateProps) {
  return (
    <div className="flex flex-1 h-full w-full flex-col items-center justify-center rounded-none p-8 text-center">      
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
    </div>
  );
}