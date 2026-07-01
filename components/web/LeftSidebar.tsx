import { ArrowRightLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTopics } from "./SidebarTopics";

export function LeftSidebar() {
  return (
    <Sidebar className="!top-16 !z-40">
      <SidebarHeader>
        <h1 className="mt-2 flex items-center justify-center gap-2.5 font-bold text-sm md:text-sm text-muted-foreground tracking-tight">
          <ArrowRightLeft className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
          <span>Filter articles</span>
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-2 flex flex-col gap-4">
            <SidebarSearch defaultValue={""} />
            <SidebarSort currentSort={""} />
            <SidebarTopics /> 
        </div>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}