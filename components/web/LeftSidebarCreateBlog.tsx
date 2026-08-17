
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "../ui/sidebar";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

export function LeftSidebarCreateBlog() {
  return (
    <aside 
      className="shrink-0"
      style={{ "--sidebar-width": "3.5rem" } as React.CSSProperties}
    >
      <Sidebar bgClass="bg-white dark:bg-zinc-950" showBorder={false} className="!top-16 !z-40">
        <SidebarHeader className="flex items-center justify-center p-2">
          <Link
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-11 w-11 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            )}
            href="/insights"
            title="Back to insights"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </SidebarHeader>
        <SidebarFooter />
      </Sidebar>
    </aside>
  );
}