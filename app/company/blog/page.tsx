import BlogPostForm from "@/components/web/BlogPostForm";
import { verifyCompanyUser } from "@/lib/auth-guard";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function AdminBlogContent({ searchParams }: { searchParams: PageProps["searchParams"] }) {
  await verifyCompanyUser(); 
  
  const resolvedParams = await searchParams;
  const blogId = typeof resolvedParams.id === "string" ? resolvedParams.id : undefined;

  return <BlogPostForm editingBlogId={blogId} />;
}

export default function Blog({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading admin dashboard...</div>}>
      <AdminBlogContent searchParams={searchParams} />
    </Suspense>
  );
}