import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function BlogContentSkeleton() {
  return (
    <main className="w-full max-w-4xl mx-auto py-3 px-3">
      <Skeleton className="w-full h-[400px] mb-3 rounded-lg" />

      <div className="px-1 sm:px-6 md:px-2">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-4/5" />
            <Skeleton className="h-9 w-2/3" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex items-center gap-1.5 min-h-[20px]">
            <Skeleton className="h-7 w-14 rounded-full" />
            <Skeleton className="h-7 w-12 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>

          <div className="space-y-2 pt-1">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[96%]" />
          <Skeleton className="h-5 w-[92%]" />
          <Skeleton className="h-5 w-[98%]" />
          <div className="py-2">
            <Skeleton className="h-7 w-1/3 mb-2" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[90%]" />
          </div>
          <Skeleton className="h-5 w-[94%]" />
          <Skeleton className="h-5 w-[88%]" />
        </div>

        <Separator className="my-10" />

        <div className="my-6 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">          <div className="space-y-3 lg:col-span-5 flex flex-col items-center lg:items-start">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-2/3 max-w-md" />
            <Skeleton className="h-9 w-36 rounded-md mt-2" />
          </div>

          <div className="hidden lg:block lg:col-span-1 h-24 w-px bg-neutral-200 dark:bg-neutral-800 mx-auto" />

          <div className="space-y-3 lg:col-span-6 w-full max-w-md mx-auto lg:max-w-none flex flex-col items-center lg:items-start">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <div className="w-full flex gap-2 pt-1">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-none mb-6">
          <div className="flex items-center gap-2 p-6 border-b border-neutral-200 dark:border-neutral-800">
            <Skeleton className="size-5 rounded-sm" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>

            <Separator />

            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="size-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex items-center gap-4 pt-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}