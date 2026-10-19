"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup } from "@/components/ui/sidebar";
import { processHeadings } from "../../insights/[blogTitleId]/_utils/headingUtils";
import Link from "next/link";
import { Layers, List } from "lucide-react";

interface RightSidebarArticleSeriesProps {
  slug: string;
}

export function RightSidebarArticleSeries({ slug }: RightSidebarArticleSeriesProps) {
  const seriesData = useQuery(
    api.series.getSeriesWithBlogsBySlug, 
    slug ? { slug } : "skip"
  );

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
      <SidebarContent className="!p-0 h-full overflow-y-auto">
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

          <div className="flex flex-col gap-6 pb-6">
            {seriesData.blogs.map((blog, index) => {
              const processedTopics = parseRawHeadingsFromMarkdown(blog.content);

              return (
                <div key={blog._id} className="flex flex-col gap-1.5 text-xs">
                  <Link 
                    href={`/insights/${blog.blogTitleId}`}
                    className="group flex flex-col gap-0.5"
                  >
                    <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                      Part {index + 1}
                    </span>
                    <span className="font-medium text-foreground group-hover:underline leading-snug">
                      {blog.title}
                    </span>
                  </Link>

                  {processedTopics.length > 0 && (
                    <ul className="pl-3 mt-1 border-l-2 border-zinc-200 dark:border-zinc-800 flex flex-col gap-1">
                      {processedTopics.map((topic) => (
                        <li key={topic.id} className="text-zinc-500 dark:text-zinc-400 truncate">
                          {topic.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}