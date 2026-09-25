"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";

interface MessageButtonProps {
  recipientId: string; 
}

export default function MessageButton({ recipientId }: MessageButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const startConversation = useMutation(api.messaging.getOrCreateAndStartConversation);

  const handleMessageClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const conversationId = await startConversation({
        participantId: recipientId,
        initialMessage: "Hey there!",
      });

      router.push(`/messaging/`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleMessageClick}
        disabled={isLoading}
        variant="default"
        className="cursor-pointer text-sm sm:text-xs w-full h-full box-border leading-none rounded-full font-medium transition-colors disabled:opacity-50"
      >
        {isLoading ? "Starting Chat..." : "Message"}
      </Button>
    </div>
  );
}