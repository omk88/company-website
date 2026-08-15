"use client";

import { MoreFromAuthor } from "./MoreFromAuthor";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from "../ui/sidebar";

interface RightSidebarArticlesProps {
  username: string;
  displayName: string | undefined;
}

export function RightSidebarArticles({ username, displayName }: RightSidebarArticlesProps) {

  return (
    <Sidebar bgClass="bg-white" side="right" className="!w-75 !top-16 !z-40 h-[calc(100vh-4rem)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <MoreFromAuthor username={username} displayName={displayName} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}