"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AddBlogButton() {
    const user = useQuery(api.auth.getCurrentUser);
    
    console.log("USER:", user);
    
    const userEmail = user?.email || "";
    const companyDomain = "@taqtiq.tech";
    const isCompanyUser = userEmail.endsWith(companyDomain);

    if (!isCompanyUser) return null;

    return (
        <div className="flex justify-end mb-6">
            <Link 
                href="/company/blog" 
                className={buttonVariants({ variant: "default" })}
            >
                <Plus className="mr-2 h-4 w-4" /> Add New Blog
            </Link>
        </div>
    );
}