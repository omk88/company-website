"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import { toast } from "sonner";

interface MessageButtonProps {
  recipientId: string; 
}

export default function MessageButton({ recipientId }: MessageButtonProps) {
  const router = useRouter();
  
  const startConversation = useMutation(api.messaging.getOrCreateAndStartConversation);

  const currentUser = useCurrentUser();

  const handleMessageClick = async () => {
    if (!currentUser) {
        toast.error("You must be logged in to message another user.", {
            action: {
                label: "Sign in",
                onClick: () => router.push("/sign-in"),
            },
        });
        return;
    }

    try {
      const conversationId = await startConversation({
        participantId: recipientId
      });

      router.push(`/inbox/`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleMessageClick}
        variant="default"
        className="cursor-pointer text-sm sm:text-xs w-full h-full box-border leading-none rounded-full font-medium transition-colors disabled:opacity-50"
      >
        Message
      </Button>
    </div>
  );
}