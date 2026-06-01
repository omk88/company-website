import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoadingUi() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 my-12">
            {[...Array(3)].map((_, i) => (
                <div className="flex flex-col space-y-4" key={i}>
                    <Skeleton className="aspect-video w-full rounded-md" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ))}
        </div>
    );
}