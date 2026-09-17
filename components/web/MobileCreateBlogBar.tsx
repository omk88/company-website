"use client";

import { cn } from "cn";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { useBlogStore } from "@/stores/useBlogStore";
import { ArrowLeft } from "lucide-react";

export function MobileCreateBlogBar() {

    const selectedBlog = useBlogStore((state) => state.selectedBlog);

    const backHref = selectedBlog?._id
        ? `/insights/${selectedBlog._id}`
        : "/insights";

    return (
        <div className="flex flex-row w-full border-b fixed z-10 bg-white">
            <Link
                className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "h-10 w-10 md:h-11 md:w-11 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                )}
                href={backHref}
                title={selectedBlog?._id ? "Back to blog post" : "Back to insights"}
            >
                <ArrowLeft className="w-4 h-4" />
            </Link>
        </div>
    )
}