"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { buttonVariants } from "@/components/ui/button";

export function LeftSidebarUploadVideo() {

  const backHref = "/insights";

  return (
    <aside className="w-full md:w-[3.5rem] h-14 md:h-full shrink-0 relative z-40">
      <Sidebar 
        bgClass="bg-white dark:bg-zinc-950" 
        showBorder={true} 
        className="!top-0 md:!top-16 !z-40 !w-full md:!w-[3.5rem] !h-14 md:!h-full"
      >
        <div className="flex flex-col md:flex-row h-full w-full relative">
          <div className="w-full md:w-[3.5rem] h-14 md:h-full shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-start border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-10 px-3 md:px-0">
            
            <SidebarHeader className="flex items-center justify-center p-0 md:p-2">
              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-10 w-10 md:h-11 md:w-11 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                )}
                href={backHref}
                title={"Back to insights"}
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </SidebarHeader>
            <SidebarFooter className="hidden md:flex" />
          </div>
        </div>
      </Sidebar>
    </aside>
  );
}