"use client";

export interface CommentNotificationCardProps {
  _id: string;
  blogId: string;
  title: string;
  body: string;
  createdAt: number;
  isUnread?: boolean;
}

export default function CommentNotificationCard({
  _id,
  blogId,
  title,
  body,
  createdAt,
  isUnread = true,
}: CommentNotificationCardProps) {
  return (
    <div className="relative w-full flex flex-row items-center gap-3 p-2 rounded-lg bg-zinc-50/80 hover:bg-accent transition-colors cursor-pointer group">
      <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500" />

      <div className="flex-1 min-w-0 flex flex-row items-center justify-between gap-3 pr-4">
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
          <h3 className="text-[13px] font-medium leading-snug text-zinc-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
            Great, blog post. I really enjoyed reading about your explaination of the Next.js app router.
          </h3>

          <div>
            <span className="text-xs text-muted-foreground">2m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}