"use client";

import { useState, useMemo } from "react";
import { Toggle } from "@/components/ui/toggle"; 
import { Input } from "@/components/ui/input";
import { BlogGrid } from "./BlogGrid";
import { BlogPostPreview } from "./BlogCard";
import { 
  ArrowUpDown, 
  Check, 
  Search, 
  X, 
  Frown,
  CalendarArrowUp,
  CalendarArrowDown,
  ArrowDownAZ,
  ArrowUpAZ,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const AVAILABLE_TAGS = ["Tutorials", "Research", "Design", "Technology", "Product", "Opinion"];
const POSTS_PER_PAGE = 9;

type SortOption = "recent" | "oldest" | "title-az" | "title-za";

interface BlogGridManagerProps {
  allPosts: BlogPostPreview[];
}

export function BlogGridManager({ allPosts }: BlogGridManagerProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [currentPage, setCurrentPage] = useState(1);

  const processedPosts = useMemo(() => {
    const filtered = allPosts.filter((post) => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((selectedTag) =>
          post.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
        );

      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTags && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "recent") return b.createdAt - a.createdAt;
      if (sortBy === "oldest") return a.createdAt - b.createdAt;
      if (sortBy === "title-az") return a.title.localeCompare(b.title);
      if (sortBy === "title-za") return b.title.localeCompare(a.title);
      return 0;
    });
  }, [allPosts, selectedTags, searchQuery, sortBy]);

  const totalPages = Math.ceil(processedPosts.length / POSTS_PER_PAGE);
  
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return processedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [processedPosts, currentPage]);

  const handleTagToggle = (tag: string) => {
    setCurrentPage(1);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearAll = () => {
    setCurrentPage(1);
    setSelectedTags([]);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "recent": return "Most Recent";
      case "oldest": return "Least Recent";
      case "title-az": return "Title (A-Z)";
      case "title-za": return "Title (Z-A)";
      default: return "Sort";
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-border/40">
        
        <div className="space-y-2 flex-1">
          <h1 className="flex items-center justify-start gap-2 font-bold text-base md:text-lg text-muted-foreground tracking-tight">
            <BookOpen className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
            <span>All articles</span>
          </h1>
          <p className="text-xs font-medium text-muted-foreground">Topics</p>
          <div className="flex flex-wrap gap-2">
            <Toggle
              variant="outline"
              size="sm"
              pressed={selectedTags.length === 0}
              onPressedChange={handleClearAll}
              className="rounded-md text-xs cursor-pointer bg-card border-border/50 text-foreground hover:bg-muted data-[state=on]:bg-black data-[state=on]:text-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-black transition-colors"
            >
              All Posts
            </Toggle>

            {AVAILABLE_TAGS.map((tag) => (
              <Toggle
                key={tag}
                variant="outline"
                size="sm"
                pressed={selectedTags.includes(tag)}
                onPressedChange={() => handleTagToggle(tag)}
                className="rounded-md text-xs cursor-pointer bg-card border-border/50 text-foreground hover:bg-muted data-[state=on]:bg-black data-[state=on]:text-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-black transition-colors"
              >
                {tag}
              </Toggle>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-2 px-3 border-border/50 bg-card hover:bg-muted text-xs font-medium shadow-xs cursor-pointer"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                <span>{getSortLabel()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border/50">
              <DropdownMenuItem 
                onClick={() => setSortBy("recent")}
                className="flex items-center justify-between text-xs py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CalendarArrowUp className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                  <span>Most Recent</span>
                </div>
                {sortBy === "recent" && <Check className="h-3.5 w-3.5 stroke-[2] text-primary" />}
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => setSortBy("oldest")}
                className="flex items-center justify-between text-xs py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CalendarArrowDown className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                  <span>Least Recent</span>
                </div>
                {sortBy === "oldest" && <Check className="h-3.5 w-3.5 stroke-[2] text-primary" />}
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => setSortBy("title-az")}
                className="flex items-center justify-between text-xs py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ArrowDownAZ className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                  <span>Title (A-Z)</span>
                </div>
                {sortBy === "title-az" && <Check className="h-3.5 w-3.5 stroke-[2] text-primary" />}
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => setSortBy("title-za")}
                className="flex items-center justify-between text-xs py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpAZ className="h-3.5 w-3.5 text-muted-foreground stroke-[1.5]" />
                  <span>Title (Z-A)</span>
                </div>
                {sortBy === "title-za" && <Check className="h-3.5 w-3.5 stroke-[2] text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative flex-1 lg:w-72 lg:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground stroke-[1.5]" />
            <Input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-9 h-9 text-xs bg-card border-border/50 rounded-md shadow-xs focus-visible:ring-1 focus-visible:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-sm hover:bg-muted"
              >
                <X className="h-3.5 w-3.5 stroke-[2]" />
              </button>
            )}
          </div>

        </div>
      </div>

      {processedPosts.length > 0 ? (
        <BlogGrid initialPosts={paginatedPosts} />
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-muted-foreground gap-3 text-center max-w-sm mx-auto px-4">
          <Frown className="h-8 w-8 stroke-[1.2] text-muted-foreground/60" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">No matches found</p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              We couldn't find any articles matching your query. Try updating your spelling or shifting tags.
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