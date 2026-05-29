// app/insights/page.tsx
import { NewsletterCard } from "@/components/web/NewsletterCard";
import { TagFilters } from "@/components/web/TagFilters";
import { BlogPagination } from "@/components/web/BlogPagination";
import { BlogGrid } from "@/components/web/BlogGrid";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

// 1. Import your Convex server-side auth utilities
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";

export default async function InsightsPage() {
    const user = await fetchAuthQuery(api.auth.getCurrentUser);
    
    const userEmail = user?.email || "";
    const companyDomain = "@taqtiq.tech";
    const isCompanyUser = userEmail.endsWith(companyDomain);

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 relative">
            {isCompanyUser && (
                <div className="flex justify-end mb-6">
                    <Link 
                        href="/company/blog" 
                        className={buttonVariants({ variant: "default" })}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add New Blog
                    </Link>
                </div>
            )}

            <NewsletterCard />
            <TagFilters />
            <BlogGrid />
            <BlogPagination />
        </main>
    );
}