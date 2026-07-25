import { TriangleAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface DeleteBlogDialogProps {
    blogIds: Id<"blogs">[];
    trigger?: React.ReactNode;
    onSuccess?: () => void;
}

export function DeleteBlogDialog({ blogIds, trigger, onSuccess }: DeleteBlogDialogProps) {

    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const deleteBlogMutation = useMutation(api.blogs.deleteBlogs);

    const isMultiple = blogIds.length > 1;

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteBlogMutation({ blogIds });
            toast.success( isMultiple ? `${blogIds.length} blogs successfully deleted.` : "Blog successfully deleted.");
            setIsOpen(false);
            onSuccess?.();
        } catch (error) {
            toast.error(isMultiple ? "Failed to delete blogs." : "Failed to delete blog.");
            setIsDeleting(false);
        }
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        { trigger && <DialogTrigger asChild>{trigger}</DialogTrigger> }
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="gap-1">
            <DialogTitle>
              {isMultiple ? `Delete ${blogIds.length} blog posts?` : "Delete blog post?"}
            </DialogTitle>
            <DialogDescription className="flex flex-cols gap-4 p-4">
                <TriangleAlert className="w-20 h-20 text-yellow-500" />
                <span>
                  {isMultiple
                    ? `Are you sure you want to delete these ${blogIds.length} blogs? This action cannot be undone and will permanently remove these posts and all of their comments.`
                    : "Are you sure you want to delete this blog? This action cannot be undone and will permanently remove this post and all of its comments."
                  }
                </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-4">
            <Button
              type="button"
              disabled={isDeleting}
              onClick={() => handleDelete()}
              className={`w-full sm:w-auto gap-2 transition-colors hover:bg-red-700 hover:text-white ${
                isDeleting 
                  ? "bg-red-700 text-white" 
                  : ""
              }`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                isMultiple ? `Delete ${blogIds.length} blogs` : "Delete blog"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
}