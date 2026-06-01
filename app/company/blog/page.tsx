import BlogPostForm from "@/components/web/BlogPostForm";
import { verifyCompanyUser } from "@/lib/auth-guard";
import { Suspense } from "react";

async function AdminBlogContent() {
  await verifyCompanyUser(); 
  return <BlogPostForm />;
}

export default function Blog() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading admin dashboard...</div>}>
      <AdminBlogContent />
    </Suspense>
  );
}