import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export interface BlogPost {
    id: string;
    author: string;
    date: string;
    imageSrc: string;
    title: string;
    description: string;
    tags: string[];
}

interface BlogCardProps {
    post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-video w-full overflow-hidden border-black bg-gray-100">
                <Image
                    src={post.imageSrc} 
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                />
            </div>

            <div className="text-sm text-gray-500 font-medium">
                {post.author} • {post.date}
            </div>

            <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight hover:underline cursor-pointer">
                    {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                    {post.description}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                    <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="border-2 px-3 py-1 font-semibold text-xs"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    );
}