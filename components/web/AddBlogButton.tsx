"use client";

import Link from "next/link";
import { Plus, LayoutDashboard, FileText, Settings } from "lucide-react";
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
        <div className="fixed bottom-6 left-6 z-50 font-sans">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        size="icon" 
                        className="h-12 w-12 rounded-full shadow-lg cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 active:scale-95"
                    >
                        <Plus className="h-6 w-6 transition-transform duration-200 group-data-[state=open]:rotate-45" />
                        <span className="sr-only">Open Admin Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent side="top" align="end" className="w-56 mb-2">
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