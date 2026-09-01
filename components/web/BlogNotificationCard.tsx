"use client";

import Image from "next/image";

export default function BlogNotificationCard() {
  return (
    <div className="w-full flex flex-col p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group">
      <div className="flex-1 min-w-0 flex flex-row justify-between gap-3">
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-[13px] font-medium leading-snug text-zinc-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
            This is a test blog! It's being used to test the UI!
          </h3>
        </div>

        <div className="relative shrink-0">
          <div className="relative w-11 h-11 overflow-hidden rounded-lg bg-zinc-100">
            <Image
              src={"/comp1.png"}
              alt={"hello"}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>

          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
        </div>
      </div>
      
      <div>
        <span className="text-xs text-muted-foreground">10m ago</span>
      </div>
    </div>
  );
}