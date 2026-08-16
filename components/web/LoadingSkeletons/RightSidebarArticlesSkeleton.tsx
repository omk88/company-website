import { Library } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";

interface RightSidebarArticlesSkeletonProps {
  count?: number;
}

export function RightSidebarArticlesSkeleton({ count = 5 }: RightSidebarArticlesSkeletonProps) {
  return (
    <aside 
      className="shrink-0"
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
    >
      <Sidebar bgClass="bg-white dark:bg-zinc-950" side="right" className="!top-16 !z-40">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="w-full flex flex-col pt-2">
                <div className="flex items-center gap-1.5 px-3.5 mb-2.5 text-zinc-800 dark:text-zinc-200 font-semibold text-xs tracking-tight">
                  <Library className="w-3.5 h-3.5 shrink-0 opacity-40" />
                  <div className="flex items-center gap-1">
                    <span className="opacity-40">More from</span>
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                <ul className="list-none w-full m-0 p-0 space-y-2">
                  {Array.from({ length: count }).map((_, index) => (
                    <li key={index} className="w-full block">
                      <div className="block w-full p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50">
                        <div className="w-full flex flex-row items-center justify-between gap-3">
                          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                            <Skeleton className="h-3.5 w-5/6" />

                            <div className="flex items-center gap-3 text-[11px] pt-1">
                              <div className="flex items-center gap-1">
                                <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                                <Skeleton className="h-2.5 w-6" />
                              </div>
                              <div className="flex items-center gap-1">
                                <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                                <Skeleton className="h-2.5 w-6" />
                              </div>
                              <div className="flex items-center gap-1">
                                <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                                <Skeleton className="h-2.5 w-6" />
                              </div>
                            </div>
                          </div>

                          <Skeleton className="w-11 h-11 shrink-0 rounded-lg" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}