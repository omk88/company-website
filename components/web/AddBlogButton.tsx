"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";

export function AddBlogButton() {
    const user = fetchAuthQuery(api.auth.getCurrentUser);
    
    //const userEmail = user?.email || "";
    //const companyDomain = "@taqtiq.tech";
    //const isCompanyUser = userEmail.endsWith(companyDomain);

    console.log("CURRENT USER:", user);

    //if (!isCompanyUser) return null;

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