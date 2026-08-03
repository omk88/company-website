"use client";

import { api } from "@/convex/_generated/api";
import { username } from "better-auth/plugins";
import { useConvex } from "convex/react";
import { useState, useRef, useEffect } from "react";
import { BlogCard } from "./BlogCard";
import { useLocalSearch } from "./SearchContext";
import { FunctionReturnType } from "convex/server";

type PaginatedBlogsResponse = FunctionReturnType<typeof api.blogs.getPaginatedPostsByType>;

interface PageBlogPostsProps {
    initialBlogs: PaginatedBlogsResponse
}

export function PageBlogPosts({ initialBlogs }: PageBlogPostsProps) {
    const convex = useConvex();

    const searchContext = useLocalSearch();
    const searchTerm = searchContext?.searchTerm ?? "";
    const sortOrder = searchContext?.sortOrder ?? "new";
    const activeTags = searchContext?.activeTags ?? [];

    const [blogs, setBlogs] = useState(initialBlogs.page);
    const [cursor, setCursor] = useState<string | null>(initialBlogs.continueCursor);
    const [isDone, setIsDone] = useState(initialBlogs.isDone);
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!searchTerm.trim() && sortOrder === "new" && activeTags.length === 0) {
            setBlogs(initialBlogs.page);
            setCursor(initialBlogs.continueCursor);
            setIsDone(initialBlogs.isDone);
            return;
        }

        let isMounted = true;
        setIsLoading(true);

        const fetchFilteredBlogs = async () => {
            try {
                const result = await convex.query(api.blogs.getPaginatedPostsByType, {
                    postType: "community",
                    searchTerm: searchTerm.trim() || undefined,
                    activeTags: activeTags.length > 0 ? activeTags : undefined,
                    sortOrder,
                    paginationOpts: {
                        numItems: 6,
                        cursor: null,
                        id: 0,
                    },
                });

                if (isMounted) {
                    setBlogs(result.page);
                    setCursor(result.continueCursor);
                    setIsDone(result.isDone);
                }
            } catch (error) {
                console.error("Error searching blogs:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchFilteredBlogs();

        return () => {
            isMounted = false;
        };
    }, [searchTerm, sortOrder, activeTags, username, convex, initialBlogs]);

    const loadMore = async () => {
        if (isDone || isLoading || !cursor) return;
        setIsLoading(true);

        try {
            const result = await convex.query(api.blogs.getPaginatedPostsByType, {
                postType: "community",
                searchTerm: searchTerm.trim() || undefined,
                activeTags: activeTags.length > 0 ? activeTags : undefined,
                sortOrder,
                paginationOpts: {
                    numItems: 6,
                    cursor: cursor,
                    id: 0,
                }
            });

            setBlogs((prev) => [...prev, ...result.page]);
            setCursor(result.continueCursor);
            setIsDone(result.isDone);
        } catch (error) {
            console.error("Error loading more blogs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isDone || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore()
                }
            },
            { rootMargin: "200px" }
        );

        const currentTarget = loadMoreRef.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [cursor, isDone, isLoading, searchTerm, sortOrder, activeTags]);

    return (
        <div className="space-y-4 p-2">
            {blogs.length === 0 ? (
                <p className="text-muted-foreground">No insights posted yet.</p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-2">
                            {blogs.map((blog) => (
                                <li key={blog._id}>
                                    <BlogCard
                                        id={blog._id}
                                        imageUrl={blog.imageUrl}
                                        displayName={blog.displayName}
                                        username={blog.username}
                                        title={blog.title}
                                        subtitle={blog.subtitle}
                                        totalViews={blog.totalViews}
                                        likes={blog.likes}
                                        commentCount={blog.commentCount}
                                        date={blog._creationTime}
                                        readTime={blog.readTime}
                                        tags={blog.tags}
                                    />
                                </li>
                            ))}
                        </ul>

                        {!isDone && (
                            <div ref={loadMoreRef} className="py-6 text-center text-sm text-muted-foreground">
                                {isLoading ? "Loading more blogs..." : "Loading..."}
                            </div>
                        )}
                    </>
                )}
        </div>
    );
}