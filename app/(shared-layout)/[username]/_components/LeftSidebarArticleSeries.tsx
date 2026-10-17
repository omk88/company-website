"use client";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarFooter 
} from "@/components/ui/sidebar";

interface LeftSidebarArticleSeriesProps {
  
}

export function LeftSidebarArticleSeries({  }: LeftSidebarArticleSeriesProps) {

  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-3 !px-2 w-full">
          

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}