import { Skeleton } from "@/components/ui/skeleton";

export function IncrementBlogLikesDislikesSkeleton() {
    return (
        <div className="flex flex-col items-center gap-2 p-6 text-muted-foreground text-xs">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
        </div>
    );
}