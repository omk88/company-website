"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, useConvex, usePreloadedQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { BlogCard } from "./BlogCard";
import { useLocalSearch } from "./SearchContext";
import { SelectableCardWrapper } from "./SelectableCardWrapper";
import { Id } from "@/convex/_generated/dataModel";
import { Pen } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface ProfileBlogPostsProps {
    username: string;
    preloadedProfile: Preloaded<typeof api.profiles.getProfileByUsername>;
    preloadedInitialBlogs: Preloaded<typeof api.blogs.getPaginatedPostsByUsername>;
    preloadedCurrentUser: Preloaded<typeof api.auth.getCurrentUser>;
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<Id<"blogs">[]>>;
    onLoadedIdsChange: (ids: Id<"blogs">[]) => void;
}

export function ProfileBlogPosts({ username, preloadedProfile, preloadedInitialBlogs, preloadedCurrentUser, selectedIds, setSelectedIds, onLoadedIdsChange }: ProfileBlogPostsProps) {
    const convex = useConvex();

    const initialData = usePreloadedQuery(preloadedInitialBlogs);
    const currentUser = usePreloadedQuery(preloadedCurrentUser);
    const profileData = usePreloadedQuery(preloadedProfile);
    const profile = profileData.profile;

    const isOwnProfile = currentUser?.userId && profile?.userId && currentUser.userId === profile.userId;

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
                const result = await convex.query(api.blogs.getPaginatedPostsByUsername, {
                    username,
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
            const result = await convex.query(api.blogs.getPaginatedPostsByUsername, {
                username,
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

    useEffect(() => {
        onLoadedIdsChange(blogs.map((b) => b._id));
    }, [blogs, onLoadedIdsChange]);

    const handleSelectChange = (id: Id<"blogs">, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    return (
        <div className="space-y-4">
            {blogs.length === 0 ? (
                <p className="text-muted-foreground">{username} has not posted any insights yet.</p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-4">
                            {blogs.map((blog) => (
                                <li key={blog._id}>
                                    <SelectableCardWrapper
                                        id={blog._id}
                                        isSelected={selectedIds.includes(blog._id)}
                                        onSelectChange={handleSelectChange}
                                        isOwnProfile={isOwnProfile}
                                        actions={
                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 rounded-sm cursor-pointer hover:bg-accent/50"
                                            >
                                            <Link
                                                href={`/company/blog?id=${blog._id}`}
                                                onMouseEnter={() => {
                                                convex.query(api.blogs.getBlogById, { blogId: blog._id }).catch((err) => {
                                                    console.error("Prefetch failed:", err);
                                                });
                                                }}
                                            >
                                                <Pen className="h-3.5 w-3.5" />
                                            </Link>
                                            </Button>
                                        }
                                    >
                                        <BlogCard
                                            id={blog._id}
                                            imageUrl={blog.imageUrl}
                                            authorName={blog.authorName}
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
                                    </SelectableCardWrapper>
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