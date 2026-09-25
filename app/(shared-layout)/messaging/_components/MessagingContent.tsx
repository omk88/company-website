"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  PlusIcon, 
  Sparkles 
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'assistant' | 'user';
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    content: "Hello! How can I help you build your layout today?",
    sender: "assistant",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    content: "I need help structuring my full-screen UI layout.",
    sender: "user",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    content: "Sure! A common pattern is using a flexbox container with `h-full` and `flex-col`, and ensuring child message wrappers use flex alignment (`justify-end` or `justify-start`).",
    sender: "assistant",
    timestamp: "10:02 AM",
  },
  {
    id: "4",
    content: "That worked perfectly! The messages are now aligned properly to the left and right sides.",
    sender: "user",
    timestamp: "10:03 AM",
  }
];

function Message({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-1 max-w-[80%] ${className}`}>{children}</div>;
}

function MessageContent({ children }: { children: React.ReactNode }) {
  return <div className="text-sm leading-relaxed">{children}</div>;
}

function Bubble({ variant = "default", children }: { variant?: "default" | "secondary"; children: React.ReactNode }) {
  const baseStyles = "px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200";
  const variants = {
    default: "bg-blue-600 text-white rounded-br-none hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500",
    secondary: "bg-slate-100 text-slate-800 rounded-bl-none hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/50"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </div>
  );
}

function BubbleContent({ children }: { children: React.ReactNode }) {
  return <div className="break-words">{children}</div>;
}

export default function MessagingContent() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${userMessage.content}". Let me know if you need any further customization!`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-sans">
      
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 border border-border rounded-full overflow-hidden bg-muted shrink-0">
                <img
                    src={"/noimage.png"}
                    alt="profile"
                    className="h-full w-full object-cover"
                    decoding="async"
                />
            </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">Username</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              @username
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4 md:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Message className={isUser ? 'items-end' : 'items-start'}>
                      <MessageContent>
                        <Bubble variant={isUser ? "default" : "secondary"}>
                          <BubbleContent>
                            {msg.content}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                      <span className="text-[10px] text-slate-400 px-1 mt-0.5">
                        {msg.timestamp}
                      </span>
                    </Message>
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
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button> 
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-all shadow-sm flex items-center justify-center"
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