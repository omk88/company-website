import { Metadata } from "next";
import GridCube from "@/components/3d/GridCube";
import { Eye } from "lucide-react";
import NewsletterSubscriptionForm from "@/components/web/NewsletterSubscriptionForm";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/web/LeftSidebar";
import { RightSidebar } from "@/components/web/RightSidebar";
import { SearchProvider } from "@/components/web/SearchContext";
import { PageBlogPosts } from "@/components/web/PageBlogPosts";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Insights",
};

const INSIGHTS_MODELS = ['/cross.glb'];

export default async function InsightsPage() {

  const preloadedInitialBlogsPromise = preloadQuery(api.blogs.getPaginatedPostsByType, {
    postType: "community",
    paginationOpts: {
        numItems: 6,    
        cursor: null,   
        id: 0,
    }
  });

  const [preloadedInitialBlogs] = await Promise.all([
    preloadedInitialBlogsPromise
  ]);

  return (
    <SidebarProvider>
      <SearchProvider>
        <aside 
          className="shrink-0"
          style={{ "--sidebar-width": "12.8rem" } as React.CSSProperties}
        >
          <LeftSidebar />
        </aside>

        <div className="w-full flex flex-col min-h-screen">

          <section 
            id="blog-grid-section" 
            className="w-full h-full bg-white dark:bg-zinc-950"
          >
            <div>
              <PageBlogPosts preloadedInitialBlogs={preloadedInitialBlogs} />
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