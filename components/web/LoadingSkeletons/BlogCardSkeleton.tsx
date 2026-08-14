import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
    return (
        <div className="group flex flex-col md:flex-row h-auto h-[190px] border-border/50 rounded-none bg-background">
            <div className="aspect-video md:aspect-auto w-full md:w-2/5 md:h-full border-b md:border-b-0 md:border-r border-border/50 shrink-0">
                <Skeleton className="h-full w-full rounded-none" />
            </div>

            <div className="flex flex-col flex-1 justify-between px-4 py-3 min-w-0">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-16" />
                    </div>

                    <div className="space-y-2 pt-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                    </div>
                </div>

                <div className="flex gap-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        </div>
    );
}