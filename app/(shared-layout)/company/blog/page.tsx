import BlogPostForm from "@/components/web/BlogPostForm";
import { verifyCompanyUser } from "@/lib/auth-guard";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Blog({ searchParams }: PageProps) {
  await verifyCompanyUser(); 
  
  const resolvedParams = await searchParams;
  const blogId = typeof resolvedParams.id === "string" ? resolvedParams.id : undefined;

  return (
    <div className="bg-white dark:bg-zinc-900">
      <BlogPostForm key={blogId ?? "new"} editingBlogId={blogId} />
    </div>
  );
}