import { BlogCard, BlogPostPreview } from "./BlogCard";

interface BlogGridProps {
  initialPosts: BlogPostPreview[];
}

export function BlogGrid({ initialPosts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-y-3 mb-0 w-full">
      {initialPosts.map((post, index) => (
        <BlogCard key={post._id} post={post} index={index} />
      ))}
    </div>
  );
}