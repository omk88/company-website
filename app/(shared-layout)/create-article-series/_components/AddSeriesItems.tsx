"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { BlogCard } from "@/components/web/BlogCard";
import { EmptyState } from "@/components/web/EmptyState";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Library, GripVertical, Plus, Loader2, Check, X } from "lucide-react"; // <--- Import X icon
import { useCurrentUser } from "@/app/ConvexClientProvider";

interface AddSeriesItemsProps {
  items: Doc<"blogs">[];
  setItems: React.Dispatch<React.SetStateAction<Doc<"blogs">[]>>;
}

export function AddSeriesItems({ items, setItems }: AddSeriesItemsProps) {
  const currentUser = useCurrentUser();
  const authorId = currentUser?.userId;

  const userBlogs = useQuery(api.blogs.getPostsByAuthor, authorId ? { author: authorId, includeContent: true } : "skip");

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedIndex !== null) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setDraggedIndex(null);
      setMousePos(null);
    };

    if (draggedIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedIndex]);

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setDraggedIndex(index);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...items];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    setDraggedIndex(index);
    setItems(updated);
  };

  const handleToggleBlog = (blog: Doc<"blogs">) => {
    const exists = items.some((i) => i._id === blog._id);
    if (exists) {
      setItems(items.filter((i) => i._id !== blog._id));
    } else {
      setItems([...items, blog]);
    }
  };

  // Function to remove a blog from the series
  const handleRemoveBlog = (blogId: string) => {
    setItems(items.filter((i) => i._id !== blogId));
  };

  const draggedBlog = draggedIndex !== null ? items[draggedIndex] : null;

  return (
    <div className="w-full p-2" ref={containerRef}>
      {/* Floating physical card preview while dragging */}
      {draggedBlog && mousePos && (
        <div 
          className="fixed pointer-events-none z-50 w-[450px]"
          style={{ 
            top: mousePos.y - 40, 
            left: mousePos.x - 100,
          }}
        >
          <div className="flex flex-col gap-1.5 bg-background border border-border rounded-xl p-2 shadow-xl">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Part {(draggedIndex ?? 0) + 1}
              </span>
            </div>
            <BlogCard
              id={draggedBlog._id}
              blogTitleId={draggedBlog.blogTitleId}
              imageUrl={draggedBlog.imageUrl}
              displayName={draggedBlog.displayName}
              username={draggedBlog.username}
              title={draggedBlog.title}
              subtitle={draggedBlog.subtitle}
              totalViews={draggedBlog.totalViews}
              likes={draggedBlog.likes}
              commentCount={draggedBlog.commentCount}
              date={draggedBlog._creationTime}
              readTime={draggedBlog.readTime}
              tags={draggedBlog.tags}
              variant="compact"
            />
          </div>
        </div>
      )}

      <div className="w-full mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            Series Articles ({items.length})
          </span>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Articles
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col h-64 w-full items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-card">
            <EmptyState icon={Library} size="sm" description="There are no articles in this draft yet. Click 'Add Articles' to get started." />
            <Button size="sm" variant="outline" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 mt-3">
              <Plus className="h-4 w-4" />
              Add First Article
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((blog, index) => {
              const isBeingDragged = draggedIndex === index;
              return (
                <li 
                  key={blog._id} 
                  onMouseEnter={() => handleMouseEnter(index)}
                  className="flex flex-col gap-1.5 group relative"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <div 
                        onMouseDown={(e) => handleMouseDown(e, index)}
                        className="cursor-grab active:cursor-grabbing p-1 -m-1"
                        title="Click and drag to reorder"
                      >
                        <GripVertical className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Part {index + 1}
                      </span>
                    </div>

                    {/* Remove button appears on hover */}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveBlog(blog._id)}
                      title="Remove from series"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className={isBeingDragged ? "opacity-0 pointer-events-none select-none" : "opacity-100"}>
                    <BlogCard
                      id={blog._id}
                      blogTitleId={blog.blogTitleId}
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
                      variant="compact"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Articles to Series</DialogTitle>
            <DialogDescription>Select articles from your library to include in this series draft.</DialogDescription>
          </DialogHeader>

          <div className="py-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {userBlogs === undefined ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
            ) : userBlogs.length === 0 ? (
              <p className="text-sm text-center text-zinc-500 py-6">No published articles found.</p>
            ) : (
              userBlogs.map((blog: any) => {
                const isSelected = items.some((item) => item._id === blog._id);
                return (
                  <div key={blog._id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card">
                    <div className="flex flex-col min-w-0 pr-3">
                      <span className="text-sm font-semibold truncate">{blog.title}</span>
                      <span className="text-xs text-zinc-400 truncate">{blog.subtitle || "No subtitle"}</span>
                    </div>
                    <Button size="sm" variant={isSelected ? "outline" : "default"} onClick={() => handleToggleBlog(blog)} className="shrink-0 gap-1">
                      {isSelected ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Added</> : <><Plus className="h-3.5 w-3.5" /> Add</>}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}