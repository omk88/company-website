"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash, Loader2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface EditBlogButtonProps {
    blogId: string;
}

export function EditBlogButton({ blogId }: EditBlogButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter(); 
    
    const user = useQuery(api.auth.getCurrentUser);
    const userEmail = user?.email || "";
    const companyDomain = "@taqtiq.tech";
    const isCompanyUser = userEmail.endsWith(companyDomain);

    const deleteBlog = useMutation(api.blogs.deleteBlogs);

    if (!isCompanyUser) return null;

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.");
        if (!confirmed) return;

        try {
            setIsDeleting(true);
            
            await deleteBlog({ 
                blogIds: [blogId as Id<"blogs">], 
            });

            toast.success("Blog article deleted successfully!");

            try {
                const revalidateRes = await fetch("/api/revalidate", { method: "POST" });
                if (!revalidateRes.ok) {
                    console.error("Server-side tag revalidation returned an error status.");
                }
            } catch (err) {
                console.error("Background revalidation network failure:", err);
            }

            router.push("/insights"); 
            router.refresh(); 

        } catch (error) {
            console.error("Failed to delete the post:", error);
            toast.error("Something went wrong while deleting the post.");
        } finally {
            setIsDeleting(false);
        }
    };
    
    return (
        <div className="flex justify-end mb-6 gap-4">
            <Link 
                href={`/company/blog?id=${blogId}`} 
                className={buttonVariants({ variant: "default" })}
            >
                <Plus className="mr-2 h-4 w-4" /> Edit Blog
            </Link>
            
            <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {isDeleting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                    </>
                ) : (
                    <>
                        <Trash className="mr-2 h-4 w-4" /> Delete Blog
                    </>
                )}
            </Button>
        </div>
    );
}