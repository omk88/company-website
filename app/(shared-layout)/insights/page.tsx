import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/web/LeftSidebar";
import { RightSidebar } from "@/components/web/RightSidebar";
import { SearchProvider } from "@/components/web/SearchContext";
import { PageBlogPosts } from "@/components/web/PageBlogPosts";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export const metadata: Metadata = {
  title: "Insights",
};

interface PageProps {
  searchParams: Promise<{
    feed?: string;
    q?: string;
    sort?: string;
    tags?: string;  
  }>;
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const feedType = params.feed || "all";
  const dbPostType = feedType === "team" || feedType === "community" ? feedType : undefined;
  const isPopularOnly = feedType === "popular" ? true : undefined;
  const searchTerm = params.q?.trim() || undefined;
  const activeTags = params.tags ? params.tags.split(",") : undefined;
  const sortOrder = params.sort || "new";

  const preloadedInitialFeed = await preloadQuery(
    api.blogs.getPaginatedPostsByType,
    {
      postType: dbPostType as "team" | "community" | undefined,
      isPopularOnly,
      searchTerm,
      activeTags,
      sortOrder,
      paginationOpts: {
        numItems: 6,
        cursor: null,
      }
    },
  );
  
  return (
    <SidebarProvider>
      <SearchProvider>
        <aside 
          className="shrink-0"
          style={{ "--sidebar-width": "12.8rem" } as React.CSSProperties}
        >
          <LeftSidebar />
        </aside>

        <div className="w-full min-w-0 flex flex-col min-h-[calc(100vh-4rem)] pt-16">

          <section 
            id="blog-grid-section" 
            className="w-full h-full bg-white dark:bg-zinc-950"
          >
            <div>
              <PageBlogPosts preloadedInitialFeed={preloadedInitialFeed} />
            </div>
          </section>
        </div>

        <aside 
          className="shrink-0"
          style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
        >
          <RightSidebar />
        </aside>
      </SearchProvider>
    </SidebarProvider>
  );
}