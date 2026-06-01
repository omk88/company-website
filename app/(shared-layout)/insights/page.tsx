import { NewsletterCard } from "@/components/web/NewsletterCard";
import { TagFilters } from "@/components/web/TagFilters";
import { BlogPagination } from "@/components/web/BlogPagination";
import { AdminActions } from "@/components/web/AdminActions";
import { CachedBlogGrid } from "@/components/web/CachedBlogGrid";
import { SkeletonLoadingUi } from "@/components/web/SkeletonLoadingUI";
import { Suspense } from "react";

export default async function InsightsPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8 relative">
            <AdminActions />
            <NewsletterCard />
            <TagFilters />
            
            <Suspense fallback={<SkeletonLoadingUi />}>
                <CachedBlogGrid />
            </Suspense>

            <BlogPagination />
        </main>
    );
}