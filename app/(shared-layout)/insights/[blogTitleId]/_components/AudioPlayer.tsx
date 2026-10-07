"use client";

import { useState } from "react";
import { Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogNarrationControls } from "@/components/web/BlogNarrationControls";

interface AudioPlayerProps {
  audioUrl?: string;
  title?: string;
}

export function AudioPlayer({ audioUrl, title = "Listen to article" }: AudioPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!audioUrl) return null;

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Audio Version
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {title}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="gap-2 rounded-full px-4"
          variant="default"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>Listen</span>
        </Button>
      </div>

      {isOpen && (
        <BlogNarrationControls
          audioUrl={audioUrl}
          title={title}
          autoPlay={true}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}