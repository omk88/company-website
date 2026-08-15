import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { LeftSidebarControlsSkeleton } from "@/components/web/LoadingSkeletons/LeftSidebarControlsSkeleton";
import { BlogContentSkeleton } from "@/components/web/LoadingSkeletons/BlogContentSkeleton";

export default function BlogLoading() {
  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative block">
      
      <LeftSidebarControlsSkeleton />

      <div className="w-full pl-40 pr-75 pt-16 min-h-[calc(100vh-4rem)]">
        <BlogContentSkeleton />
      </div>

      <Sidebar bgClass="bg-white" side="right" className="!w-75 !top-16 !z-40 h-[calc(100vh-4rem)]">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="w-full flex flex-col p-2">
                <div className="flex justify-center p-4">
                  <Skeleton className="h-5 w-40" />
                </div>

                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-muted/60 flex flex-row items-center justify-between gap-3">
                      <div className="w-full flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-3 w-8" />
                          <Skeleton className="h-3 w-8" />
                          <Skeleton className="h-3 w-8" />
                        </div>
                      </div>
                      <Skeleton className="w-12 h-12 shrink-0 rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

    </SidebarProvider>
  );
}