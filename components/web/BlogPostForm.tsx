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
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const AVAILABLE_TAGS = ["Product", "Research", "Technology", "Opinion", "Tutorials"];

export default function BlogPostForm() {
    const [isLoading, setIsLoading] = useState(false);
    const createBlog = useMutation(api.blogs.createPost);
    
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { title: "", subtitle: "", imageUrl: "", content: "", tags: [] as string[] }
    });

    const onSubmit = async (data: any) => {
        if (data.tags.length === 0) {
            toast.error("Please select at least one tag.");
            return;
        }

        setIsLoading(true);
        try {
            await createBlog({
                title: data.title,
                subtitle: data.subtitle,
                imageUrl: data.imageUrl,
                content: data.content,
                tags: data.tags,
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

                        <Controller
                            name="imageUrl"
                            control={control}
                            rules={{ required: "A cover image link is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Cover Image URL</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="https://images.unsplash.com/..." type="url" disabled={isLoading} {...field} />
                                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
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
                                        placeholder="Write your post here..."
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
                        
                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading ? "Publishing Post..." : "Publish Blog Post"}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}