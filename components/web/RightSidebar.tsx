import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarFooter, 
} from "../ui/sidebar";
import { FeaturedBlogs } from "./FeaturedBlogs";
import { TrendingBlogs } from "./TrendingBlogs";

export function RightSidebar() {
  return (
    <Sidebar 
      bgClass="bg-white" 
      showBorder={true}
      side="right" 
      className="!top-16 !z-40 flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="scrollbar-none !p-3 space-y-4">
        <SidebarGroup className="!p-0"> 
          <SidebarGroupContent>
            <FeaturedBlogs />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="!p-0">
          <SidebarGroupContent>
            <TrendingBlogs />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}