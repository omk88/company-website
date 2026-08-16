import { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/web/LeftSidebar";
import { RightSidebar } from "@/components/web/RightSidebar";
import { PageBlogPosts } from "@/components/web/PageBlogPosts";

export const metadata: Metadata = {
  title: "Insights",
};

export default function InsightsPage() {
  return (
    <SidebarProvider>
      <aside 
        className="shrink-0"
        style={{ "--sidebar-width": "12.8rem" } as React.CSSProperties}
      >
        <LeftSidebar />
      </aside>

      <div className="w-full min-w-0 flex flex-col flex-1 min-h-[calc(100vh-4rem)] pt-16">
        <section 
          id="blog-grid-section" 
          className="w-full flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-zinc-950"
        >
          <div className="flex flex-col flex-1 h-full min-h-0">
            <PageBlogPosts />
          </div>
        </section>
      </div>

      <aside 
        className="shrink-0"
        style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
      >
        <RightSidebar />
      </aside>
    </SidebarProvider>
  );
}