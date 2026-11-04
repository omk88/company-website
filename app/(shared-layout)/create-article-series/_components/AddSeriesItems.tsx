"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { BlogCard } from "@/components/web/BlogCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GripVertical, Plus, Loader2, Check, X } from "lucide-react";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import { useSeriesStore } from "@/stores/useSeriesStore";

export function AddSeriesItems() {
  const currentUser = useCurrentUser(); 
  const authorId = currentUser?.userId;

  const userBlogs = useQuery(
    api.blogs.getPostsByAuthor, 
    authorId ? { author: authorId, includeContent: true } : "skip"
  );

  const items = useSeriesStore((state) => state.stagedBlogs);
  const setItems = useSeriesStore((state) => state.setStagedBlogs);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedIndex !== null && dragWidth !== null && dragHeight !== null) {
        const minX = 0;
        const maxX = window.innerWidth - dragWidth;
        const minY = 0;
        const maxY = window.innerHeight - dragHeight;

        const rawX = e.clientX - dragOffset.x;
        const rawY = e.clientY - dragOffset.y;

        const clampedX = Math.max(minX, Math.min(rawX, maxX));
        const clampedY = Math.max(minY, Math.min(rawY, maxY));

        setMousePos({
          x: clampedX + dragOffset.x,
          y: clampedY + dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setDraggedIndex(null);
      setMousePos(null);
      setDragWidth(null);
      setDragHeight(null);
    };

    let styleEl: HTMLStyleElement | null = null;

    if (draggedIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      styleEl = document.createElement("style");
      styleEl.innerHTML = `* { cursor: grabbing !important; }`;
      document.head.appendChild(styleEl);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [draggedIndex, dragOffset, dragWidth, dragHeight]);

  const handleMouseDown = (e: React.MouseEvent, index: number, itemElement: HTMLElement) => {
    e.preventDefault();
    const rect = itemElement.getBoundingClientRect();
    setDraggedIndex(index);
    setMousePos({ x: e.clientX, y: e.clientY });
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragWidth(rect.width);
    setDragHeight(rect.height);
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

  const handleRemoveBlog = (blogId: string) => {
    setItems(items.filter((i) => i._id !== blogId));
  };

  const draggedBlog = draggedIndex !== null ? items[draggedIndex] : null;

  return (
    <div>
      <div className="sticky top-16 z-25 flex items-center justify-between bg-background py-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <p className="text-sm font-semibold">
            {items.length} {items.length === 1 ? "Article" : "Articles"}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Articles
        </Button>
      </div>
      <div className="w-full px-0 py-2" ref={containerRef}>
        {draggedBlog && mousePos && dragWidth !== null && (
          <div 
            className="fixed pointer-events-none z-50 bg-background rounded-xl overflow-hidden shadow-xl"
            style={{ 
              top: mousePos.y - dragOffset.y, 
              left: mousePos.x - dragOffset.x,
              width: `${dragWidth}px`,
            }}
          >
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
        )}

        <div className="w-full flex flex-col">

          {items.length > 0 ? (
            <ul className="flex flex-col gap-4 w-full">
              {items.map((blog, index) => {
                const isBeingDragged = draggedIndex === index;
                return (
                  <li 
                    key={blog._id} 
                    onMouseEnter={() => handleMouseEnter(index)}
                    className="flex flex-col gap-1.5 group relative w-full"
                  >
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Part {index + 1}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="cursor-pointer h-6 w-6 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveBlog(blog._id)}
                          title="Remove from series"
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        <div 
                          onMouseDown={(e) => {
                            const cardContainer = e.currentTarget.closest("li")?.querySelector(".w-full") as HTMLElement;
                            if (cardContainer) handleMouseDown(e, index, cardContainer);
                          }}
                          className="cursor-grab active:cursor-grabbing p-1 -m-1"
                          title="Click and drag to reorder"
                        >
                          <GripVertical className="h-4 w-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>

                    <div className={`w-full ${isBeingDragged ? "opacity-0 pointer-events-none select-none" : "opacity-100"}`}>
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
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-500 mb-2">No articles in this series yet.</p>
              <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add your first article
              </Button>
            </div>
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
    </div>
  );
}