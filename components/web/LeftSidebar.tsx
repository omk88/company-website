import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTopics } from "./SidebarTopics";

export function LeftSidebar() {
  return (
    <Sidebar className="!top-16 !z-40">
      <SidebarHeader />
      <SidebarContent>
        <div className="p-4 flex flex-col gap-4">
            <SidebarSearch defaultValue={""} />
            <SidebarSort currentSort={""} />
            <SidebarTopics currentTags={""} />
        </div>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}