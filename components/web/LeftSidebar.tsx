import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";

export function LeftSidebar() {
  return (
    <Sidebar className="!top-16 !z-40">
      <SidebarHeader />
      <SidebarContent>
        <SidebarSearch defaultValue={""} />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}