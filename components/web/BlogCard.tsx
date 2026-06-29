import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface BlogPostPreview {
  _id: string;
  title: string;
  subtitle: string;
  author: string;
  imageUrl: string;
  tags: string[]; 
  createdAt: number;
}

interface BlogCardProps {
  post: BlogPostPreview; 
  index: number; 
}

export function BlogCard({ post }: BlogCardProps) {

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <Link 
      href={`/insights/${post._id}`} 
      className="group flex flex-col gap-4 cursor-pointer w-full h-full text-inherit no-underline border border-border/50 rounded-none bg-card/70 backdrop-blur-md shadow-md shadow-black/5 dark:shadow-black/40 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60 transition-all duration-300 ease-out hover:-translate-y-1"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/50 shrink-0">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex items-center gap-4 px-6">
        <h1 className="font-mono flex items-center justify-start gap-1 text-base md:text-s text-muted-foreground tracking-tight">
          <Eye className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
          <span>167</span>
        </h1>

        <h1 className="font-mono flex items-center justify-start gap-1 text-base md:text-s text-muted-foreground tracking-tight">
          <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
          <span>34</span>
        </h1>

        <h1 className="font-mono flex items-center justify-start gap-1 text-base md:text-s text-muted-foreground tracking-tight">
          <ThumbsDown className="w-4 h-4 stroke-[2.3] shrink-0 text-muted-foreground" />
          <span>7</span>
        </h1>
      </div>

      <div className="px-6 pt-2 text-xs font-mono uppercase tracking-wider text-muted-foreground shrink-0">
        {post.author} • {formattedDate}
      </div>

      <div className="px-6 space-y-2 flex-grow flex flex-col justify-start">
        <h3 className="text-xl font-bold tracking-tight line-clamp-2 text-foreground transition-colors duration-200 group-hover:text-primary">
          {post.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm">
          {post.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 px-6 pb-6 pt-2 shrink-0">
        {post.tags && post.tags.length > 0 ? (
          post.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
            >
              {tag}
            </Badge>
          ))
        ) : (
          <Badge variant="outline">
            General
          </Badge>
        )}
      </div>
    </Link>
  );
}