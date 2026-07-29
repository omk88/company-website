"use client";

import { useState } from "react";
import { Home, TrendingUp, Users2, Globe, Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "../ui/sidebar";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarSort } from "./SidebarSort";
import { SidebarTags } from "./SidebarTags";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "popular", label: "Popular", icon: TrendingUp },
  { id: "team", label: "Team", icon: Users2 },
  { id: "community", label: "Community", icon: Globe },
];

export function LeftSidebar() {
  const [activeId, setActiveId] = useState("home");

  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 bg-white border-r w-fit !w-auto"
      style={{ 
        height: "calc(100vh - 4rem)",
        "--sidebar-width": "fit-content" 
      } as React.CSSProperties}
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-2 !pl-2 !pr-2 w-full">
          
          <SidebarMenu className="w-full flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;

              return (
                <SidebarMenuItem key={item.id} className="w-full">
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => setActiveId(item.id)}
                    className={`
                      w-full cursor-pointer justify-start px-3 py-2 rounded-xl text-sm font-medium transition-colors
                      data-[active=true]:bg-slate-200/70 data-[active=true]:text-foreground data-[active=true]:font-semibold
                      hover:bg-slate-100
                    `}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <div className="flex flex-col py-4 gap-3 items-start w-full">
            <div className="w-full px-2 py-1">
              <Separator />
            </div>
            <SidebarSearch placeholder="insights" />
            <SidebarSort />
            <SidebarTags />

            <div className="w-full pt-2">
              <SidebarMenuButton
                onClick={() => {
                  console.log("Create Post clicked");
                }}
                className={`
                  w-full justify-start px-3 py-2 rounded-xl text-sm font-medium transition-colors
                  bg-black text-white hover:bg-slate-800 active:bg-slate-900 cursor-pointer
                `}
              >
                <Plus className="h-4 w-4 shrink-0 stroke-[2.5]" />
                <span>Create a Post</span>
              </SidebarMenuButton>
            </div>
          </div>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}