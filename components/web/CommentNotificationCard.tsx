"use client";

import { Eye, ThumbsUp, MessageSquare } from "lucide-react";
import Image from "next/image";

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export default function CommentNotificationCard() {
  return (
    <>

        <div className="w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group">
            <div className="flex-1 min-w-0 flex flex-row items-center justify-between gap-3">
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <h3 className="text-[13px] font-medium leading-snug text-zinc-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
                        Great, blog post. I really enjoyed reading about your explaination of the Next.js app router.
                    </h3>
                
                </div>
            </div>
        </div>
    </>
  );
}