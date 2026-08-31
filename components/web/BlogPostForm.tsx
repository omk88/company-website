"use client";

import { Controller, useForm, useWatch, Control } from "react-hook-form";
import { FieldGroup, Field } from "../ui/field";
import { toast } from "sonner";
import { useState, useRef, useEffect, useMemo, memo, useDeferredValue } from "react";
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
import { AlertCircle, Check, ChevronDown, Image, Loader2, Paperclip, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import { FunctionReturnType } from "convex/server";
import { MarkdownTextEditor } from "./MarkdownTextEditor";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import { TAGS } from "@/app/constants/tags";
import z from "zod";

import { CodeBlock } from "./CodeBlock";
import rehypeHighlight from "rehype-highlight";
import { createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";

const lowlight = createLowlight();
lowlight.register("javascript", js);
lowlight.register("js", js);
lowlight.register("typescript", ts);
lowlight.register("ts", ts);


interface BlogFormValues {
    title: string;
    subtitle: string;
    content: string;
    author: string;
    tags: string[];
    coverImage?: File | string | null;
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

const MemoizedMarkdown = memo(function MemoizedMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-neutral-800 dark:text-neutral-200 break-words">
        <ReactMarkdown
            rehypePlugins={[[rehypeHighlight, { lowlight }]]}
            components={{ pre: CodeBlock }}
        >
            {content}
        </ReactMarkdown>
    </div>
  );
});

export const LivePostPreview = memo(function LivePostPreview({
  control,
  previewImage,
}: {
  control: Control<BlogFormValues>;
  previewImage: string | null;
}) {
  const title = useWatch({ control, name: "title" }) || "";
  const subtitle = useWatch({ control, name: "subtitle" }) || "";
  const content = useWatch({ control, name: "content" }) || "";

  const deferredContent = useDeferredValue(content);

  const formattedTitle = title ? toTitleCase(title) : "";
  const currentUser = useCurrentUser();

  const authorName =
    currentUser?.profile?.displayName ||
    currentUser?.profile?.username ||
    "User";

  const profilePic =
    currentUser?.profile?.profilePicUrl || currentUser?.profile?.defaultProfilePic;

  const currentDate = useMemo(() => {
    const formatted = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, []);

  const readTime = useMemo(() => {
    if (!content.trim()) return "0 sec read";

    const plainText = content
      .replace(/<[^>]*>/g, " ")
      .replace(/[#*`_~[\]()]/g, " ");

    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    const totalSeconds = Math.ceil((words / 200) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return minutes < 1 ? `${seconds} sec read` : `${minutes} min read`;
  }, [content]);

  return (
    <div>
      <div className="w-full">
        <div className="relative w-full h-[240px] mb-2 overflow-hidden rounded-lg flex items-center justify-center border bg-zinc-50 dark:bg-zinc-900">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground">
              <Image className="h-6 w-6 stroke-[1.5]" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 font-normal my-4">
          <div className="flex items-center gap-2">
            {profilePic ? (
              <img
                src={profilePic}
                alt={authorName}
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0 flex items-center justify-center text-[10px] font-bold">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}

            <span>{authorName}</span>
            <span>&middot;</span>
            <span>{currentDate}</span>
          </div>

          <span className="text-xs sm:text-sm text-zinc-500 font-medium">
            {readTime}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 line-clamp-3">
            {formattedTitle}
          </h1>
          {subtitle && (
            <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {deferredContent.trim() && <Separator className="my-4" />}

        <MemoizedMarkdown content={deferredContent} />
      </div>
    </div>
  );
});

export default function BlogPostForm({ editingBlogId }: BlogPostFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userData = useCurrentUser();

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
    
    const { control, handleSubmit, clearErrors, formState: { errors }, reset } = useForm<BlogFormValues>({
        defaultValues: { title: "", subtitle: "", content: "", author: "", tags: [], coverImage: null, }
    });

    const errorCount = Object.keys(errors).length;
    const hasErrors = errorCount > 0;

    useEffect(() => {
        if (existingPost) {
            reset({
                title: existingPost.title,
                subtitle: existingPost.subtitle,
                content: existingPost.content,
                author: existingPost.author,
                tags: existingPost.tags || [],
                coverImage: existingPost.imageUrl || null,
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

    const getCounterColor = (length: number) => {
        if (length < 50) return "text-destructive";
        if (length < 100) return "text-amber-500 dark:text-amber-400";
        return "text-emerald-500 dark:text-emerald-400";
    };

    const onSubmit = async (data: BlogFormValues) => {
        if (!userData?.userId) {
            toast.error("User session not found. Please log in.");
            return;
        }

        const hasExistingImage = Boolean(existingPost?.imageUrl);
        if (!selectedImage && !hasExistingImage) {
            toast.error("Please upload a cover image from your computer.");
            return;
        }

        setIsLoading(true);

        const postType = userData.email?.endsWith("@taqtiq.tech") ? "team" : "community";

        try {
            let storageId = existingPost?.storageId || "";
            const formattedTitle = toTitleCase(data.title);

            if (selectedImage) {
            const options = {
                maxSizeMB: 1.0,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: "image/webp" as const,
                initialQuality: 0.85,
            };

            const compressedFile = (await imageCompression(selectedImage, options)) as File;
            const uploadUrl = await generateUploadUrl();

            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": compressedFile.type },
                body: compressedFile,
            });

            if (!result.ok) throw new Error("Failed to upload image bundle.");

            const resJson = await result.json();
            const responseSchema = z.object({ storageId: z.string() });
            const parsedResponse = responseSchema.parse(resJson);

            storageId = parsedResponse.storageId;
            }

            if (editingBlogId) {
                await updateBlog({
                    blogId: editingBlogId as Id<"blogs">,
                    title: formattedTitle,
                    subtitle: data.subtitle,
                    content: data.content,
                    author: userData.userId,
                    displayName: userData.profile?.displayName,
                    username: String(userData?.profile?.username || ""),
                    tags: data.tags,
                    storageId: storageId,
                });
                toast.success("Blog article updated successfully!");
            } else {
                await createBlog({
                    title: formattedTitle,
                    subtitle: data.subtitle,
                    content: data.content,
                    author: userData.userId,
                    displayName: userData.profile?.displayName,
                    username: userData?.profile?.username || "",
                    authorAvatarUrl: userData.profile?.profilePicUrl || undefined,
                    tags: data.tags,
                    storageId: storageId,
                    postType: postType,
                });
                toast.success("Blog article published successfully!");
            }

            try {
                await fetch("/api/revalidate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    tags: ["featured-blogs", "main-blogs", "morefrom-blogs", "trending-blogs"],
                    }),
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
            toast.error(error instanceof Error ? error.message : "Process interrupted.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full h-[calc(100vh-4rem)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch h-full overflow-hidden">
                <div className="py-4 px-4 sm:px-6 h-full overflow-y-auto [scrollbar-gutter:stable] min-h-0 w-full">
                    <div
                        className={cn(
                        "relative w-full rounded-md border p-2 my-auto transition-colors",
                        hasErrors ? "border-destructive" : "border-border"
                        )}
                    >
                        <span
                            className={cn(
                                "absolute -top-2.5 left-3 bg-background px-1.5 text-xs font-medium transition-colors",
                                hasErrors ? "text-destructive" : "text-muted-foreground"
                            )}
                        >
                            Post content
                        </span>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FieldGroup className="gap-y-2">
                                <Controller
                                    name="coverImage"
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            if (value || existingPost?.imageUrl) return true;
                                            return "A cover image is required";
                                        },
                                    }}
                                    render={({ field, fieldState }) => {
                                        const isInvalid = fieldState.invalid;
                                        const errorMessage = fieldState.error?.message;

                                        return (
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
                                                        field.onChange(file);
                                                        }
                                                    }}
                                                />

                                                <div className="relative flex items-center w-full">
                                                    <label
                                                        htmlFor="cover-image-upload"
                                                        className={cn(
                                                        "group flex items-center justify-between w-full h-8 pl-2.5 pr-8 rounded-md border border-input bg-background text-xs cursor-pointer hover:bg-accent/50 transition-all select-none relative",
                                                        "has-[button:hover]:bg-background",
                                                        !isInvalid &&
                                                            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-transparent",
                                                        isInvalid &&
                                                            "border-destructive focus-within:ring-2 focus-within:ring-destructive focus-within:ring-offset-2 focus-within:border-transparent",
                                                        isLoading && "opacity-50 cursor-not-allowed pointer-events-none"
                                                        )}
                                                    >
                                                        <span className="flex flex-row items-center gap-1.5 text-muted-foreground group-hover:text-foreground group-has-[button:hover]:text-muted-foreground transition-colors truncate max-w-[75%]">
                                                            <Paperclip className="h-3.5 w-3.5 shrink-0 stroke-[1.5]" />
                                                            <span className="truncate">
                                                                {selectedImage
                                                                ? selectedImage.name
                                                                : existingPost?.imageUrl
                                                                ? "Change cover image..."
                                                                : "Cover image..."}
                                                            </span>
                                                        </span>

                                                        {imagePreviewUrl && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                clearImage();
                                                                field.onChange(null);
                                                                }}
                                                                disabled={isLoading}
                                                                className={cn(
                                                                "text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted shrink-0 transition-colors relative z-10 cursor-pointer absolute",
                                                                errorMessage ? "right-7" : "right-2"
                                                                )}
                                                                title="Remove image"
                                                            >
                                                                <X className="h-3.5 w-3.5 stroke-[2]" />
                                                            </button>
                                                        )}
                                                    </label>

                                                    {errorMessage && (
                                                        <TooltipProvider>
                                                            <Tooltip delayDuration={100}>
                                                                <TooltipTrigger asChild>
                                                                    <div className="absolute right-2 flex items-center justify-center text-destructive cursor-help z-10 pointer-events-auto">
                                                                        <AlertCircle className="h-4 w-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" variant="destructive">
                                                                    <p>{errorMessage}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </div>
                                            </Field>
                                        );
                                    }}
                                />

                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{ 
                                        required: "A blog title is required", 
                                        minLength: { value: 6, message: "Title must be at least 6 characters" } 
                                    }}
                                        render={({ field, fieldState }) => (
                                            <Field>
                                                <div className="relative flex items-center w-full">
                                                    <div
                                                        className={cn(
                                                            "relative flex items-center w-full h-8 rounded-md border border-input bg-background overflow-hidden transition-all",
                                                            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-transparent",
                                                            fieldState.invalid && "border-destructive focus-within:ring-destructive",
                                                            isLoading && "opacity-50 pointer-events-none"
                                                        )}
                                                    >
                                                    <input
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="Title"
                                                        type="text"
                                                        disabled={isLoading}
                                                        className="w-full h-full bg-transparent pl-2.5 pr-14 text-xs placeholder:text-xs focus:outline-none"
                                                        {...field}
                                                    />

                                                    {field.value && (
                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() => field.onChange("")}
                                                            className={cn(
                                                                "absolute text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted cursor-pointer transition-colors",
                                                                fieldState.invalid ? "right-7" : "right-2"
                                                            )}
                                                        >
                                                            <X className="h-3.5 w-3.5 stroke-[2]" />
                                                        </button>
                                                    )}

                                                    {fieldState.error && (
                                                        <TooltipProvider>
                                                            <Tooltip delayDuration={100}>
                                                                <TooltipTrigger asChild>
                                                                    <div className="absolute right-2 flex items-center justify-center text-destructive cursor-help">
                                                                        <AlertCircle className="h-4 w-4" />
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent 
                                                                        side="top"
                                                                        variant="destructive"
                                                                    >
                                                                        <p>{fieldState.error.message}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </div>
                                            </div>
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="subtitle"
                                    control={control}
                                    rules={{ 
                                        required: "A subtitle summary is required", 
                                        minLength: { value: 100, message: "Summary must be at least 100 characters" } 
                                    }}
                                    render={({ field, fieldState }) => {
                                        const currentLength = field.value?.length || 0;
                                        const minLength = 100;
                                        const isMet = currentLength >= minLength;

                                        return (
                                            <Field>
                                                <div
                                                    className={cn(
                                                        "relative flex flex-col w-full rounded-md border border-input bg-background overflow-hidden transition-all",
                                                        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-transparent",
                                                        fieldState.invalid && "border-destructive focus-within:ring-destructive",
                                                        isLoading && "opacity-50 pointer-events-none"
                                                    )}
                                                >
                                                    <textarea
                                                        aria-invalid={fieldState.invalid}
                                                        placeholder="Summary"
                                                        rows={2}
                                                        disabled={isLoading}
                                                        className="w-full bg-transparent p-3 pr-14 text-xs placeholder:text-xs focus:outline-none resize-y min-h-[40px]"
                                                        {...field}
                                                    />

                                                    {field.value && (
                                                        <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={() => field.onChange("")}
                                                        className={cn(
                                                            "absolute top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted cursor-pointer transition-colors z-10",
                                                            fieldState.invalid ? "right-12" : "right-7"
                                                        )}
                                                        >
                                                            <X className="h-3.5 w-3.5 stroke-[2]" />
                                                        </button>
                                                    )}

                                                    {fieldState.error && (
                                                        <TooltipProvider>
                                                            <Tooltip delayDuration={100}>
                                                                <TooltipTrigger asChild>
                                                                <div className="absolute top-2.5 right-2 flex items-center justify-center text-destructive cursor-help z-10">
                                                                    <AlertCircle className="h-4 w-4" />
                                                                </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" variant="destructive">
                                                                <p>{fieldState.error.message}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}

                                                    <div className="flex items-center justify-end px-2.5 py-1 bg-muted/20 border-t border-border/40 text-[10px]">
                                                        <span className={cn("font-mono transition-colors", getCounterColor(currentLength))}>
                                                            {isMet ? (
                                                                <span>✓ {currentLength}</span>
                                                            ) : (
                                                                <span>{currentLength}/{minLength}</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Field>
                                        );
                                    }}
                                />

                                <Controller
                                    name="tags"
                                    control={control}
                                    rules={{
                                        validate: (value) =>
                                        value && value.length > 0 ? true : "Please select at least one tag",
                                    }}
                                    render={({ field, fieldState }) => {
                                        const value = field.value || [];
                                        const isInvalid = fieldState.invalid;
                                        const errorMessage = fieldState.error?.message;

                                        const toggleTag = (tag: string) => {
                                        const newValue = value.includes(tag)
                                            ? value.filter((t) => t !== tag)
                                            : [...value, tag];
                                        field.onChange(newValue);
                                        };

                                        return (
                                            <Field>
                                                <Popover>
                                                    <PopoverTrigger asChild disabled={isLoading}>
                                                        <div
                                                            className={cn(
                                                                "flex min-h-8 w-full flex-wrap gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs cursor-pointer items-center justify-between relative transition-all",
                                                                !isInvalid &&
                                                                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-transparent",
                                                                isInvalid &&
                                                                "border-destructive focus-within:ring-2 focus-within:ring-destructive focus-within:ring-offset-2 focus-within:border-transparent"
                                                                )}
                                                            >
                                                            {value.length === 0 ? (
                                                                <span className="text-muted-foreground">Tags...</span>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-1 pr-14">
                                                                    {value.map((tag) => (
                                                                        <Badge
                                                                            key={tag}
                                                                            variant="secondary"
                                                                            className="text-[11px] px-1.5 py-0 h-5 font-normal capitalize"
                                                                        >
                                                                            {tag}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="flex items-center space-x-1 absolute right-2.5 top-1/2 -translate-y-1/2 shrink-0">
                                                                {value.length > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        disabled={isLoading}
                                                                        onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        field.onChange([]);
                                                                        }}
                                                                        className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted cursor-pointer transition-colors"
                                                                        title="Clear tags"
                                                                    >
                                                                        <X className="h-3 w-3 stroke-[2]" />
                                                                    </button>
                                                                )}

                                                                <ChevronDown className="text-muted-foreground h-3.5 w-3.5 stroke-[2]" />

                                                                {errorMessage && (
                                                                    <TooltipProvider>
                                                                        <Tooltip delayDuration={100}>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="flex items-center justify-center text-destructive cursor-help">
                                                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top" variant="destructive">
                                                                                <p>{errorMessage}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                )}

                                                            </div>
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-fit p-2" align="start">
                                                        <div className="space-y-1">
                                                            {TAGS.map((tag) => (
                                                                <div
                                                                key={tag}
                                                                className="flex items-center space-x-2 p-1.5 hover:bg-muted rounded-md cursor-pointer"
                                                                onClick={() => toggleTag(tag)}
                                                                >
                                                                <Checkbox
                                                                    checked={value.includes(tag)}
                                                                    onCheckedChange={() => toggleTag(tag)}
                                                                />
                                                                <span className="text-xs font-medium select-none cursor-pointer capitalize">
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
                                    name="content"
                                    control={control}
                                    rules={{ 
                                        required: "Blog content cannot be empty",
                                        minLength: { value: 500, message: "Blog content must be at least 500 characters" }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <Field className="w-full">
                                            <MarkdownTextEditor
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                disabled={isLoading}
                                                error={fieldState.invalid}
                                                errorMessage={fieldState.error?.message}
                                            />
                                        </Field>
                                    )}
                                />

                                <div className="flex items-center justify-end gap-4">
                                    {hasErrors && (
                                        <div className="flex flex-row items-center justify-center gap-1">
                                            <TooltipProvider>
                                                <Tooltip delayDuration={200}>
                                                    <TooltipTrigger asChild>
                                                        <span className="text-xs text-destructive underline decoration-dotted underline-offset-2 cursor-help font-medium">
                                                            {errorCount} {errorCount === 1 ? "error" : "errors"} found
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent 
                                                            side="top" 
                                                            variant="destructive" 
                                                            className="w-auto max-w-none whitespace-nowrap"
                                                        >
                                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                                            {Object.entries(errors).map(([fieldName, error]) => {
                                                                const message = (error as { message?: string })?.message;
                                                                if (!message) return null;

                                                                return (
                                                                    <li key={fieldName}>
                                                                        <span className="font-semibold capitalize">{fieldName}:</span> {message}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => clearErrors()}
                                                className="h-6 w-6 p-0 hover:bg-destructive/10 rounded-sm cursor-pointer transition-colors"
                                            >
                                                <Check className="h-3.5 w-3.5 stroke-[2] text-destructive" />
                                            </Button>
                                        </div>
                                    )}
                                    
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className={cn(
                                            "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 p-2 w-full sm:w-auto cursor-pointer",
                                            isLoading && "cursor-not-allowed opacity-70"
                                        )}
                                    >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {editingBlogId ? "Updating" : "Publishing"}
                                        </>
                                    ) : (
                                        editingBlogId ? "Update Post" : "Publish Post"
                                    )}
                                    </Button>
                                </div>
                            </FieldGroup>
                        </form>
                    </div>
                </div>

                <div className="hidden lg:flex items-stretch justify-center h-full">
                    <Separator orientation="vertical" className="h-full w-[1px]" />
                </div>

                <div className="w-full py-4 px-4 sm:px-6 overflow-y-auto [scrollbar-gutter:stable] h-full min-h-0">
                    <div className="w-full">
                        <LivePostPreview control={control} previewImage={imagePreviewUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
}