import { Library } from "lucide-react";
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

interface RightSidebarArticlesProps {
  authorName: string;
}

export function RightSidebarArticles({ authorName }: RightSidebarArticlesProps) {
  return (
    <Sidebar side="right" className="!w-75 !top-16 !z-40 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      <Separator/>
    
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="w-full justify-center">
          <h1 className="flex justify-center gap-2 p-4 text-sm font-medium text-foreground whitespace-nowrap">              <Library className="size-4 stroke-[2.3] shrink-0 mt-0.5" />
              <span>More from { authorName }</span>
          </h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<TrendingBlogsSkeleton />}>
                <MoreFromContainer authorName={authorName}  />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter/>
    </Sidebar>
  );
}