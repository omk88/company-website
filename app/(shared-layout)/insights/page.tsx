import { NewsletterCard } from "@/components/web/NewsletterCard";
import { TagFilters } from "@/components/web/TagFilters";
import { BlogPagination } from "@/components/web/BlogPagination";
import { BlogGrid } from "@/components/web/BlogGrid";
import { AdminActions } from "@/components/web/AdminActions";

import { preloadQuery } from "convex/nextjs"; 
import { api } from "@/convex/_generated/api";

export const dynamic = 'force-static'

export default async function InsightsPage() {
    const preloadedBlogs = await preloadQuery(api.blogs.getPosts);
    
    return (
        <main className="max-w-7xl mx-auto px-4 py-8 relative">
            <AdminActions />

            <NewsletterCard />
            <TagFilters />
            <BlogGrid preloadedBlogs={preloadedBlogs} />
            <BlogPagination />
        </main>
    );
}