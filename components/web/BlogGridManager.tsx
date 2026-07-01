"use client";

import { useMemo, useState } from "react";
import { BlogGrid } from "./BlogGrid";
import { BlogPostPreview } from "./BlogCard";
import { Frown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const POSTS_PER_PAGE = 9;

interface BlogGridManagerProps {
  allPosts: BlogPostPreview[];
}

export function BlogGridManager({ allPosts }: BlogGridManagerProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [allPosts, currentPage]);

  return (
    <div className="space-y-6">

      {allPosts.length > 0 ? (
        <BlogGrid initialPosts={paginatedPosts} />
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground gap-3 text-center max-w-sm mx-auto px-4">
          <Frown className="h-8 w-8 stroke-[1.2] text-muted-foreground/60" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">No matches found</p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              We couldn't find any articles matching your query. Try updating your filters in the sidebar.
            </p>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-16 mb-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 px-4 py-2 items-center gap-1 sm:gap-2 select-none disabled:opacity-40 disabled:pointer-events-none text-sm font-medium transition-colors hover:bg-accent rounded-md cursor-pointer"
                >
                  ‹ Previous
                </button>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    href="#"
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 px-4 py-2 items-center gap-1 sm:gap-2 select-none disabled:opacity-40 disabled:pointer-events-none text-sm font-medium transition-colors hover:bg-accent rounded-md cursor-pointer"
                >
                  Next ›
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}