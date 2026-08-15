import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function BlogLoading() {
  return (
    <SidebarProvider className="bg-white dark:bg-zinc-950 w-full min-h-screen relative block">
      
      <Sidebar bgClass="bg-white" showBorder={false} className="!w-40 !top-16 !z-40">
        <SidebarHeader className="p-2">
          <Skeleton className="h-9 w-full rounded-md" />
        </SidebarHeader>

        <div className="w-1/2 mx-auto my-2">
          <Separator />
        </div>

        <SidebarContent>
          <div className="flex flex-col items-center gap-2 p-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <SidebarGroup />
        </SidebarContent>
      </Sidebar>

      <div className="w-full pl-40 pr-75 pt-16 min-h-[calc(100vh-4rem)]">
        <main className="w-full max-w-4xl mx-auto py-3 px-3">
          
          <Skeleton className="w-full h-[400px] mb-3 rounded-lg" />

          <div className="px-1 sm:px-6 md:px-2">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-3/4" />

              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 min-h-[20px]">
                <Skeleton className="h-7 w-14 rounded-full" />
                <Skeleton className="h-7 w-14 rounded-full" />
                <Skeleton className="h-7 w-14 rounded-full" />
              </div>

              <Skeleton className="h-6 w-2/3" />
            </div>

            <Separator className="my-8" />

            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[96%]" />
              <Skeleton className="h-5 w-[98%]" />
              <Skeleton className="h-5 w-[90%]" />
              <Skeleton className="h-5 w-[94%]" />
              <Skeleton className="h-5 w-[60%]" />
            </div>

            <Separator className="my-10" />
            
            <Skeleton className="h-32 w-full rounded-2xl" />

            <Separator className="my-10" />

            <div className="space-y-4">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>
        </main>
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