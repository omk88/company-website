import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CompactBlogCardSkeleton } from "@/components/web/LoadingSkeletons/CompactBlogCardSkeleton";

export default function SeriesLoading() {
  return (
    <div className="min-h-screen w-full">
      <SidebarProvider className="w-full min-h-screen">
        <aside 
          className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
          style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
        >
          <Sidebar className="flex flex-col !top-16 !z-40 border-r" bgClass="bg-background/95" collapsible="icon">
            <SidebarContent className="!p-0 w-full">
              <SidebarGroup className="pt-3 !px-2 w-full">
                <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
                  <Skeleton className="w-full h-64 rounded-lg" />
                  <div className="flex flex-row gap-2 items-center">
                    <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-4 w-12 rounded ml-auto" />
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <Skeleton className="h-6 w-4/5 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                  </div>
                </div>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </aside>

        <div className="w-full md:flex-1 md:flex md:flex-row md:min-w-0 md:pt-16">
          <div className="w-full p-2">
            <ul className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <li key={i}>
                  <CompactBlogCardSkeleton showPartHeader={true} />
                </li>
              ))}
            </ul>
          </div>

          <aside 
            style={{ "--sidebar-width": "20rem" } as React.CSSProperties} 
            className="hidden md:block w-[20rem] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <Sidebar side="right" bgClass="bg-background/95" className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 border-l border-zinc-200 dark:border-zinc-800" style={{ height: "calc(100vh - 4rem)" }}>
              <SidebarContent className="!p-0 h-full">
                <ScrollArea className="h-full w-full">
                  <SidebarGroup className="pt-4 !px-3 w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1 pb-3 border-b border-zinc-200/60 dark:border-zinc-800">
                      <Skeleton className="w-16 h-3 rounded" />
                      <Skeleton className="w-3/4 h-4 rounded-md mt-1" />
                    </div>
                  </SidebarGroup>
                </ScrollArea>
              </SidebarContent>
            </Sidebar>
          </aside>
        </div>
      </SidebarProvider>
    </div>
  );
}