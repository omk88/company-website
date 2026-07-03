import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoadingUi() {
    return (
        <div className="grid grid-cols-1 gap-y-3 mt-6 mb-0 w-full">
            {[...Array(3)].map((_, i) => (
                <div 
                    key={i} 
                    className="flex flex-col md:flex-row gap-0 w-full border border-border/50 rounded-none bg-card/70 backdrop-blur-md overflow-hidden"
                >
                    <div className="w-full md:w-2/5 min-h-[220px] bg-muted border-b md:border-b-0 md:border-r border-border/50 shrink-0">
                        <Skeleton className="w-full h-full rounded-none" />
                    </div>

                    <div className="flex flex-col flex-1 justify-between p-6">
                        <div>
                            <Skeleton className="h-3 w-1/3 mb-4 visual-pulse" />

                            <div className="space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                                
                                <div className="space-y-2 pt-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-11/12" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/30">
                            <div className="flex gap-4 items-center">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}