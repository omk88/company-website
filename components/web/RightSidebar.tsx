import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter, 
  SidebarProvider
} from "../ui/sidebar";
import { FeaturedBlogs } from "./FeaturedBlogs";
import { TrendingBlogs } from "./TrendingBlogs";

export function RightSidebar() {
  return (
    <Sidebar 
      bgClass="bg-white" 
      showBorder={true}
      side="right" 
      className="!top-16 !z-40 flex flex-col !p-0 overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        <SidebarGroup> 
          <SidebarGroupContent>
            <FeaturedBlogs />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <TrendingBlogs />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}