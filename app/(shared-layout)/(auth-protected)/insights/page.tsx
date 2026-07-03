import { AddBlogButton } from "@/components/web/AddBlogButton";
import { CachedBlogGrid } from "@/components/web/CachedBlogGrid";
import { SkeletonLoadingUi } from "@/components/web/SkeletonLoadingUI";
import { Suspense } from "react";
import { Metadata } from "next";
import GridCube from "@/components/3d/GridCube";
import { Eye } from "lucide-react";
import NewsletterSubscriptionForm from "@/components/web/NewsletterSubscriptionForm";

export const metadata: Metadata = {
  title: "Insights",
};

const INSIGHTS_MODELS = ['/cross.glb'];

interface PageProps {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    tags?: string;
    page?: string;
  }>;
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="w-full space-y-8">
      
      <section className="w-full max-w-3xl mx-auto pt-4 pb-4 flex flex-col items-center justify-start">
        <div className="flex flex-col items-center w-full justify-start gap-4 md:gap-6">
          <AddBlogButton />
          
          <div className="w-full h-30 max-w-md lg:max-w-[460px] flex items-center justify-center relative overflow-hidden shrink-0 transform-gpu">
            <GridCube 
              models={INSIGHTS_MODELS} 
              storageKey="insights_cross_path" 
              glitchEnabled={false} 
            />
          </div>

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
            
            <div className="w-full max-w-md shrink-0 mx-auto">
              <NewsletterSubscriptionForm />
            </div>
          </div>
        </div>
      </section>

      <section 
        id="blog-grid-section" 
        className="w-full max-w-4xl mx-auto px-4 bg-white dark:bg-zinc-950 border-x border-t border-border/40"
      >
        <Suspense key={JSON.stringify(resolvedParams)} fallback={<SkeletonLoadingUi />}>
          <CachedBlogGrid/>
        </Suspense>
      </section>
      
    </div>
  );
}