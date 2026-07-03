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
        <h1 className="mt-2 flex items-center justify-center gap-2.5 font-bold text-sm md:text-sm text-muted-foreground tracking-tight">
          <MessageCircleWarning className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
          <span>Noteworthy</span>
        </h1>
      </SidebarHeader>
      <Separator/>
    
      <SidebarContent className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pb-6">
        <SidebarGroup>
          <SidebarGroupLabel className="w-full justify-center">
            <h1 className="mt-2 flex items-center justify-center gap-2.5 font-bold text-sm text-muted-foreground tracking-tight">
              <Sparkles className="w-4 h-4 stroke-[2.3] shrink-0" />
              <span>Featured</span>
            </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<FeaturedBlogsSkeleton />}>
              <FeaturedBlogs />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="w-full justify-center">
            <h1 className="mt-2 flex items-center justify-center gap-2.5 font-bold text-sm text-muted-foreground tracking-tight">
              <TrendingUp className="w-4 h-4 stroke-[2.3] shrink-0" />
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