import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function RightSidebarArticlesSkeleton() {
  return (
    <Sidebar bgClass="bg-white" side="right" className="!w-75 !top-16 !z-40 h-[calc(100vh-4rem)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="w-full flex flex-col">
              <SidebarGroupLabel className="w-full justify-center">
                <div className="flex items-center justify-center gap-1.5 p-4 w-full">
                  <Skeleton className="size-4 shrink-0 rounded-sm" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </SidebarGroupLabel>

              <div className="w-full space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-muted/60 w-full flex flex-row items-center justify-between gap-3"
                  >
                    <div className="w-full flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-5/6" />

                      <div className="flex items-center gap-3 pt-0.5">
                        <div className="flex items-center gap-1.5 min-w-[3rem]">
                          <Skeleton className="size-4 rounded-sm shrink-0" />
                          <Skeleton className="h-3 w-6" />
                        </div>
                        <div className="flex items-center gap-1.5 min-w-[3rem]">
                          <Skeleton className="size-4 rounded-sm shrink-0" />
                          <Skeleton className="h-3 w-6" />
                        </div>
                        <div className="flex items-center gap-1.5 min-w-[3rem]">
                          <Skeleton className="size-4 rounded-sm shrink-0" />
                          <Skeleton className="h-3 w-6" />
                        </div>
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
  );
}