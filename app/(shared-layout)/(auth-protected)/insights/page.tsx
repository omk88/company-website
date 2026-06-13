import { NewsletterCard } from "@/components/web/NewsletterCard";
import { AddBlogButton } from "@/components/web/AddBlogButton";
import { CachedBlogGrid } from "@/components/web/CachedBlogGrid";
import { SkeletonLoadingUi } from "@/components/web/SkeletonLoadingUI";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function InsightsPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8 relative">
            <AddBlogButton />
            <NewsletterCard />
            
            <Suspense fallback={<SkeletonLoadingUi />}>
                <CachedBlogGrid />
            </Suspense>
        </main>
    );
}
