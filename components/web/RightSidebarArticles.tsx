import { MessageCircleWarning, TrendingUp } from "lucide-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter 
} from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { TrendingBlogs } from "./TrendingBlogsContainer";
import { Suspense } from "react";
import { TrendingBlogsSkeleton } from "./TrendingBlogsSkeleton";

export function RightSidebarArticles() {
  return (
    <Sidebar side="right" className="!w-75 !top-16 !z-40 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <SidebarHeader className="shrink-0">
        <h1 className="mt-2 flex items-center justify-center gap-2.5 font-bold text-sm md:text-sm text-muted-foreground tracking-tight">
          <MessageCircleWarning className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
          <span>More from Emmanuel Learmount</span>
        </h1>
      </SidebarHeader>
      <Separator/>
    
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
      
      <SidebarFooter/>
    </Sidebar>
  );
}