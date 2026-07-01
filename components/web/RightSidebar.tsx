import { Sparkles, TrendingUp } from "lucide-react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter 
} from "../ui/sidebar";

export function RightSidebar() {
  return (
    <Sidebar side="right" className="!top-16 !z-40">
      <SidebarHeader />
      <SidebarContent>
        
        <SidebarGroup>
          <SidebarGroupLabel className="w-full justify-center">
            <h1 className="mt-2 flex items-center justify-center gap-2.5 font-bold text-sm text-muted-foreground tracking-tight">
              <Sparkles className="w-4 h-4 stroke-[2.3] shrink-0" />
              <span>Featured</span>
            </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}