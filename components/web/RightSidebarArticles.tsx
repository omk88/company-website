"use client";

import { MoreFromAuthor } from "./MoreFromAuthor";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from "../ui/sidebar";

interface RightSidebarArticlesProps {
  username: string;
  displayName: string | undefined;
  blogs: any[];
}

export function RightSidebarArticles({ username, displayName, blogs }: RightSidebarArticlesProps) {
  return (
    <aside 
      className="shrink-0"
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
    >
      <Sidebar bgClass="bg-white dark:bg-zinc-950" side="right" className="!top-16 !z-40">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <MoreFromAuthor username={username} displayName={displayName} blogs={blogs} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </aside>
  );
}