import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

export interface BlogPostPreview {
    _id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    tags: string[]; 
    createdAt: number;
}

interface BlogCardProps {
    post: BlogPostPreview; 
    index: number; 
}

export function BlogCard({ post, index }: BlogCardProps) {
    const isPriority = index < 3;

    const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <Link 
            href={`/insights/${post._id}`} 
            className="group flex flex-col gap-4 cursor-pointer block text-inherit no-underline"
        >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    priority={isPriority}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                />
            </div>

            <div className="text-sm text-muted-foreground font-medium">
                Taqtiq Team • {formattedDate}
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight line-clamp-2 text-foreground group-hover:underline underline-offset-4">
                    {post.title}
                </h3>
                <p className="text-muted-foreground line-clamp-3 leading-relaxed text-sm">
                    {post.subtitle}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                {post.tags && post.tags.length > 0 ? (
                    post.tags.map((tag) => (
                        <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="border px-3 py-0.5 font-semibold text-xs whitespace-nowrap"
                        >
                            {tag}
                        </Badge>
                    ))
                ) : (
                    <Badge variant="outline" className="px-3 py-0.5 text-xs text-muted-foreground">
                        General
                    </Badge>
                )}
            </div>
        </Link>
    );
}