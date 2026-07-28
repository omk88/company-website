import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter, SidebarGroupLabel } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { AddBlogButton } from "./AddBlogButton";
import { SidebarTags } from "./SidebarTags";

export function LeftSidebar() {
  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 bg-white border-r"
      style={{ height: "calc(100vh - 4rem)" }}
      collapsible="icon"
    >
      <SidebarContent className="!p-0">
        <SidebarGroup className="pt-2 !pl-0 !pl-2 !pr-0">
          <div className="flex flex-col gap-3">
            <SidebarSearch placeholder="insights"/>
            <SidebarSort />
            <SidebarTags />
          </div>
          <AddBlogButton />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}