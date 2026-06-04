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

  const backHref = blogId ? `/insights/${blogId}` : "/insights";

  return (
    <div className="space-y-6">
      <Link className={buttonVariants({ variant: "outline" })} href={backHref}>
        <ArrowLeft className="size-4 mr-2" />
        {blogId ? "Back to article" : "Back to blog page"}
      </Link>
      
      <BlogPostForm key={blogId ?? "new"} editingBlogId={blogId} />
    </div>
  );
}

export default function Blog({ searchParams }: PageProps) {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-10 w-40 bg-neutral-200 animate-pulse rounded-md" />
        
        <div className="w-full max-w-3xl mx-auto min-h-[600px] flex items-center justify-center border border-dashed rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    }>
      <AdminBlogContent searchParams={searchParams} />
    </Suspense>
  );
}