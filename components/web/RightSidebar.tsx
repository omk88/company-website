import { MessageCircleWarning, Sparkles, TrendingUp } from "lucide-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter 
} from "../ui/sidebar";
import { FeaturedBlogs } from "./FeaturedBlogsContainer";
import { Separator } from "../ui/separator";
import { TrendingBlogs } from "./TrendingBlogsContainer";
import { Suspense } from "react";
import { FeaturedBlogsSkeleton } from "./FeaturedBlogsSkeleton";
import { TrendingBlogsSkeleton } from "./TrendingBlogsSkeleton";

export function RightSidebar() {
  return (
    <Sidebar side="right" className="!top-16 !z-40 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <SidebarHeader className="shrink-0">
        <h1 className="flex items-start justify-center gap-2 p-2 text-sm font-medium text-foreground">
          <MessageCircleWarning className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
          <span>Noteworthy</span>
        </h1>
      </SidebarHeader>
      <Separator/>
    
      <SidebarContent className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        <SidebarGroup className="!pt-0"> 
          <SidebarGroupLabel className="w-full justify-center">
            <h1 className="flex items-start justify-center gap-2 text-sm font-medium text-foreground">
              <Sparkles className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
              <span>Featured</span>
            </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<FeaturedBlogsSkeleton />}>
              <FeaturedBlogs />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupLabel className="w-full justify-center">
            <h1 className="flex items-start justify-center gap-2 text-sm font-medium text-foreground">
              <TrendingUp className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
              <span>Trending</span>
            </h1>
          </SidebarGroupLabel>
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