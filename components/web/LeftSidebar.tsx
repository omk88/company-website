import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTags } from "./SidebarTags";
import { SidebarNav } from "./SidebarNav";

export async function LeftSidebar() {
  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-3 !px-2 w-full">
          
          <SidebarNav />

          <div className="flex flex-col py-2 gap-2.5 items-start w-full">
            <div className="w-full px-1 py-1">
              <Separator />
            </div>
            <SidebarSearch placeholder="insights" fullWidth={true} showDropdown={true} />
            <SidebarSort fullWidth={true} />
            <SidebarTags fullWidth={true} />
          </div>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}