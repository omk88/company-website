import { api } from "@/convex/_generated/api";
import { username } from "better-auth/plugins";
import { Preloaded, useConvex, usePreloadedQuery } from "convex/react";
import { useState, useRef, useEffect } from "react";
import { BlogCard } from "./BlogCard";
import { useLocalSearch } from "./SearchContext";

interface PageBlogPostsProps {
    preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
    preloadedInitialBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByUsername>;
}

export function PageBlogPosts({ preloadedProfile, preloadedInitialBlogs }: PageBlogPostsProps) {
    const convex = useConvex();

    const initialData = usePreloadedQuery(preloadedInitialBlogs);
    const profileData = usePreloadedQuery(preloadedProfile);
    const profile = profileData.profile;

    const searchContext = useLocalSearch();
    const searchTerm = searchContext?.searchTerm ?? "";
    const sortOrder = searchContext?.sortOrder ?? "new";
    const activeTags = searchContext?.activeTags ?? [];

    const [blogs, setBlogs] = useState(initialData.page);
    const [cursor, setCursor] = useState<string | null>(initialData.continueCursor);
    const [isDone, setIsDone] = useState(initialData.isDone);
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!searchTerm.trim() && sortOrder === "new" && activeTags.length === 0) {
            setBlogs(initialData.page);
            setCursor(initialData.continueCursor);
            setIsDone(initialData.isDone);
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
    }, [searchTerm, sortOrder, activeTags, username, convex, initialData]);

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
        <div className="space-y-4">
            {blogs.length === 0 ? (
                <p className="text-muted-foreground">No insights posted yet.</p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-4">
                            {blogs.map((blog) => (
                                <li key={blog._id}>
                                    <BlogCard
                                        preloadedProfile={preloadedProfile}
                                        id={blog._id}
                                        imageUrl={blog.imageUrl}
                                        authorName={blog.authorName}
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