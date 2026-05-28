import { NewsletterCard } from "@/components/web/NewsletterCard";
import { TagFilters } from "@/components/web/TagFilters";
import { BlogPagination } from "@/components/web/BlogPagination";
import { BlogGrid } from "@/components/web/BlogGrid";

import { headers } from "next/headers";
import { getToken } from "@/lib/auth-server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";



export default async function InsightsPage() {

    const reqHeaders = await headers();
    const token = await getToken();

    let isCompanyUser = false;
    const companyDomain = "@taqtiq.tech";

    if (token) {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL || "http://localhost:3000";
            const response = await fetch(`${baseUrl}/api/auth/get-session`, {
                headers: reqHeaders,
            });
            
            if (response.ok) {
                const session = await response.json();
                const userEmail = session?.user?.email || "";
                
                isCompanyUser = userEmail.endsWith(companyDomain);
            }
        } catch (error) {
            console.error("Failed to fetch session on Insights page:", error);
        }
    }

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