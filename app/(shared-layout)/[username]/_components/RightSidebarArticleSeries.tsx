"use client";

import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";


interface RightSidebarArticleSeriesProps {

}

export function RightSidebarArticleSeries({ }: RightSidebarArticleSeriesProps) {

  return (
    <Sidebar
      side="right" 
      bgClass="bg-background/95" 
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0 h-full">

      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}