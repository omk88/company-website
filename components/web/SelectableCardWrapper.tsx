"use client";

import { Id } from "@/convex/_generated/dataModel";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Pen } from "lucide-react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

interface SelectableCardWrapperProps {
    id: Id<"blogs">;
    isSelected: boolean;
    onSelectChange: (id: Id<"blogs">, checked: boolean) => void;
    isOwnProfile: string | boolean | undefined;
    children: React.ReactNode;
}

export function SelectableCardWrapper({id, isSelected, onSelectChange, isOwnProfile, children}: SelectableCardWrapperProps) {

    const convex = useConvex();
    
    if (!isOwnProfile) {
        return (
            <>
                {children}
            </>
        )
    }

    const prefetchBlog = () => {
        convex.query(api.blogs.getBlogById, { blogId: id }).catch((err) => {
            console.error("Prefetch failed:", err);
        });
    };

    return (
        <div className="relative group">
            <div 
                className={`absolute z-10 p-0.5 bg-white border border-b border-r transition-opacity duration-100 ${
                    isSelected
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                    }`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="flex flex-row items-center gap-0.5">
                    <div className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent/50 transition-colors">
                        <Checkbox
                            id={`select-card-${id}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => onSelectChange(id, !!checked)}
                            className="h-3.5 w-3.5 data-[state=checked]:bg-primary border-black cursor-pointer"
                        />
                    </div>

                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-sm cursor-pointer hover:bg-accent/50"
                    >
                        <Link
                            href={`/company/blog?id=${id}`}
                            onMouseEnter={prefetchBlog}
                        >
                            <Pen className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
            </div>

            {children}
        </div>
    )
}