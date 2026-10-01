"use client";

import { useRouter } from "next/navigation";
import { formatSmartDate } from "./ProfileHoverCard";
import Image from "next/image";

export interface MessageNotificationCardProps {
  _id: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "file" | null;
  content: string;
  createdAt: number;
  isUnread?: boolean;
  onNotificationClick?: () => void;
}

export default function MessageNotificationCard({
  _id,
  mediaUrl,
  mediaType,
  content,
  createdAt,
  isUnread = true,
  onNotificationClick,
}: MessageNotificationCardProps) {

  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNotificationClick?.();
    router.push(`/inbox`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group"
    >
      {isUnread && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 z-10" />
      )}
      <div className="flex-1 min-w-0 flex flex-row items-center justify-between gap-3 pr-4">
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          <div className="flex flex-row gap-2">
            {mediaUrl &&
              <div className="shrink-0">
                <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={mediaUrl}
                    alt={"Attached image"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              </div>
            }
            <h3 className="text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
              {content}
            </h3>
          </div>

          <time className="text-xs text-zinc-400">
            {formatSmartDate(createdAt, false)}
          </time>
        </div>
      </div>
    </div>
  );
}