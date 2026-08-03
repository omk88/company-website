"use client";

import { Home, TrendingUp, Users2, Globe, Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider
} from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTags } from "./SidebarTags";
import Link from "next/link";
import { useLocalSearch } from "./SearchContext";
import { PostType } from "./SearchContext";

const NAV_ITEMS = [
  { id: "team" as PostType, label: "Team", icon: Users2 },
  { id: "community" as PostType, label: "Community", icon: Globe },
];

export function LeftSidebar() {
  const { postType, setPostType } = useLocalSearch();

  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 bg-white border-r"
      bgClass="bg-white" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-4 !pl-2 !pr-2 w-full">
          
          <SidebarMenu className="w-full flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = postType === item.id;

              return (
                <SidebarMenuItem key={item.id} className="w-full">
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => setPostType(item.id)}
                    className={`
                      w-full cursor-pointer justify-start px-3 py-2 rounded-xl text-sm font-medium transition-colors
                      data-[active=true]:hover:bg-zinc-200/50 data-[active=true]:text-foreground data-[active=true]:font-semibold
                      hover:bg-muted
                    `}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <div className="flex flex-col py-2 gap-3 items-start w-full">
            <div className="w-full px-2 py-1">
              <Separator />
            </div>
            <SidebarSearch placeholder="insights" fullWidth={true} />
            <SidebarSort fullWidth={true} />
            <SidebarTags fullWidth={true} />

            <div className="w-full">
              <Link
                href={`/company/blog`}
              >
                <SidebarMenuButton
                  className={`
                    group w-full justify-center !h-auto !rounded-md text-xs font-semibold
                    !bg-foreground hover:!bg-foreground/90 !text-background
                    transition-all duration-100 active:scale-[0.99] cursor-pointer
                    inline-flex items-center gap-2
                  `}
                >
                  <Plus className="w-3 h-3 shrink-0 stroke-[2.3]" />
                  <span>Create a Post</span>
                </SidebarMenuButton>
              </Link>
            </div>
          </div>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}