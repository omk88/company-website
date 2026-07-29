"use client";

import { Controller, useForm, useWatch, Control } from "react-hook-form";
import { FieldGroup, Field } from "../ui/field";
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
import { Textarea } from "../ui/textarea";
import { Image, Paperclip, X } from "lucide-react";
import imageCompression from "browser-image-compression";

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
    const formValues = useWatch({control});

    const title = formValues.title || "[TITLE]";
    const subtitle = formValues.subtitle || "[SUBTITLE]";
    const content = formValues.content || "[POST CONTENT]";
    const author = formValues.author || "[AUTHOR NAME]";
    const tags = formValues.tags || [];

    return (
        <div>
            <div className="w-full">
                <div className="relative w-full h-[240px] mb-4 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border border-dashed">
                    {previewImage ? (
                        <img 
                            src={previewImage} 
                            alt="Cover preview" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center p-4">
                            <span className="flex justify-center text-2xl mb-1"><Image /></span>
                            <span className="text-xs text-muted-foreground block">No Cover Image Uploaded</span>
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

    const userData = useQuery(api.auth.getCurrentUser);

    const existingPost = useQuery(
        api.blogs.getBlogById,
        editingBlogId ? { blogId: editingBlogId as Id<"blogs"> } : "skip"
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

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: BlogFormValues) => {
        if (data.tags.length === 0) {
            toast.error("Please select at least one tag.");
            return;
        }

        setIsLoading(true);
        
        try {

            if (!selectedImage) {
                toast.error("Please upload a cover image from your computer.");
                return;
            }

            let storageId = existingPost?.storageId || "";

            const options = {
                maxSizeMB: 1.0,                  
                maxWidthOrHeight: 1920,      
                useWebWorker: true,
                fileType: 'image/webp' as const,
                initialQuality: 0.85,      
            };

            const compressedFile = (await imageCompression(selectedImage, options)) as File;

            if (compressedFile) {
                const uploadUrl = await generateUploadUrl();
                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": compressedFile.type },
                    body: compressedFile,
                });

                if (!result.ok) throw new Error("Failed to upload image bundle.");
                const resJson = await result.json();
                storageId = resJson.storageId;
            }

            if (editingBlogId) {
                await updateBlog({
                    blogId: editingBlogId as Id<"blogs">,
                    title: data.title,
                    subtitle: data.subtitle,
                    content: data.content,
                    author: userData?.userId || "",
                    authorName: (userData?.profile?.firstName && userData?.profile?.lastName) ? `${String(userData.profile.firstName)} ${String(userData.profile.lastName)}` : String(userData?.username || ""),
                    username: String(userData?.username || ""),
                    tags: data.tags,
                    storageId: storageId,
                });
                toast.success("Blog article updated successfully!");
            } else {
                await createBlog({
                    title: data.title,
                    subtitle: data.subtitle,
                    content: data.content,
                    author: userData?.userId || "",
                    authorName: (userData?.profile?.firstName && userData?.profile?.lastName) ? `${String(userData.profile.firstName)} ${String(userData.profile.lastName)}` : String(userData?.username || ""),
                    username: String(userData?.username || ""),
                    tags: data.tags,
                    storageId: storageId,
                    postType: "community"
                });
                toast.success("Blog article published successfully!");
            }

            try {
                await fetch("/api/revalidate", { method: "POST" });
            } catch (err) {
                console.error("Background revalidation failure:", err);
            }
            
            clearImage();
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
                        <Field className="w-full">
                            <input 
                                id="cover-image-upload"
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                disabled={isLoading}
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setSelectedImage(file);
                                        setImagePreviewUrl(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            
                            <label 
                                htmlFor="cover-image-upload"
                                className={cn(
                                    "flex items-center justify-between w-full h-10 px-3 rounded-md border border-input bg-background text-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors select-none",
                                    isLoading && "opacity-50 cursor-not-allowed pointer-events-none"
                                )}
                            >
                                <span className="flex flex-row items-center gap-2 text-muted-foreground hover:text-foreground transition-colors truncate max-w-[85%]">
                                    <Paperclip className="h-4 w-4 shrink-0 stroke-[1.5]" />
                                    <span className="truncate">
                                        {selectedImage 
                                            ? selectedImage.name 
                                            : existingPost?.imageUrl 
                                                ? "Change cover image..." 
                                                : "Choose file..."
                                        }
                                    </span>
                                </span>

                                {imagePreviewUrl && (
                                    <button 
                                        type="button" 
                                        onClick={(e) => {
                                            e.preventDefault(); 
                                            e.stopPropagation(); 
                                            clearImage();
                                        }}
                                        disabled={isLoading}
                                        className="text-muted-foreground hover:text-foreground p-1 rounded-sm hover:bg-muted shrink-0 transition-colors relative z-10"
                                    >
                                        <X className="h-4 w-4 stroke-[2]" />
                                    </button>
                                )}
                            </label>
                        </Field>

                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "A blog title is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <Input aria-invalid={fieldState.invalid} placeholder="Title" type="text" disabled={isLoading} {...field} />
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
                                    <Input aria-invalid={fieldState.invalid} placeholder="Summary" type="text" disabled={isLoading} {...field} />
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
                                                    "flex min-h-10 w-full flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer items-center justify-between relative",
                                                    fieldState.invalid && "border-destructive"
                                                )}>
                                                    {value.length === 0 ? (
                                                        <span className="text-muted-foreground">Select tags...</span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-1 pr-14">
                                                            {value.map((tag) => (
                                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-center space-x-1 absolute right-3 top-1/2 -translate-y-1/2">
                                                        {value.length > 0 && (
                                                            <button
                                                                type="button"
                                                                disabled={isLoading}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    field.onChange([]); 
                                                                }}
                                                                className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
                                                            >
                                                                <X className="h-3.5 w-3.5 stroke-[2]" />
                                                            </button>
                                                        )}
                                                        <span className="text-muted-foreground text-xs select-none">▼</span>
                                                    </div>
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
                                    <Textarea
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Post Content"
                                        disabled={isLoading}
                                        rows={10}
                                        className={cn(
                                            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-y min-h-[300px]",
                                            fieldState.invalid && "border-destructive focus-visible:ring-destructive"
                                        )}
                                        {...field}
                                    />
                                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                                </Field>
                            )}
                        />

                        <div className="flex items-center justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-10 px-4 py-2 w-full sm:w-auto",
                                    isLoading && "cursor-not-allowed opacity-70"
                                )}
                            >
                                {isLoading 
                                    ? (editingBlogId ? "Updating..." : "Publishing...") 
                                    : (editingBlogId ? "Update Post" : "Publish Post")
                                }
                            </button>
                        </div>
                        
                    </FieldGroup>
                </form>
            </div>
            <LivePostPreview control={control} previewImage={imagePreviewUrl} />
        </div>
    );
}