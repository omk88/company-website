import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarGroup, SidebarFooter } from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTags } from "./SidebarTags";
import { SidebarNav } from "./SidebarNav";

export async function LeftSidebar() {
  return (
    <>
      <nav className="flex md:hidden flex-col w-full border-b bg-background/95 backdrop-blur-md py-1.5 gap-1 fixed top-10 left-0 z-30">
        <SidebarNav isHorizontal={true} />
        
        <div className="flex items-center gap-1 w-full px-2">
          <div className="flex-1 min-w-0">
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
        <SidebarContent className="!p-0 w-full overflow-x-hidden">
          <SidebarGroup className="pt-3 !px-2 w-full flex flex-col">
            <SidebarNav isHorizontal={false} />

            <div className="flex flex-col py-2 gap-2.5 items-stretch w-full min-w-0">
              <div className="w-full px-1 py-1">
                <Separator />
              </div>

              <div className="w-full min-w-0">
                <SidebarSearch placeholder="insights" fullWidth={true} showDropdown={true} />
              </div>
              <div className="w-full min-w-0">
                <SidebarSort fullWidth={true} />
              </div>
              <div className="w-full min-w-0">
                <SidebarTags fullWidth={true} />
              </div>
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="hidden" />
      </Sidebar>
    </>
  );
}