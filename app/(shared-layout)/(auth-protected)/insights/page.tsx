import { NewsletterCard } from "@/components/web/NewsletterCard";
import { AdminActions } from "@/components/web/AdminActions";
import { CachedBlogGrid } from "@/components/web/CachedBlogGrid";
import { SkeletonLoadingUi } from "@/components/web/SkeletonLoadingUI";
import { Suspense } from "react";

export default function InsightsPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8 relative">
            <AdminActions />
            <NewsletterCard />
            
            <Suspense fallback={<SkeletonLoadingUi />}>
                <CachedBlogGrid />
            </Suspense>
        </main>
    );
}
