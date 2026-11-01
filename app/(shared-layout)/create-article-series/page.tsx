"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Doc } from "@/convex/_generated/dataModel";
import { LeftSidebarCreateArticleSeries } from "./_components/LeftSidebarCreateArticleSeries";
import { AddSeriesItems } from "./_components/AddSeriesItems";

export default function CreateArticleSeriesPage() {
    const [stagedBlogs, setStagedBlogs] = useState<Doc<"blogs">[]>([]);

    return (
        <div className="min-h-screen w-full">
            <SidebarProvider className="w-full min-h-screen">
                <aside 
                    className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
                >
                    <LeftSidebarCreateArticleSeries 
                        stagedBlogIds={stagedBlogs.map((b) => b._id)}
                    />
                </aside>

                <div className="w-full md:flex-1 md:flex md:flex-row md:min-w-0 md:pt-16 p-4">
                    <AddSeriesItems 
                        items={stagedBlogs}
                        setItems={setStagedBlogs}
                    />
                </div>
            </SidebarProvider>
        </div>
    );
}