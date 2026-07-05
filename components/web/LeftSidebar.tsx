import { ArrowRightLeft } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTopics } from "./SidebarTopics";
import { Separator } from "../ui/separator";

export function LeftSidebar() {
  return (
    <Sidebar className="!top-16 !z-40">
      <SidebarHeader>
        <h1 className="flex items-start justify-center gap-2 p-2 text-sm font-medium text-foreground">
          <ArrowRightLeft className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
          <span>Filter articles</span>
        </h1>
      </SidebarHeader>
      <Separator/>
      <SidebarContent>
        <SidebarGroup className="!pt-0"/>
          <div className="flex flex-col p-2 gap-2">
            <SidebarSearch />
            <SidebarSort />
            <SidebarTopics />
          </div>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}