"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FolderBookmark, Trash2, ChevronLeft, FileImage } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent } from "../ui/sidebar";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useBlogStore } from "@/stores/useBlogStore";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function formatTimeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface LeftSidebarCreateBlogProps {
  onSelectDraft?: (draft: any) => void;
}

export function LeftSidebarCreateBlog({ onSelectDraft }: LeftSidebarCreateBlogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedBlog = useBlogStore((state) => state.selectedBlog);

  const backHref = selectedBlog?._id
    ? `/insights/${selectedBlog._id}`
    : "/insights";

  const currentUser = useCurrentUser();
  const userId = currentUser?.userId;

  const drafts = useQuery(api.drafts.listUserDrafts);
  const deleteDraftById = useMutation(api.drafts.deleteDraftById);

  const handleDelete = async (e: React.MouseEvent, draftId: any) => {
    e.stopPropagation();
    try {
      await deleteDraftById({ draftId });
    } catch (err) {
      console.error("Failed to delete draft:", err);
    }
  };

  const setActiveDraft = useBlogStore((state) => state.setActiveDraft);

  return (
    <aside className="w-full md:w-[3.5rem] h-14 md:h-full shrink-0 relative z-40">
      <Sidebar 
        bgClass="bg-white dark:bg-zinc-950" 
        showBorder={true} 
        className="!top-0 md:!top-16 !z-40 !w-full md:!w-[3.5rem] !h-14 md:!h-full"
      >
        <div className="flex flex-col md:flex-row h-full w-full relative">
          <div className="w-full md:w-[3.5rem] h-14 md:h-full shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-start border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-10 px-3 md:px-0">
            
            <SidebarHeader className="flex items-center justify-center p-0 md:p-2">
              <Link
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-10 w-10 md:h-11 md:w-11 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                )}
                href={backHref}
                title={selectedBlog?._id ? "Back to blog post" : "Back to insights"}
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </SidebarHeader>

            <SidebarContent className="items-center p-0 md:p-0">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "cursor-pointer h-10 w-10 md:h-11 md:w-11 rounded-full transition-colors",
                  isOpen 
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                )}
                title="Toggle Drafts"
              >
                <FolderBookmark className="w-4 h-4" />
              </button>
            </SidebarContent>

            <SidebarFooter className="hidden md:flex" />
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={cn(
                  "absolute bg-white dark:bg-zinc-950 shadow-xl z-0 p-3 flex flex-col",
                  "top-0 bottom-0 left-[3.5rem] w-[16rem] h-full border-r border-zinc-200 dark:border-zinc-800"
                )}
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Saved Drafts</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="cursor-pointer h-6 w-6 text-zinc-500 hover:text-zinc-900" 
                    onClick={() => setIsOpen(false)}
                  >
                    <ChevronLeft className="h-4 w-4 md:rotate-0 rotate-90" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 max-h-[45vh] md:max-h-none">
                  {drafts === undefined && (
                    <p className="text-xs text-zinc-400 p-2">Loading drafts…</p>
                  )}

                  {drafts?.length === 0 && (
                    <p className="text-xs text-zinc-400 p-2">No saved drafts found</p>
                  )}

                  {drafts?.map((draft) => (
                    <div
                      key={draft._id}
                      onClick={() => {
                        setActiveDraft(draft);
                        setIsOpen(false);
                      }}
                      className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 border-transparent cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="h-8 w-8 border border-border rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                          {draft.imageUrl ? (
                            <img
                              src={draft.imageUrl}
                              alt={draft.title || "Cover Image"}
                              className="h-full w-full object-cover"
                              decoding="async"
                            />
                          ) : (
                            <FileImage className="h-4 w-4 text-muted-foreground stroke-[2]" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                            {draft.title.trim() || "Untitled Post"}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            Edited {formatTimeAgo(draft.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => handleDelete(e, draft._id)}
                        className="cursor-pointer ml-4 h-6 w-6 md:opacity-0 md:group-hover:opacity-100 opacity-100 text-zinc-400 hover:text-red-500 transition-opacity shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Sidebar>
    </aside>
  );
}