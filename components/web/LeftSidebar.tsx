import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTags } from "./SidebarTags";
import { SidebarNav } from "./SidebarNav";

export async function LeftSidebar() {
  return (
    <>
      <nav className="flex md:hidden flex-col w-full border-b bg-background/95 p-3 gap-2.5 sticky top-16 z-30">
        <SidebarNav isHorizontal={true} />
        
        <div className="flex items-center gap-2 w-full pt-1">
          <div className="flex-1">
            <SidebarSearch placeholder="insights" fullWidth={true} showDropdown={true} />
          </div>
          <SidebarSort fullWidth={false} />
          <SidebarTags fullWidth={false} />
        </div>
      </nav>

      <Sidebar 
        className="hidden md:flex flex-col !top-16 !z-40 border-r"
        bgClass="bg-background/95" 
        collapsible="icon"
      >
        <SidebarContent className="!p-0 w-full">
          <SidebarGroup className="pt-3 !px-2 w-full">
            <SidebarNav isHorizontal={false} />

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
    </>
  );
}