import { AddBlogButton } from "@/components/web/AddBlogButton";
import { CachedBlogGrid } from "@/components/web/CachedBlogGrid";
import { SkeletonLoadingUi } from "@/components/web/SkeletonLoadingUI";
import { Suspense } from "react";
import { Metadata } from "next";
import GridCube from "@/components/3d/GridCube";
import { Eye } from "lucide-react";
import NewsletterSubscriptionForm from "@/components/web/NewsletterSubscriptionForm";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/web/LeftSidebar";
import { RightSidebar } from "@/components/web/RightSidebar";
import { SearchProvider } from "@/components/web/SearchContext";

export const metadata: Metadata = {
  title: "Insights",
};

const INSIGHTS_MODELS = ['/cross.glb'];

export default async function InsightsPage() {

  return (
    <SidebarProvider>
      <SearchProvider>
        <aside className="sticky top-16 h-[calc(100vh-4rem)] z-30">
          <LeftSidebar />
        </aside>

        <div className="w-full space-y-8 flex flex-col">
          
          <section className="w-full max-w-3xl mx-auto pt-4 pb-4 flex flex-col items-center justify-start">
            <div className="flex flex-col items-center w-full justify-start gap-4 md:gap-6">
              <AddBlogButton />

              <div className="w-full flex flex-col items-center gap-4 -mt-2 md:-mt-4">
                <div className="text-center space-y-1.5 max-w-xl shrink-0">
                  <h1 className="flex items-center justify-center gap-2.5 font-bold text-xl md:text-2xl text-foreground tracking-tight">
                    <Eye className="w-5 h-5 md:w-6 md:h-6 stroke-[2.3] shrink-0" />
                    <span>Insights.</span>
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-normal">
                    Subscribe to our newsletter to learn more about our latest insights, news and product launches.
                  </p>
                </div>
                

              </div>
            </div>
          </section>

          <section 
            id="blog-grid-section" 
            className="w-full max-w-4xl mx-auto px-4 bg-white dark:bg-zinc-950 border-x border-t border-border/40"
          >
          </section>

        </div>

        <aside className="sticky top-16 h-[calc(100vh-4rem)] z-30">
          <RightSidebar />
        </aside>
      </SearchProvider>
    </SidebarProvider>
  );
}