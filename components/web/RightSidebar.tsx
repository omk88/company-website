import { connection } from "next/server";
import { Suspense } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarFooter, 
} from "../ui/sidebar";
import { FeaturedBlogs } from "./FeaturedBlogs";
import { TrendingBlogs } from "./TrendingBlogs";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { FeaturedBlogsSkeleton } from "./LoadingSkeletons/FeaturedBlogsSkeleton";
import { TrendingBlogsSkeleton } from "./LoadingSkeletons/TrendingBlogsSkeleton";

async function FeaturedSection() {
  await connection();
  const preloadedFeatured = await preloadQuery(api.blogs.getFeaturedPosts);
  return <FeaturedBlogs preloadedData={preloadedFeatured} />
}

async function TrendingSection() {
  await connection();
  const preloadedTrending = await preloadQuery(api.blogs.getTrendingPosts);
  return <TrendingBlogs preloadedData={preloadedTrending} />
}

export function RightSidebar() {
  
  return (
    <Sidebar 
      bgClass="bg-white" 
      showBorder={true}
      side="right" 
      className="!top-16 !z-40 flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="scrollbar-none !p-3 space-y-4">
        <SidebarGroup className="!p-0"> 
          <SidebarGroupContent>
            <Suspense fallback={<FeaturedBlogsSkeleton />}>
              <FeaturedSection />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="!p-0">
          <SidebarGroupContent>
            <Suspense fallback={<TrendingBlogsSkeleton count={3}/>}>
              <TrendingSection />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}