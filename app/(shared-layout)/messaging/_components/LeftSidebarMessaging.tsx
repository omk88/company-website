import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from "@/components/ui/sidebar";

export default function LeftSidebarMessaging() {
    return (
      <Sidebar 
        className="hidden md:flex flex-col !top-16 !z-40 border-r"
        bgClass="bg-background/95" 
        collapsible="icon"
      >
        <SidebarContent className="!p-0 w-full overflow-x-hidden">
          <SidebarGroup className="pt-3 !px-2 w-full flex flex-col">

          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="hidden" />
      </Sidebar>
    )
}