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
  
  const startConversation = useMutation(api.messaging.getOrCreateAndStartConversation);

  const handleMessageClick = async () => {

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