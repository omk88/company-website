"use client";

import Link from "next/link";
import { Plus, LayoutDashboard, FileText, Settings, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AddBlogButton() {
    const user = useQuery(api.auth.getCurrentUser);
    
    const userEmail = user?.email || "";
    const companyDomain = "@taqtiq.tech";
    const isCompanyUser = userEmail.endsWith(companyDomain);

    if (!isCompanyUser) return null;

    return (
        <div className="w-full pt-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="bg-muted rounded-sm p-2 w-full flex items-center justify-stretch cursor-pointer">
                        <Button className="w-full flex items-center justify-center gap-2">
                            <Hammer className="h-4 w-4 shrink-0" />
                            <span>Admin controls</span>
                        </Button>
                    </div>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent side="bottom" align="center" className="w-56 mt-2">
                    <DropdownMenuLabel>Admin Controls</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/company/blog" className="flex items-center gap-2 w-full">
                            <Plus className="h-4 w-4 shrink-0" />
                            <span>Add New Blog</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}