// @/components/web/BlogPostForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { FieldGroup, Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function BlogPostForm() {
    const [isLoading, setIsLoading] = useState(false);
    
    const createBlog = useMutation(api.blogs.createPost);
    
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { title: "", subtitle: "", imageUrl: "", content: "" }
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await createBlog({
                title: data.title,
                subtitle: data.subtitle,
                imageUrl: data.imageUrl,
                content: data.content,
            });
            
            toast.success("Blog article published successfully!");
            reset(); 
        } catch (error) {
            toast.error("Database rejected the request.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Blog Post</CardTitle>
                <CardDescription>Draft and publish a new article directly to the Insights page.</CardDescription>
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
                                    <Input 
                                        aria-invalid={fieldState.invalid} 
                                        placeholder="e.g., Maximizing Web Performance in 2026" 
                                        type="text" 
                                        disabled={isLoading}
                                        {...field}
                                    />
                                    {fieldState.error && (
                                        <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                    )}
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
                                    <Input 
                                        aria-invalid={fieldState.invalid} 
                                        placeholder="Give a brief summary sentence explaining the post hook..." 
                                        type="text" 
                                        disabled={isLoading}
                                        {...field}
                                    />
                                    {fieldState.error && (
                                        <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="imageUrl"
                            control={control}
                            rules={{ required: "A cover image link is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Cover Image URL</FieldLabel>
                                    <Input 
                                        aria-invalid={fieldState.invalid} 
                                        placeholder="https://images.unsplash.com/... or /blog-cover.jpg" 
                                        type="url" 
                                        disabled={isLoading}
                                        {...field}
                                    />
                                    {fieldState.error && (
                                        <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="content"
                            control={control}
                            rules={{ required: "Blog content cannot be empty" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Article Content</FieldLabel>
                                    <textarea
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Write the body of your blog post here..."
                                        disabled={isLoading}
                                        rows={12}
                                        className={cn(
                                            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                                            "placeholder:text-muted-foreground",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                            "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
                                            fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                                        )}
                                        {...field}
                                    />
                                    {fieldState.error && (
                                        <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                    )}
                                </Field>
                            )}
                        />
                        
                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading ? "Publishing Post..." : "Publish Blog Post"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}