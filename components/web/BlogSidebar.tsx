import { BookOpen } from "lucide-react";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTopics } from "./SidebarTopics";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface BlogSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentParams: {
    search?: string;
    sort?: string;
    tags?: string;
  };
}

export function BlogSidebar({ currentParams, ...props }: BlogSidebarProps) {
  return (
    <Sidebar variant="sidebar" collapsible="none" className="border-r border-border bg-card/50" {...props}>
      <SidebarHeader className="p-6 pb-4 border-b border-border/40">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 font-bold text-base text-foreground tracking-tight">
            <BookOpen className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
            <span>All articles</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Filter and sort insights
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-6 space-y-6">
        <SidebarGroup className="p-0 space-y-2">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 p-0 h-auto">
            Search
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarSearch defaultValue={currentParams.search || ""} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0 space-y-2">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 p-0 h-auto">
            Sort By
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarSort currentSort={currentParams.sort || "recent"} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0 space-y-2">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 p-0 h-auto">
            Topics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarTopics currentTags={currentParams.tags || ""} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}