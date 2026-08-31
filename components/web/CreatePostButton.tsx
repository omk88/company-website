"use client";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import { useBlogStore } from "@/stores/useBlogStore";

export default function CreatePostButton() {
    const router = useRouter();
    const currentUser = useCurrentUser();
    const pathname = usePathname();
    const setSelectedBlog = useBlogStore((state) => state.setSelectedBlog);

    const allowedStatic = ["/insights"];
    const excludedStatic = ["/vision", "/insights", "/contact", "/products", "/sign-in"];
    const isSingleSegmentRoute = /^\/[^\/]+$/.test(pathname);
    const isUsernamePage = isSingleSegmentRoute && !excludedStatic.includes(pathname);
    const shouldShow = allowedStatic.includes(pathname) || isUsernamePage;
    if (!shouldShow) return null;

    const handleCreatePostClick = () => {
        if (!currentUser) {
            toast.error("You must be logged in to create a post.", {
                action: {
                    label: "Sign in",
                    onClick: () => router.push("/sign-in"),
                },
            });
            return;
        }

        setSelectedBlog(null);
        router.push("/create-blog");
    };

    return (
        <div className="w-full">
            <Button 
                variant="outline"
                className="h-8 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-200 shadow-none transition-all flex items-center gap-1.5 px-3 cursor-pointer"
                onClick={handleCreatePostClick}
            >
                <Plus className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                <span>Create a Post</span>
            </Button>
        </div>
    );
}