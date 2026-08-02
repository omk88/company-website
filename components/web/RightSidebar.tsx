import { Sparkles, TrendingUp } from "lucide-react";
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
import { FeaturedBlogs } from "./FeaturedBlogsContainer";
import { TrendingBlogs } from "./TrendingBlogsContainer";
import { Suspense } from "react";
import { FeaturedBlogsSkeleton } from "./FeaturedBlogsSkeleton";
import { TrendingBlogsSkeleton } from "./TrendingBlogsSkeleton";

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
            <Suspense fallback={<FeaturedBlogsSkeleton />}>
              <FeaturedBlogs />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <Suspense fallback={<TrendingBlogsSkeleton />}>
                <TrendingBlogs />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}