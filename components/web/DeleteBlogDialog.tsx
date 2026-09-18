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
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DeleteBlogDialog({ 
    blogIds, 
    trigger, 
    open: controlledOpen, 
    onOpenChange: setControlledOpen, 
    onSuccess 
}: DeleteBlogDialogProps) {

    const [isDeleting, setIsDeleting] = useState(false);
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const handleOpenChange = (openState: boolean) => {
        if (!isControlled) {
            setInternalOpen(openState);
        }
        setControlledOpen?.(openState);
    };
    
    const deleteBlogMutation = useMutation(api.blogs.deleteBlogs);
    const isMultiple = blogIds.length > 1;

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteBlogMutation({ blogIds });
            toast.success(isMultiple ? `${blogIds.length} blogs successfully deleted.` : "Blog successfully deleted.");
            handleOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error(isMultiple ? "Failed to delete blogs." : "Failed to delete blog.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        { trigger && <DialogTrigger asChild>{trigger}</DialogTrigger> }
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-xl md:text-sm">
              {isMultiple ? `Delete ${blogIds.length} blog posts?` : "Delete blog post?"}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4 py-4">
              <TriangleAlert className="size-12 md:size-10 shrink-0 text-yellow-500" />
              <span className="text-lg md:text-sm">
                {isMultiple
                  ? `Are you sure you want to delete these ${blogIds.length} blogs? This action cannot be undone and will permanently remove these posts and all of their comments.`
                  : "Are you sure you want to delete this blog? This action cannot be undone and will permanently remove this post and all of its comments."
                }
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <div className="w-full flex flex-row items-center gap-4">
              <Button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className={`w-fit text-lg md:text-xs sm:w-auto gap-2 transition-colors hover:bg-red-700 hover:text-white cursor-pointer ${
                  isDeleting ? "bg-red-700 text-white" : ""
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
                onClick={() => handleOpenChange(false)}
                disabled={isDeleting}
                className="w-fit sm:w-auto cursor-pointer text-lg md:text-xs"
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}