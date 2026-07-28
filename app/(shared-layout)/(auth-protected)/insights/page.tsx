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

        <div className="w-full flex flex-col">
          
          <section className="w-full pt-4 pb-4">
            <div className="w-full md:px-[var(--sidebar-width)]">
              <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-start gap-4 md:gap-6">
                <div className="w-full h-30 max-w-md lg:max-w-[460px] flex items-center justify-center relative overflow-hidden shrink-0 transform-gpu">
                  <GridCube 
                    models={INSIGHTS_MODELS} 
                    storageKey="insights_cross_path" 
                    glitchEnabled={false} 
                  />
                </div>

                <div className="w-full flex flex-col items-center gap-4 -mt-2 md:-mt-4">
                  <div className="text-center space-y-1.5 max-w-md shrink-0">
                    <h1 className="flex items-center justify-center gap-2.5 font-bold text-xl md:text-2xl text-foreground tracking-tight">
                      <Eye className="w-5 h-5 md:w-6 md:h-6 stroke-[2.3] shrink-0" />
                      <span>Insights.</span>
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground max-w-sm mx-auto leading-normal">
                      Subscribe to our newsletter to learn more about our latest insights, news and product launches.
                    </p>
                  </div>
                  
                  <div className="w-full max-w-md shrink-0 mx-auto">
                    <NewsletterSubscriptionForm />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section 
            id="blog-grid-section" 
            className="w-full bg-white dark:bg-zinc-950 border-t border-border/50">
            <div className="w-full md:px-[var(--sidebar-width)] mt-4">
              <div className="w-full max-w-5xl mx-auto px-4 pb-4">
                
              </div>
            </div>
          </section>

        </div>

        <aside className="sticky top-16 h-[calc(100vh-4rem)] z-30">
          <RightSidebar />
        </aside>
      </SearchProvider>
    </SidebarProvider>
  );
}