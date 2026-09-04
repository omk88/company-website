"use client";

import { Button } from "../ui/button";
import { formatSmartDate } from "./ProfileHoverCard";
import { EMOJI_REACTIONS } from "@/app/constants/reactions";

export default function FollowerNotificationCard() {

  return (
    <div className="relative w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <div className="flex flex-row items-center gap-2.5 min-w-0">
          <div className="flex flex-row min-w-0 flex-1">
            <span className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-200 truncate">
              Europe is nice to visit!
            </span>
            <span className="ml-auto text-md">
                {EMOJI_REACTIONS[0].emoji}
                {EMOJI_REACTIONS[1].emoji}
                {EMOJI_REACTIONS[2].emoji}
                {EMOJI_REACTIONS[3].emoji}
                {EMOJI_REACTIONS[4].emoji}
            </span>
          </div>
        </div>

        <span className="text-xs text-zinc-400">
          2m ago
        </span>
      </div>
    </div>
  );
}