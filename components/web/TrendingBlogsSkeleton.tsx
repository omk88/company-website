import { Skeleton } from "@/components/ui/skeleton";

export function TrendingBlogsSkeleton() {
    return (
        <div className="w-full flex flex-col pointer-events-none select-none">
            <div className="list-none w-full m-0 p-0 space-y-0.5">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full block p-2 rounded">
                        <div className="w-full flex flex-col gap-2">
                            <div className="space-y-1.5">
                                <Skeleton className="h-4 w-11/12" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            
                            <div className="flex gap-4 items-center pt-0.5 origin-left scale-90">
                                <Skeleton className="h-3.5 w-10" />
                                <Skeleton className="h-3.5 w-10" />
                                <Skeleton className="h-3.5 w-10" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}