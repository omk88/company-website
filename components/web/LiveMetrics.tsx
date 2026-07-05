import { Eye, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";

interface LiveMetricsProps {
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
}

export function LiveMetrics({ views, likes, dislikes, comments }: LiveMetricsProps) {
  return (
    <div className="flex items-center gap-4 px-6 text-sm text-muted-foreground font-mono tracking-tight select-none">
      <div className="flex items-center gap-1.5 min-w-[3.5rem]">
        <Eye className="w-4 h-4 stroke-[2.3] shrink-0" />
        <span>{views}</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-[3rem]">
        <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
        <span>{likes}</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-[3rem]">
        <ThumbsDown className="w-4 h-4 stroke-[2.3] shrink-0" />
        <span>{dislikes}</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-[3rem]">
        <MessageSquare className="w-4 h-4 stroke-[2.3] shrink-0" />
        <span>{comments}</span>
      </div>
    </div>
  );
}