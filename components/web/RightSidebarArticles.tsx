import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter 
} from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { MoreFromContainer } from "./MoreFromContainer";
import { Suspense } from "react";
import { TrendingBlogsSkeleton } from "./TrendingBlogsSkeleton";
import { Id } from "@/convex/_generated/dataModel";

interface RightSidebarArticlesProps {
  author: string;
  displayName: string | undefined;
  username: string;
  blogId: Id<"blogs">;
}

export function RightSidebarArticles({ author, displayName, username, blogId }: RightSidebarArticlesProps) {
  return (
    <Sidebar bgClass="bg-white" showBorder={false} side="right" className="!w-75 !top-16 !z-40 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <Separator/>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Suspense fallback={<TrendingBlogsSkeleton />}>
                <MoreFromContainer author={author} displayName={displayName} username={username} blogId={blogId}  />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter/>
    </Sidebar>
  );
}