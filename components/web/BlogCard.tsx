import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { LiveMetrics } from "./LiveMetrics";

export interface BlogPostPreview {
  _id: string;
  title: string;
  subtitle: string;
  author: string;
  imageUrl: string;
  tags: string[]; 
  createdAt: number;
  totalViews?: number;
  likes?: number,
  dislikes?: number,
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
      className="group flex flex-col md:flex-row gap-0 cursor-pointer w-full text-inherit no-underline border border-border/50 rounded-none bg-card/70 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden"
    >
      <div className="relative aspect-video md:aspect-auto w-full md:w-2/5 min-h-[220px] overflow-hidden bg-muted border-b md:border-b-0 md:border-r border-border/50 shrink-0">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>

      <div className="flex flex-col flex-1 justify-between p-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
            {post.author} • {formattedDate}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight line-clamp-2 text-foreground transition-colors duration-200 group-hover:text-primary">
              {post.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed text-sm">
              {post.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/30">
          
          <div className="shrink-0">
            <LiveMetrics postId={post._id} initialViews={post.totalViews} initialLikes={post.likes} initialDislikes={post.dislikes} />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {post.tags && post.tags.length > 0 ? (
              post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">General</Badge>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}