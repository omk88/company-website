"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

const AVAILABLE_TAGS = ["Product", "Research", "Technology", "Opinion", "Tutorials"];

interface BlogPostFormProps {
    editingBlogId?: string; 
}

export default function BlogPostForm({ editingBlogId }: BlogPostFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const existingPost = useQuery(
        api.blogs.getPostById,
        editingBlogId ? { postId: editingBlogId as Id<"blogs"> } : "skip"
    );

    const createBlog = useMutation(api.blogs.createPost);
    const updateBlog = useMutation(api.blogs.updatePost);
    const generateUploadUrl = useMutation(api.blogs.generateUploadUrl);
    
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { title: "", subtitle: "", content: "", author: "", tags: [] as string[] }
    });

    useEffect(() => {
        if (existingPost) {
            reset({
                title: existingPost.title,
                subtitle: existingPost.subtitle,
                content: existingPost.content,
                author: existingPost.author,
                tags: existingPost.tags || []
            });
        }
    }, [existingPost, reset]);

    const onSubmit = async (data: any) => {
        if (data.tags.length === 0) {
            toast.error("Please select at least one tag.");
            return;
        }

        if (!editingBlogId && !selectedImage) {
            toast.error("Please upload a cover image from your computer.");
            return;
        }

        setIsLoading(true);
        try {
            let storageId = existingPost?.storageId || "";

            if (selectedImage) {
                const uploadUrl = await generateUploadUrl();
                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedImage.type },
                    body: selectedImage,
                });

                if (!result.ok) throw new Error("Failed to upload image bundle.");
                const resJson = await result.json();
                storageId = resJson.storageId;
            }

            if (editingBlogId) {
                await updateBlog({
                    postId: editingBlogId as Id<"blogs">,
                    title: data.title,
                    subtitle: data.subtitle,
                    content: data.content,
                    author: data.author,
                    tags: data.tags,
                    storageId: storageId,
                });
                toast.success("Blog article updated successfully!");
            } else {
                await createBlog({
                    title: data.title,
                    subtitle: data.subtitle,
                    content: data.content,
                    author: data.author,
                    tags: data.tags,
                    storageId: storageId,
                });
                toast.success("Blog article published successfully!");
            }

            fetch("/api/revalidate", { method: "POST" }).catch((err) => 
                console.error("Background revalidation failed:", err)
            );
            
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            reset(); 

            router.push("/insights");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Process interrupted. Image storage or database rejected entry.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{editingBlogId ? "✏️ Edit Blog Post" : "Create New Blog Post"}</CardTitle>
                <CardDescription>
                    {editingBlogId ? "Modify fields below and save changes." : "Draft and publish a new article directly to the Insights page."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-5">
                        
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "A blog title is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Blog Title</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="e.g., Web Dev Trends" type="text" disabled={isLoading} {...field} />
                                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                                </Field>
                            )}
                        />

                        <Controller
                            name="subtitle"
                            control={control}
                            rules={{ required: "A subtitle summary is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Subtitle / Summary</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="Give a brief summary..." type="text" disabled={isLoading} {...field} />
                                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                                </Field>
                            )}
                        />

                        <Controller
                            name="tags"
                            control={control}
                            render={({ field, fieldState }) => {
                                const value = field.value || [];
                                
                                const toggleTag = (tag: string) => {
                                    const newValue = value.includes(tag)
                                        ? value.filter((t) => t !== tag)
                                        : [...value, tag];
                                    field.onChange(newValue);
                                };

                                return (
                                    <Field>
                                        <FieldLabel>Article Tags (Select multiple)</FieldLabel>
                                        <Popover>
                                            <PopoverTrigger asChild disabled={isLoading}>
                                                <div className={cn(
                                                    "flex min-h-10 w-full flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer items-center justify-between",
                                                    fieldState.invalid && "border-destructive"
                                                )}>
                                                    {value.length === 0 ? (
                                                        <span className="text-muted-foreground">Select tags...</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-1">
                                                            {value.map((tag) => (
                                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <span className="text-muted-foreground text-xs">▼</span>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-2" align="start">
                                                <div className="space-y-2">
                                                    {AVAILABLE_TAGS.map((tag) => (
                                                        <div key={tag} className="flex items-center space-x-2 p-1 hover:bg-muted rounded-md cursor-pointer" onClick={() => toggleTag(tag)}>
                                                            <Checkbox 
                                                                checked={value.includes(tag)}
                                                                onCheckedChange={() => toggleTag(tag)}
                                                            />
                                                            <span className="text-sm font-medium select-none cursor-pointer">
                                                                {tag}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </Field>
                                );
                            }}
                        />

                        <Field>
                            <FieldLabel>Cover Image Asset {editingBlogId && <span className="text-muted-foreground text-xs font-normal">(Leave blank to keep existing)</span>}</FieldLabel>
                            <Input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                disabled={isLoading}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setSelectedImage(e.target.files[0]);
                                    }
                                }}
                            />
                            {selectedImage && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </Field>

                        <Controller
                            name="content"
                            control={control}
                            rules={{ required: "Blog content cannot be empty" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Article Content</FieldLabel>
                                    <textarea
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Write your post markdown here..."
                                        disabled={isLoading}
                                        rows={12}
                                        className={cn(
                                            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-y",
                                            fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                                        )}
                                        {...field}
                                    />
                                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                                </Field>
                            )}
                        />

                        <Controller
                            name="author"
                            control={control}
                            rules={{ required: "Author is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Author</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="John Doe" type="text" disabled={isLoading} {...field} />
                                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                                </Field>
                            )}
                        />
                        
                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading 
                                ? "Saving..." 
                                : editingBlogId 
                                ? "Save Changes" 
                                : "Publish Blog Post"
                            }
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}