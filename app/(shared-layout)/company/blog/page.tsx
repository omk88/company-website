import BlogPostForm from "@/components/web/BlogPostForm";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Blog({ searchParams }: PageProps) {
  
  const resolvedParams = await searchParams;
  const blogId = typeof resolvedParams.id === "string" ? resolvedParams.id : undefined;

  return (
    <div className="bg-white dark:bg-zinc-900 min-h-screen flex flex-col">
      <BlogPostForm key={blogId ?? "new"} editingBlogId={blogId} />
    </div>
  );
}