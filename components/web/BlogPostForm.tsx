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
import { ChevronDown, Image, Paperclip, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import { FunctionReturnType } from "convex/server";
import { MarkdownTextEditor } from "./MarkdownTextEditor";

const AVAILABLE_TAGS = ["product", "research", "design", "technology", "opinion", "tutorials"];

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

export type User = FunctionReturnType<typeof api.auth.getCurrentUser>;

function toTitleCase(str: string): string {
  if (!str) return "";
  
  const minorWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 
    'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'
  ]);

  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, wordsArray) => {
      if (!word) return word;

      const isFirstWord = index === 0;
      const isLastWord = index === wordsArray.length - 1;
      const isMinor = minorWords.has(word);

      if (isFirstWord || isLastWord || !isMinor) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      return word;
    })
    .join(' ');
}

function LivePostPreview({ control, previewImage, currentUser }: { control: Control<BlogFormValues>; previewImage: string | null; currentUser: User | undefined }) {
    const formValues = useWatch({control});

    const title = formValues.title || "[TITLE]";
    const subtitle = formValues.subtitle || "[SUBTITLE]";
    const content = formValues.content || "[POST CONTENT]";
    const author = currentUser?.profile?.displayName || currentUser?.profile?.username;
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

        if (!userData) {
            console.error("No user data.");
            return;
        }

        if (data.tags.length === 0) {
            toast.error("Please select at least one tag.");
            return;
        }

        setIsLoading(true);

        const postType = userData.email?.endsWith("@taqtiq.tech") ? "team" : "community";
        
        try {
            if (!selectedImage && !existingPost?.imageUrl) {
                toast.error("Please upload a cover image from your computer.");
                return;
            }

            let storageId = existingPost?.storageId || "";

            const formattedTitle = toTitleCase(data.title);

            const options = {
                maxSizeMB: 1.0,                  
                maxWidthOrHeight: 1920,      
                useWebWorker: true,
                fileType: 'image/webp' as const,
                initialQuality: 0.85,      
            };

            if (selectedImage) {
                const compressedFile = (await imageCompression(selectedImage, options)) as File;

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
                    title: formattedTitle,
                    subtitle: data.subtitle,
                    content: data.content,
                    author: userData.userId,
                    displayName: userData.profile?.displayName,
                    username: String(userData?.username || ""),
                    tags: data.tags,
                    storageId: storageId,
                });
                toast.success("Blog article updated successfully!");
            } else {
                await createBlog({
                    title: formattedTitle,
                    subtitle: data.subtitle,
                    content: data.content,
                    author: userData?.userId || "",
                    displayName: userData.profile?.displayName,
                    username: String(userData?.username || ""),
                    tags: data.tags,
                    storageId: storageId,
                    postType: postType
                });
                toast.success("Blog article published successfully!");
            }

            try {
                await fetch("/api/revalidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tags: ["featured-blogs", "main-blogs", "morefrom-blogs", "trending-blogs"] }),
                });
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
            <div className="relative w-full border border-border rounded-md p-2 pt-5">
                <span className="absolute -top-2.5 left-3 bg-background px-1.5 text-xs font-medium text-muted-foreground">
                    Post content
                </span>
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
                                    "group flex items-center justify-between w-full h-8 px-2.5 rounded-md border border-input bg-background text-xs cursor-pointer hover:bg-accent/50 transition-colors select-none",
                                    isLoading && "opacity-50 cursor-not-allowed pointer-events-none"
                                )}
                            >
                                <span className="flex flex-row items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[85%]">
                                    <Paperclip className="h-3.5 w-3.5 shrink-0 stroke-[1.5]" />
                                    <span className="truncate">
                                        {selectedImage 
                                            ? selectedImage.name 
                                            : existingPost?.imageUrl 
                                                ? "Change cover image..." 
                                                : "Cover image..."
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
                                        className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted shrink-0 transition-colors relative z-10 cursor-pointer"
                                    >
                                        <X className="h-3.5 w-3.5 stroke-[2]" />
                                    </button>
                                )}
                            </label>
                        </Field>

                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: "A blog title is required", minLength: 6 }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <Input 
                                        aria-invalid={fieldState.invalid} 
                                        placeholder="Title" 
                                        type="text" 
                                        disabled={isLoading} 
                                        className={cn(
                                            "h-8 px-2.5 py-1 text-xs placeholder:text-xs",
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

                        <Controller
                            name="subtitle"
                            control={control}
                            rules={{ required: "A subtitle summary is required", minLength: 100 }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <Textarea 
                                        aria-invalid={fieldState.invalid} 
                                        placeholder="Summary" 
                                        rows={4} 
                                        disabled={isLoading} 
                                        className="text-xs placeholder:text-xs"
                                        {...field} 
                                    />
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
                                                "flex min-h-8 w-full flex-wrap gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs cursor-pointer items-center justify-between relative",
                                                fieldState.invalid && "border-destructive"
                                            )}>
                                                {value.length === 0 ? (
                                                    <span className="text-muted-foreground">Tags...</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-1 pr-12">
                                                        {value.map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-[11px] px-1.5 py-0 h-5 font-normal capitalize">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center space-x-1 absolute right-2.5 top-1/2 -translate-y-1/2">
                                                    {value.length > 0 && (
                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                field.onChange([]); 
                                                            }}
                                                            className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted cursor-pointer"
                                                        >
                                                            <X className="h-3 w-3 stroke-[2]" />
                                                        </button>
                                                    )}
                                                    <ChevronDown className="text-muted-foreground h-3.5 w-3.5 stroke-[2]" />
                                                </div>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-fit p-2" align="start">
                                            <div className="space-y-1">
                                                {AVAILABLE_TAGS.map((tag) => (
                                                    <div key={tag} className="flex items-center space-x-2 p-1.5 hover:bg-muted rounded-md cursor-pointer" onClick={() => toggleTag(tag)}>
                                                        <Checkbox checked={value.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                                                        <span className="text-xs font-medium select-none cursor-pointer capitalize">{tag}</span>
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
                                    <MarkdownTextEditor
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        disabled={isLoading}
                                        error={fieldState.invalid}
                                    />
                                    {fieldState.error && (
                                        <p className="text-xs text-destructive mt-1">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </Field>
                            )}
                        />

                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 p-2 w-full sm:w-auto cursor-pointer",
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
            <LivePostPreview control={control} previewImage={imagePreviewUrl} currentUser={userData}/>
        </div>
    );
}