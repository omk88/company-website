import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface TrendingandFeaturedSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function TrendingandFeaturedSidebar({ ...props }: TrendingandFeaturedSidebarProps) {
  return (
    <Sidebar 
      side="right"
      variant="sidebar" 
      collapsible="none" 
      className="border-l border-border bg-card/50" 
      {...props}
    >
      <SidebarHeader className="p-6 pb-4 border-b border-border/40">
        <div className="h-[36px]" />
      </SidebarHeader>

      <SidebarContent className="p-6 space-y-6">
      </SidebarContent>

      <SidebarFooter className="p-6 pt-0">
      </SidebarFooter>
    </Sidebar>
  );
}