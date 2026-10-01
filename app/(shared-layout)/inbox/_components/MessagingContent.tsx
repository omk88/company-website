"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpIcon,
  PlusIcon,
  Loader2,
  MessageSquare,
  X,
  Download,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMessageStore } from "@/stores/useMessageStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function MessagingContentSkeleton() {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-sans">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 p-1.5 px-3 -ml-1.5 min-w-0">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5 min-w-0">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 relative bg-white dark:bg-slate-900">
        <ScrollArea className="h-full w-full">
          <div className="p-4 md:p-6 space-y-4">
            <div className="w-full flex justify-start">
              <div className="flex gap-2.5 max-w-[85%] flex-row">
                <div className="flex flex-col gap-1 items-start">
                  <Skeleton className="h-12 w-48 rounded-2xl rounded-bl-none" />
                  <Skeleton className="h-2.5 w-12 mt-0.5" />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end">
              <div className="flex gap-2.5 max-w-[85%] flex-row-reverse">
                <div className="flex flex-col gap-1 items-end">
                  <Skeleton className="h-16 w-64 rounded-2xl rounded-br-none" />
                  <Skeleton className="h-2.5 w-12 mt-0.5" />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-start">
              <div className="flex gap-2.5 max-w-[85%] flex-row">
                <div className="flex flex-col gap-1 items-start">
                  <Skeleton className="h-10 w-36 rounded-2xl rounded-bl-none" />
                  <Skeleton className="h-2.5 w-12 mt-0.5" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <footer className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="w-full">
          <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 p-3 gap-3">
            <Skeleton className="h-10 w-full bg-slate-100 dark:bg-slate-800" />
            <div className="flex justify-between items-center w-full pt-1">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EmptyMessagingState() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 p-6 text-center">
      <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
        <MessageSquare className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        No conversation selected
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
        Choose a conversation from your list or start a new one to begin messaging.
      </p>
    </div>
  );
}

function MessageImage({
  storageId,
  onUrlResolved,
}: {
  storageId: Id<"_storage">;
  onUrlResolved?: (url: string) => void;
}) {
  const imageUrl = useQuery(api.messaging.getMediaUrl, { storageId });

  useEffect(() => {
    if (imageUrl && onUrlResolved) {
      onUrlResolved(imageUrl);
    }
  }, [imageUrl, onUrlResolved]);

  if (!imageUrl) {
    return <Skeleton className="h-48 w-64 rounded-2xl" />;
  }

  return (
    <img
      src={imageUrl}
      alt="Attachment"
      className="max-h-60 max-w-full rounded-2xl object-cover"
    />
  );
}

interface MessageItemProps {
  msg: {
    _id: Id<"messages">;
    _creationTime: number;
    senderId: string;
    mediaUrl?: string;
    content?: string;
  };
  currentUserId?: string;
}

function MessageItem({ msg, currentUserId }: MessageItemProps) {
  const isUser = msg.senderId !== currentUserId;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `image-${msg._id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-2.5 max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex flex-col gap-1 max-w-[80%] ${
            isUser ? "items-end" : "items-start"
          }`}
        >
          {msg.mediaUrl && (
            <div className="group relative -p-2 p-2 w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-opacity hover:opacity-95">
                    <MessageImage
                      storageId={msg.mediaUrl as Id<"_storage">}
                      onUrlResolved={(url) => setImageUrl(url)}
                    />
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-[90vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] w-auto h-auto p-0 border-none bg-transparent shadow-none flex items-center justify-center overflow-visible">
                  <DialogTitle className="sr-only">
                    Full Resolution Image
                  </DialogTitle>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Full resolution attachment"
                      className="max-h-[85vh] max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl"
                    />
                  ) : (
                    <Skeleton className="h-96 w-96 rounded-2xl" />
                  )}
                </DialogContent>
              </Dialog>

              <div className="flex items-center justify-between w-full mt-1 px-1 text-[10px] text-slate-400">
                <div className="flex items-center h-7">
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => handleDownload(imageUrl)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-100 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded cursor-pointer"
                      title="Download image"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <span>
                  {new Date(msg._creationTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          )}

          {msg.content && (
            <div className="text-sm leading-relaxed">
              <div
                className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 ${
                  isUser
                    ? "bg-black dark:bg-slate-900 text-white rounded-br-none"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none"
                }`}
              >
                <div className="break-words">{msg.content}</div>
              </div>
              <span className="text-[10px] text-slate-400 px-1 mt-0.5 block">
                {new Date(msg._creationTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagingContent() {
  const { activeConversationId, activeUserProfile } = useMessageStore();
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);

  const messages = useQuery(
    api.messaging.getMessagesByConversation,
    activeConversationId
      ? { conversationId: activeConversationId as Id<"conversations"> }
      : "skip"
  );

  const generateUploadUrl = useMutation(api.messaging.generateUploadUrl);
  const sendMessageMutation = useMutation(api.messaging.sendMessage);

  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [activeConversationId]);

  useLayoutEffect(() => {
    if (!messages || messages.length === 0) return;

    if (isInitialLoadRef.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "instant" as ScrollBehavior,
      });
      isInitialLoadRef.current = false;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (
      (!inputText.trim() && !selectedImage) ||
      !activeConversationId ||
      isUploading
    )
      return;

    const content = inputText.trim();
    setIsUploading(true);

    try {
      let storageId: Id<"_storage"> | undefined = undefined;

      if (selectedImage) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });

        const { storageId: uploadedId } = await response.json();
        storageId = uploadedId;
      }

      await sendMessageMutation({
        conversationId: activeConversationId as Id<"conversations">,
        content,
        mediaUrl: storageId,
        mediaType: storageId ? "image" : undefined,
      });

      setInputText("");
      clearSelectedImage();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeConversationId) {
    return <EmptyMessagingState />;
  }

  if (messages === undefined) {
    return <MessagingContentSkeleton />;
  }

  const username = activeUserProfile?.username || "";
  const displayName = activeUserProfile?.displayName || username || "User";

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-sans">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
        <Link
          href={`/${username}`}
          className="group flex items-center gap-3 p-1.5 px-3 -ml-1.5 rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer min-w-0"
        >
          <div className="h-10 w-10 border border-border rounded-full overflow-hidden bg-muted shrink-0">
            {activeUserProfile?.avatarUrl ? (
              <img
                src={activeUserProfile.avatarUrl}
                alt={username || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                {(displayName[0] ?? "?").toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 truncate leading-tight group-hover:text-accent-foreground">
              {displayName}
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 group-hover:text-accent-foreground/80 truncate mt-0.5">
              @{username}
            </p>
          </div>
        </Link>
      </header>

      <div className="flex-1 min-h-0 relative bg-white dark:bg-slate-900">
        <ScrollArea className="h-full w-full">
          <div className="p-4 md:p-6 space-y-4">
            {messages.map((msg) => (
              <MessageItem
                key={msg._id}
                msg={msg}
                currentUserId={activeUserProfile?.userId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <footer className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="w-full relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <form onSubmit={handleSendMessage} className="w-full">
            <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 transition-all">
              {imagePreview && (
                <div className="p-3 pb-0 relative inline-block max-w-fit">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={imagePreview}
                      alt="Selected Attachment"
                      className="h-20 w-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="min-h-[56px] w-full px-4 pt-3 pb-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
                  rows={2}
                />
              </div>

              <div className="flex justify-between items-center w-full px-3 pb-2 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>

                <Button
                  type="submit"
                  variant={"default"}
                  disabled={
                    (!inputText.trim() && !selectedImage) || isUploading
                  }
                  className="h-9 w-9 cursor-pointer rounded-full p-0 disabled:opacity-40 text-white transition-all flex items-center justify-center shrink-0"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUpIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}