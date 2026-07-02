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
import { FeaturedBlogs } from "./FeaturedBlogs";
import { Separator } from "../ui/separator";
import { TrendingBlogs } from "./TrendingBlogs";

export function RightSidebar() {
  return (
    /* 1. Added !h-fit so the sidebar doesn't hardlock to the full screen viewport height */
    <Sidebar side="right" className="!top-16 !z-40 !h-fit">
      <SidebarHeader>
        <h1 className="mt-2 flex items-center justify-center gap-2.5 font-bold text-sm md:text-sm text-muted-foreground tracking-tight">
          <MessageCircleWarning className="w-4 h-4 md:w-4 md:h-4 stroke-[2.3] shrink-0" />
          <span>Noteworthy</span>
        </h1>
      </SidebarHeader>
      <Separator />
      
      {/* 2. Added overflow-y-auto and custom scrollbar masking here */}
      <SidebarContent className="overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin">
        <SidebarGroup>
          <SidebarGroupLabel className="w-full justify-center">
            <h1 className="mt-2 flex items-center justify-center gap-2.5 font-bold text-sm text-muted-foreground tracking-tight">
              <Sparkles className="w-4 h-4 stroke-[2.3] shrink-0" />
              <span>Featured</span>
            </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <FeaturedBlogs />
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
            <TrendingBlogs />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter />
    </Sidebar>
  );
}