import { ArrowRightLeft } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter, SidebarGroupLabel } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTopics } from "./SidebarTopics";
import { AddBlogButton } from "./AddBlogButton";

export function LeftSidebar() {
  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0">
        <SidebarGroup className="!pt-0 !pl-0 !pl-2 !pr-0">
          <SidebarGroupLabel className="w-full justify-center">
            <h1 className="flex items-start justify-center gap-2 text-sm font-medium text-foreground">
              <ArrowRightLeft className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
              <span>Filter articles</span>
            </h1>
          </SidebarGroupLabel>
          
          <div className="flex flex-col bg-muted rounded-sm p-3 gap-3">
            <SidebarSearch />
            <SidebarSort />
            <SidebarTopics />
          </div>
          <AddBlogButton />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}