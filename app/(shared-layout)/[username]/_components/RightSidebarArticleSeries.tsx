"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { processHeadings } from "../../insights/[blogTitleId]/_utils/headingUtils";
import Link from "next/link";
import { ChevronRight, List } from "lucide-react";

interface RightSidebarArticleSeriesProps {
  slug: string;
}

export function RightSidebarArticleSeries({ slug }: RightSidebarArticleSeriesProps) {
  const seriesData = useQuery(
    api.series.getSeriesWithBlogsBySlug, 
    slug ? { slug } : "skip"
  );

  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!seriesData) {
    return (
      <Sidebar side="right" bgClass="bg-background/95" className="flex flex-col !top-16 !z-40 overflow-hidden !p-0" style={{ height: "calc(100vh - 4rem)" }}>
        <SidebarContent className="!p-0 h-full">
          <SidebarGroup className="pt-3 !px-2 w-full">
            <div className="p-3 text-xs text-zinc-500">Loading series...</div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  const parseRawHeadingsFromMarkdown = (markdown: string = "") => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const rawHeadings: { text: string; level: number }[] = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2];
      rawHeadings.push({ text, level });
    }

    return processHeadings(rawHeadings);
  };

  return (
    <Sidebar
      side="right" 
      bgClass="bg-background/95" 
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 border-l border-zinc-200 dark:border-zinc-800"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0 h-full">
        <ScrollArea className="h-full w-full">
          <SidebarGroup className="pt-4 !px-3 w-full flex flex-col gap-4">
            
            <div className="flex flex-col gap-1 pb-3 border-b border-zinc-200/60 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <List className="w-3.5 h-3.5" />
                <span>Topics</span>
              </div>
              <h3 className="text-sm font-bold text-foreground leading-snug">
                {seriesData.title}
              </h3>
            </div>

            <div className="flex flex-col gap-5 pb-6">
              {seriesData.blogs.map((blog, index) => {
                if (!blog?._id || !blog?.blogTitleId) return null;

                const blogTitleId = blog.blogTitleId;
                const blogId = blog._id;

                const processedTopics = parseRawHeadingsFromMarkdown(blog.content);
                const isOpen = openItems[blogId] || false;

                return (
                  <div key={blogId} className="flex flex-col gap-1.5 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                        Part {index + 1}
                      </span>
                      <Link 
                        href={`/insights/${blogTitleId}`}
                        className="w-fit"
                      >
                        <span className="font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug">
                          {blog.title}
                        </span>
                      </Link>
                    </div>

                    {processedTopics.length > 0 && (
                      <Collapsible 
                        open={isOpen} 
                        onOpenChange={() => toggleItem(blogId)}
                        className="mt-1 flex flex-col gap-1"
                      >
                        <CollapsibleTrigger className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors py-0.5 w-fit cursor-pointer">
                          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                          <span>{processedTopics.length} topics</span>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <ul className="pl-3 ml-1 border-l-2 border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 pt-1">
                            {processedTopics.map((topic) => (
                              <li key={topic.id} className="truncate">
                                <Link
                                  href={`/insights/${blogTitleId}#${topic.id}`}
                                  className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
                                >
                                  {topic.text}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                );
              })}
            </div>

          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}