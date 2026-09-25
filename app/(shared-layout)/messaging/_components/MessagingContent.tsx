"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUpIcon, PlusIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMessageStore } from "@/stores/useMessageStore";

export default function MessagingContent() {
  const { activeConversationId, activeUserProfile } = useMessageStore();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(
    api.messaging.getMessagesByConversation,
    activeConversationId
      ? { conversationId: activeConversationId as Id<"conversations"> }
      : "skip"
  );

  const sendMessageMutation = useMutation(api.messaging.sendMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    const content = inputText.trim();
    setInputText("");

    try {
      await sendMessageMutation({
        conversationId: activeConversationId as Id<"conversations">,
        content,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeConversationId) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
        <p className="text-sm">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-sans">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 border border-border rounded-full overflow-hidden bg-muted shrink-0">
            {activeUserProfile?.avatarUrl ? (
              <img
                src={activeUserProfile.avatarUrl}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                {activeUserProfile?.displayName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {activeUserProfile?.displayName ?? "User"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              @{activeUserProfile?.username ?? "username"}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4 md:p-6 space-y-4">
            {messages?.map((msg) => {
              const isUser = msg.senderId !== activeUserProfile?.userId;

              return (
                <div
                  key={msg._id}
                  className={`w-full flex ${
                    isUser ? "justify-end" : "justify-start"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
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
                      <div className="text-sm leading-relaxed">
                        <div
                          className={`px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 ${
                            isUser
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none"
                          }`}
                        >
                          <div className="break-words">{msg.content}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 px-1 mt-0.5">
                        {new Date(msg._creationTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <footer className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="w-full relative">
          <form onSubmit={handleSendMessage} className="w-full">
            <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <div className="min-h-[56px] w-full px-4 pt-3 pb-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message... (Press Enter to send)"
                  className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100"
                  rows={2}
                />
              </div>

              <div className="flex justify-between items-center w-full px-3 pb-2 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-sm flex items-center justify-center"
                >
                  <ArrowUpIcon className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}