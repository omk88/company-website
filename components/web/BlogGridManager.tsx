"use client";

import { useState, useMemo } from "react";
import { Toggle } from "@/components/ui/toggle"; 
import { BlogGrid } from "./BlogGrid";
import { BlogPostPreview } from "./BlogCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const AVAILABLE_TAGS = ["Tutorials", "Research", "Design", "Technology", "Product", "Opinion"];
const POSTS_PER_PAGE = 9;

interface BlogGridManagerProps {
  allPosts: BlogPostPreview[];
}

export function BlogGridManager({ allPosts }: BlogGridManagerProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return allPosts;

    return allPosts.filter((post) =>
      post.tags && selectedTags.every((selectedTag) =>
        post.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase())
      )
    );
  }, [allPosts, selectedTags]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleTagToggle = (tag: string) => {
    setCurrentPage(1);
    
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleClearAll = () => {
    setCurrentPage(1);
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      
      <div className="my-12 flex flex-col items-center gap-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">Filter by Topics</p>

        <div className="flex flex-wrap justify-center gap-3">
          <Toggle
            pressed={selectedTags.length === 0}
            onPressedChange={handleClearAll}
            className="rounded-full px-4 py-2 border data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:hover:bg-black data-[state=on]:hover:text-white transition-all duration-200"
          >
            All Posts
          </Toggle>

          {AVAILABLE_TAGS.map((tag) => {
            const isPressed = selectedTags.includes(tag);
            return (
              <Toggle
                key={tag}
                pressed={isPressed}
                onPressedChange={() => handleTagToggle(tag)}
                className="rounded-full px-4 py-2 border data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:hover:bg-black data-[state=on]:hover:text-white transition-all duration-200"
              >
                {tag}
              </Toggle>
            );
          })}
        </div>
      </div>

      <BlogGrid initialPosts={paginatedPosts} />

      {totalPages > 1 && (
        <div className="mt-16 mb-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 px-4 py-2 items-center gap-1 sm:gap-2 select-none disabled:opacity-40 disabled:pointer-events-none text-sm font-medium transition-colors hover:bg-accent rounded-md"
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
                  className="flex h-10 px-4 py-2 items-center gap-1 sm:gap-2 select-none disabled:opacity-40 disabled:pointer-events-none text-sm font-medium transition-colors hover:bg-accent rounded-md"
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