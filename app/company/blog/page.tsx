import { buttonVariants } from "@/components/ui/button";
import BlogPostForm from "@/components/web/BlogPostForm";
import { verifyCompanyUser } from "@/lib/auth-guard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
    <div className="space-y-6">
      <Link className={buttonVariants({variant: "outline"})} href="/">
          <ArrowLeft className="size-4 mr-2" />
          Back to home page
      </Link>
      
      <Suspense fallback={
        <div className="w-full max-w-3xl mx-auto min-h-[600px] flex items-center justify-center border border-dashed rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground animate-pulse">Loading admin dashboard...</p>
        </div>
      }>
        <AdminBlogContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}