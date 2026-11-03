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
import { Skeleton } from "@/components/ui/skeleton";

interface RightSidebarArticleSeriesProps {
  slug: string;
}

export function RightSidebarArticleSeries({ slug }: RightSidebarArticleSeriesProps) {
  const seriesData = useQuery(
    api.series.getSeriesBySlug, 
    slug ? { slug } : "skip"
  );

  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!seriesData) {
    return (
      <Sidebar
        side="right" 
        bgClass="bg-background/95" 
        className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 border-l border-zinc-200 dark:border-zinc-800 w-[20rem] shrink-0"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <SidebarContent className="!p-0 h-full overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="w-[20rem] max-w-full overflow-hidden">
              <SidebarGroup className="pt-4 !px-3 w-full flex flex-col gap-4">
                <div className="flex flex-col gap-1 pb-3 border-b border-zinc-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="w-3.5 h-3.5 rounded" />
                    <Skeleton className="w-12 h-3 rounded" />
                  </div>
                  <Skeleton className="w-3/4 h-4 rounded-md mt-1" />
                </div>
              </SidebarGroup>
            </div>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="hidden" />
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
      className="flex flex-col !top-16 !z-40 overflow-hidden !p-0 border-l border-zinc-200 dark:border-zinc-800 w-[20rem] shrink-0"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <SidebarContent className="!p-0 h-full overflow-hidden">
        <ScrollArea className="h-full w-full">
          {/* Constrain inner container to strict 20rem width boundary with hidden overflow */}
          <div className="w-[20rem] max-w-full overflow-hidden box-border">
            <SidebarGroup className="pt-4 !px-3 w-full flex flex-col gap-4 overflow-hidden">
              
              <div className="flex flex-col gap-1 pb-3 border-b border-zinc-200/60 dark:border-zinc-800 max-w-full overflow-hidden">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <List className="w-3.5 h-3.5" />
                  <span>Topics</span>
                </div>
                <h3 className="text-sm font-bold text-foreground leading-snug truncate max-w-full">
                  {seriesData.title}
                </h3>
              </div>

              <div className="flex flex-col gap-5 pb-6 max-w-full overflow-hidden">
                {seriesData.blogs.map((blog, index) => {
                  if (!blog?._id || !blog?.blogTitleId) return null;

                  const blogTitleId = blog.blogTitleId;
                  const blogId = blog._id;

                  const processedTopics = parseRawHeadingsFromMarkdown(blog.content);
                  const isOpen = openItems[blogId] || false;

                  return (
                    <div key={blogId} className="flex flex-col gap-1.5 text-xs max-w-full overflow-hidden">
                      <div className="flex flex-col gap-0.5 max-w-full overflow-hidden">
                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                          Part {index + 1}
                        </span>
                        <Link 
                          href={`/insights/${blogTitleId}`}
                          className="max-w-full block truncate"
                        >
                          <span className="font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug truncate block max-w-full">
                            {blog.title}
                          </span>
                        </Link>
                      </div>

                      {processedTopics.length > 0 && (
                        <Collapsible 
                          open={isOpen} 
                          onOpenChange={() => toggleItem(blogId)}
                          className="mt-1 flex flex-col gap-1 max-w-full overflow-hidden"
                        >
                          <CollapsibleTrigger className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors py-0.5 w-fit cursor-pointer">
                            <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                            <span>{processedTopics.length} topics</span>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="max-w-full overflow-hidden">
                            <ul className="pl-3 ml-1 border-l-2 border-zinc-200 dark:border-zinc-800 flex flex-col gap-1 pt-1 max-w-full overflow-hidden">
                              {processedTopics.map((topic) => (
                                <li key={topic.id} className="max-w-full overflow-hidden">
                                  <Link
                                    href={`/insights/${blogTitleId}#${topic.id}`}
                                    target="_blank"
                                    className="text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block truncate max-w-full"
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
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}