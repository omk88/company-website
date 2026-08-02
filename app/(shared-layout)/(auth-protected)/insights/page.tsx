import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/web/LeftSidebar";
import { RightSidebar } from "@/components/web/RightSidebar";
import { SearchProvider } from "@/components/web/SearchContext";
import { PageBlogPostsContainer } from "@/components/web/PageBlogPostsContainer";

export const metadata: Metadata = {
  title: "Insights",
};

const INSIGHTS_MODELS = ['/cross.glb'];

export default async function InsightsPage() {

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
              <PageBlogPostsContainer />
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