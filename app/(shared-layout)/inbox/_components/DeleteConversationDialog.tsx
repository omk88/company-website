import { TriangleAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMessageStore } from "@/stores/useMessageStore";


interface DeleteConversationDialogProps {
    conversationId: Id<"conversations">;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DeleteConversationDialog({ 
    conversationId, 
    trigger, 
    open: controlledOpen, 
    onOpenChange: setControlledOpen, 
    onSuccess 
}: DeleteConversationDialogProps) {

    const clearStore = useMessageStore((state) => state.clearStore);

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
    
    const deleteConversationMutation = useMutation(api.messaging.deleteConversation);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteConversationMutation({ conversationId });
            toast.error("Conversation deleted successfully.");
            clearStore();
            handleOpenChange(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Error deleting conversation.");
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
              {"Delete conversation?"}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-4 py-4">
              <TriangleAlert className="size-12 md:size-10 shrink-0 text-yellow-500" />
              <span className="text-lg md:text-sm">
                {"Are you sure you want to delete this conversation? This action cannot be undone and will permanently remove this conversation and all of its messages."}
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
                  "Delete conversation"
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