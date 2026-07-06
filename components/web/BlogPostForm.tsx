"use client";

import { Controller, useForm, useWatch, Control } from "react-hook-form";
import { Button } from "../ui/button";
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
import { Separator } from "../ui/separator"; 
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

const AVAILABLE_TAGS = ["Product", "Research", "Design", "Technology", "Opinion", "Tutorials"];

interface BlogFormValues {
    title: string;
    subtitle: string;
    content: string;
    author: string;
    tags: string[];
}

interface BlogPostFormProps {
    editingBlogId?: string; 
}

function LivePostPreview({ control, previewImage }: { control: Control<BlogFormValues>; previewImage: string | null }) {
    const formValues = useWatch({
        control,
    });

    const title = formValues.title || "[TITLE]";
    const subtitle = formValues.subtitle || "[SUBTITLE]";
    const content = formValues.content || "[POST CONTENT]";
    const author = formValues.author || "[AUTHOR NAME]";
    const tags = formValues.tags || [];

    return (
        <div>
            <div className="w-full py-6 px-4 sm:px-6 md:px-8">
                <div className="relative w-full h-[240px] mb-4 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border border-dashed">
                    {previewImage ? (
                        <img 
                            src={previewImage} 
                            alt="Cover preview" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center p-4">
                            <span className="text-2xl block mb-1">🖼️</span>
                            <span className="text-xs text-muted-foreground block">No Cover Uploaded</span>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col">
                    <div className="flex flex-wrap gap-1 mb-2">
                        {tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="uppercase text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 line-clamp-3">
                        {title}
                    </h1>
                    <div className="flex flex-col gap-2 mt-2">
                        <p className="text-sm text-muted-foreground">
                            Posted by <span className="font-semibold">{author}</span> on {new Date().toLocaleDateString("en-US")}
                        </p>
                        <p className="text-base text-neutral-600 dark:text-neutral-400 font-medium">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-neutral-800 dark:text-neutral-200 break-words">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>

                <Separator className="my-6" />
                <div>
                    [BLOG CTA]
                </div>
                <Separator className="my-6" />
                <div>
                    [COMMENTS]
                </div>
            </div>
        </div>
    );
}

export default function BlogPostForm({ editingBlogId }: BlogPostFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const existingPost = useQuery(
        api.blogs.getPostById,
        editingBlogId ? { postId: editingBlogId as Id<"blogs"> } : "skip"
    );

    useEffect(() => {
        if (existingPost?.imageUrl) {
            setImagePreviewUrl(existingPost.imageUrl);
        }
    }, [existingPost]);

    const createBlog = useMutation(api.blogs.createPost);
    const updateBlog = useMutation(api.blogs.updatePost);
    const generateUploadUrl = useMutation(api.blogs.generateUploadUrl);
    
    const { control, handleSubmit, reset } = useForm<BlogFormValues>({
        defaultValues: { title: "", subtitle: "", content: "", author: "", tags: [] }
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

    const onSubmit = async (data: BlogFormValues) => {
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

            try {
                await fetch("/api/revalidate", { method: "POST" });
            } catch (err) {
                console.error("Background revalidation failure:", err);
            }
            
            setSelectedImage(null);
            setImagePreviewUrl(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            reset(); 

            router.push("/insights");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Process interrupted.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full max-w-7xl mx-auto py-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="w-full">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-y-2">
                            <Field>
                                <Input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            setSelectedImage(file);
                                            setImagePreviewUrl(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </Field>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: "A blog title is required" }}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <Input aria-invalid={fieldState.invalid} placeholder="Web Dev Trends" type="text" disabled={isLoading} {...field} />
                                        {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="author"
                                control={control}
                                rules={{ required: "Author is required", maxLength: { value: 18, message: "Max 18 characters" } }}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <Input aria-invalid={fieldState.invalid} placeholder="John Doe" type="text" maxLength={18} disabled={isLoading} {...field} />
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
                                        const newValue = value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag];
                                        field.onChange(newValue);
                                    };

                                    return (
                                        <Field>
                                            <Popover>
                                                <PopoverTrigger asChild disabled={isLoading}>
                                                    <div className={cn(
                                                        "flex min-h-10 w-full flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer items-center justify-between",
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
                                                                <Checkbox checked={value.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                                                                <span className="text-sm font-medium select-none cursor-pointer">{tag}</span>
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
                                name="content"
                                control={control}
                                rules={{ required: "Blog content cannot be empty" }}
                                render={({ field, fieldState }) => (
                                    <Field className="w-full">
                                        <textarea
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Write your post markdown here..."
                                            disabled={isLoading}
                                            rows={14}
                                            className={cn(
                                                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-y min-h-[350px]",
                                                fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                                            )}
                                            {...field}
                                        />
                                        {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                                    </Field>
                                )}
                            />
                            
                            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                                {isLoading ? "Saving..." : editingBlogId ? "Save Changes" : "Publish Blog Post"}
                            </Button>
                        </FieldGroup>
                    </form>
                </div>
            <LivePostPreview control={control} previewImage={imagePreviewUrl} />
        </div>
    );
}