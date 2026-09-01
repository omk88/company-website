"use client";

import { Eye, ThumbsUp, MessageSquare } from "lucide-react";
import Image from "next/image";

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export default function BlogNotificationCard() {
  return (
    <>

        <div className="w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group">
            <div className="flex-1 min-w-0 flex flex-row items-center justify-between gap-3">
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                <h3 className="text-[13px] font-medium leading-snug text-zinc-800 group-hover:text-blue-600 line-clamp-1 transition-colors">
                    This is a test blog!
                </h3>
                
                <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-sans pt-1">
                    <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 stroke-[2] shrink-0" />
                    <span>{compactFormatter.format(4)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 stroke-[2] shrink-0" />
                    <span>{compactFormatter.format(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 stroke-[2] shrink-0" />
                    <span>{compactFormatter.format(2)}</span>
                    </div>
                </div>
                </div>

                <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                <Image
                    src={"/comp1.png"}
                    alt={"hello"}
                    fill
                    sizes="44px"
                    className="object-cover"
                />
                </div>
            </div>
        </div>
    </>
  );
}