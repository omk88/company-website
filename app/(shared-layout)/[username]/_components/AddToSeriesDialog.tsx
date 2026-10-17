"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FolderPlus } from "lucide-react";
import { CreateSeriesDialog } from "./CreateSeriesDialog";

interface AddToSeriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: Doc<"blogs">["_id"]; 
  authorId: string;
}

export function AddToSeriesDialog({
  open,
  onOpenChange,
  articleId,
  authorId,
}: AddToSeriesDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const seriesList = useQuery(api.series.getSeriesWithArticleCounts, { author: authorId });
  const addToSeries = useMutation(api.series.addArticleToSeries);

  const handleAdd = async (seriesId: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await addToSeries({ seriesId, articleId });
      setSuccessMessage("Added to series successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
        onOpenChange(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to add article to series.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to Series</DialogTitle>
            <DialogDescription>
              Select an existing series to add this article to, or create a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 flex flex-col gap-3">
            {seriesList === undefined ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            ) : seriesList.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl gap-3">
                <FolderPlus className="h-10 w-10 text-zinc-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">No series found</p>
                  <p className="text-xs text-zinc-500">You haven't created any article series yet.</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-1.5 mt-1"
                >
                  <Plus className="h-4 w-4" />
                  Create Series
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">Your Series</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-blue-600 hover:text-blue-700 p-0"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Series
                  </Button>
                </div>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                  {seriesList.map((series) => (
                    <div
                      key={series._id}
                      className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="text-sm font-bold truncate text-foreground">{series.title}</span>
                        <span className="text-xs text-zinc-400">
                          {series.articleCount} {series.articleCount === 1 ? 'article' : 'articles'}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs shrink-0 gap-1"
                        disabled={isSubmitting}
                        onClick={() => handleAdd(series._id)}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>Add</>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {successMessage && <p className="text-xs text-emerald-500 mt-1">{successMessage}</p>}
          </div>
        </DialogContent>
      </Dialog>

      <CreateSeriesDialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={(newSeriesId) => {
          handleAdd(newSeriesId);
        }}
      />
    </>
  );
}