"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Control, Controller, useForm, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AlertCircle, Film, Paperclip, X, Image, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { useGuardedMutation } from "@/hooks/useGuardedMutation";
import { useRouter } from "next/navigation";
import { useVideoStore } from "@/stores/useVideoStore";
import { toTitleCase } from "@/components/web/BlogPostForm";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface VideoFormValues {
    title: string;
    description: string;
    thumbnailStorageId: string | null;
    videoStorageId: string | null;
    tags?: string[];  
}

export const LivePostPreview = memo(function LivePostPreview({
  control,
  videoPreviewUrl,
  isUploading,
  uploadProgress,
}: {
  control: Control<VideoFormValues>;
  videoPreviewUrl: string | null;
  isUploading: boolean;
  uploadProgress: number;
}) {
  const title = useWatch({ control, name: "title" }) || "";
  const description = useWatch({ control, name: "description" }) || "";

  const formattedTitle = title ? toTitleCase(title) : "";
  const currentUser = useCurrentUser();

  const authorName =
    currentUser?.profile?.displayName ||
    currentUser?.profile?.username ||
    "User";

  const profilePic =
    currentUser?.profile?.profilePicUrl || currentUser?.profile?.defaultProfilePic;

  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const formatted = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formatted.charAt(0).toUpperCase() + formatted.slice(1));
  }, []);

  return (
    <div className="w-full min-w-0">
      <div className="w-full min-w-0">
        <div className="relative w-full h-[240px] mb-2 overflow-hidden rounded-lg flex items-center justify-center border bg-zinc-50 dark:bg-zinc-900">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center w-full px-6 gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Uploading video... {uploadProgress}%</span>
              </div>
              <div className="w-full max-w-[200px] bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : videoPreviewUrl ? (
            <video
              src={videoPreviewUrl}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground">
              <Film className="h-6 w-6 stroke-[1.5]" />
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
            {currentDate && (
              <>
                <span>&middot;</span>
                <span>{currentDate}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 line-clamp-3">
            {formattedTitle || "Video Title Preview"}
          </h1>
          {description && (
            <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

const uploadFileWithProgress = (uploadUrl: string, file: File, onProgress: (progress: number) => void): Promise<{ storageId: string }> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded * 100) / event.total);
                onProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    reject(new Error("Invalid JSON response from server"));
                }
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error("Network error during file upload"));
        xhr.send(file);
    });
};

export default function VideoPostForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

    const handleVideoSelect = async (file: File) => {
        setSelectedVideo(file);
        setVideoPreviewUrl(URL.createObjectURL(file)); 

        setIsVideoUploading(true);
        setUploadProgress(0);

        try {
            const uploadUrl = await generateUploadUrl();
            const { storageId } = await uploadFileWithProgress(uploadUrl, file, (progress) => {
                setUploadProgress(progress);
            });

            setValue("videoStorageId", storageId, { shouldValidate: true });
            toast.success("Video uploaded successfully!");
        } catch (err) {
            toast.error("Failed to upload video.");
        } finally {
            setIsVideoUploading(false);
        }
    };

    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const userData = useCurrentUser();

    const selectedVideoPost = useVideoStore((state) => state.selectedVideoPost);
    const setSelectedVideoPost = useVideoStore((state) => state.setSelectedVideoPost);
    const activeDraft = useVideoStore((state) => state.activeDraft);
    const clearStore = useVideoStore((state) => state.clearStore);

    const author = userData?.userId || "";
    const displayName = userData?.profile?.displayName;
    const username = String(userData?.profile?.username || "");

    const postType = userData?.email?.endsWith("@taqtiq.tech") ? "team" : "community";

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const createVideoPost = useGuardedMutation(api.videos.createVideoPost);
    const generateUploadUrl = useMutation(api.videos.generateUploadUrl);

    const { control, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<VideoFormValues>({
        defaultValues: { title: "", description: "", thumbnailStorageId: null, videoStorageId: null }
    });

    const currentThumbnailStorageId = watch("thumbnailStorageId") || selectedVideoPost?.thumbnailStorageId || activeDraft?.thumbnailStorageId || null;
    const resolvedThumbnailUrl = useQuery(
        api.videos.getStorageUrl,
        currentThumbnailStorageId ? { storageId: currentThumbnailStorageId } : "skip"
    );

    useEffect(() => {
        if (selectedThumbnail) return;
        if (resolvedThumbnailUrl) {
            setThumbnailPreviewUrl(resolvedThumbnailUrl);
        } else if (!currentThumbnailStorageId) {
            setThumbnailPreviewUrl(null);
        }
    }, [resolvedThumbnailUrl, selectedThumbnail, currentThumbnailStorageId]);

    const errorCount = Object.keys(errors).length;
    const hasErrors = errorCount > 0;

    useEffect(() => {
        if (selectedVideoPost) {
            reset({
                title: selectedVideoPost.title,
                description: selectedVideoPost.description || "",
                thumbnailStorageId: selectedVideoPost.thumbnailStorageId || null,
                videoStorageId: selectedVideoPost.videoStorageId || null,
            });
            setThumbnailPreviewUrl(selectedVideoPost.thumbnailUrl || null);
            setSelectedThumbnail(null);
            setSelectedVideo(null);
        } else if (activeDraft) {
            reset({
                title: activeDraft.title || "",
                description: activeDraft.description || "",
                thumbnailStorageId: activeDraft.thumbnailStorageId || null,
                videoStorageId: activeDraft.videoStorageId || null,
            });
            setThumbnailPreviewUrl(activeDraft.thumbnailUrl || null);
            setSelectedThumbnail(null);
            setSelectedVideo(null);
        } else {
            reset({ title: "", description: "", thumbnailStorageId: null, videoStorageId: null });
            clearThumbnail();
            clearVideo();
        }
    }, [selectedVideoPost, activeDraft, reset]);

    const clearThumbnail = () => {
        setSelectedThumbnail(null);
        setThumbnailPreviewUrl(null);
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = "";
        }
    };

    const clearVideo = () => {
        setSelectedVideo(null);
        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: VideoFormValues) => {
        if (!userData?.userId) {
            toast.error("User session not found. Please log in.");
            return;
        }

        const hasExistingThumbnail = Boolean(selectedVideoPost?.thumbnailUrl || activeDraft?.thumbnailUrl || data.thumbnailStorageId);
        if (!selectedThumbnail && !hasExistingThumbnail) {
            toast.error("Please upload a video thumbnail.");
            return;
        }

        const hasExistingVideo = Boolean(selectedVideoPost?.videoStorageId || activeDraft?.videoStorageId || data.videoStorageId);
        if (!selectedVideo && !hasExistingVideo) {
            toast.error("Please upload a video file.");
            return;
        }

        setIsLoading(true);

        try {
            let thumbnailStorageId = data.thumbnailStorageId || selectedVideoPost?.thumbnailStorageId || activeDraft?.thumbnailStorageId || "";
            let videoStorageId = data.videoStorageId || selectedVideoPost?.videoStorageId || activeDraft?.videoStorageId || "";

            if (selectedThumbnail) {
                const compressedThumbnail = (await imageCompression(selectedThumbnail, {
                    maxSizeMB: 1.0,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: "image/webp" as const,
                    initialQuality: 0.85,
                })) as File;

                const uploadUrl = await generateUploadUrl();
                const res = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": compressedThumbnail.type },
                    body: compressedThumbnail,
                });
                if (!res.ok) throw new Error("Failed to upload thumbnail.");
                const resJson = await res.json();
                thumbnailStorageId = resJson.storageId;
            }

            if (selectedVideo) {
                const uploadUrl = await generateUploadUrl();
                const res = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedVideo.type },
                    body: selectedVideo,
                });
                if (!res.ok) throw new Error("Failed to upload video file.");
                const resJson = await res.json();
                videoStorageId = resJson.storageId;
            }

            const result = await createVideoPost({
                title: data.title,
                subtitle: data.description,
                author,
                displayName,
                username,
                authorAvatarUrl: userData.profile?.profilePicUrl || undefined,
                postType,
                tags: [],
                thumbnailStorageId,
                videoStorageId,
            });

            if (result === undefined) return;

            toast.success(
                selectedVideoPost?._id
                    ? "Video post updated successfully!"
                    : "Video post published successfully!"
            );

            clearThumbnail();
            clearVideo();
            reset();
            clearStore();

            router.push("/videos");
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Process interrupted.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="w-full min-h-full md:h-[calc(100dvh-4rem)] md:overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch h-full">
                <ScrollArea className="w-full h-full sm:px-6">
                    <div
                        className={cn(
                            "relative w-full rounded-md md:my-4 md:border p-4 my-auto transition-colors",
                            hasErrors ? "border-destructive" : "border-border"
                        )}
                    >
                        <form id="video-post-form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-y-4">
                                
                                <Controller
                                    name="videoStorageId"
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            const hasExisting = Boolean(selectedVideoPost?.videoStorageId || value);
                                            if (hasExisting) return true;
                                            return "A video file is required";
                                        },
                                    }}
                                    render={({ field, fieldState }) => {
                                        const isInvalid = fieldState.invalid;
                                        const errorMessage = fieldState.error?.message;
                                        const hasExistingVideo = Boolean(selectedVideoPost?.videoStorageId);

                                        return (
                                            <div className="w-full">
                                                <input
                                                    id="video-file-upload"
                                                    ref={videoInputRef}
                                                    type="file"
                                                    accept="video/*"
                                                    disabled={isLoading || isVideoUploading}
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            setSelectedVideo(file);

                                                            const localBlobUrl = URL.createObjectURL(file);
                                                            setVideoPreviewUrl(localBlobUrl);

                                                            setIsVideoUploading(true);
                                                            setUploadProgress(0);

                                                            try {
                                                                const uploadUrl = await generateUploadUrl();

                                                                const { storageId } = await new Promise<{ storageId: string }>((resolve, reject) => {
                                                                    const xhr = new XMLHttpRequest();
                                                                    xhr.open("POST", uploadUrl);
                                                                    xhr.setRequestHeader("Content-Type", file.type);

                                                                    xhr.upload.onprogress = (event) => {
                                                                        if (event.lengthComputable) {
                                                                            const percentComplete = Math.round((event.loaded * 100) / event.total);
                                                                            setUploadProgress(percentComplete);
                                                                        }
                                                                    };

                                                                    xhr.onload = () => {
                                                                        if (xhr.status >= 200 && xhr.status < 300) {
                                                                            try {
                                                                                resolve(JSON.parse(xhr.responseText));
                                                                            } catch (err) {
                                                                                reject(new Error("Invalid JSON response"));
                                                                            }
                                                                        } else {
                                                                            reject(new Error("Upload failed"));
                                                                        }
                                                                    };

                                                                    xhr.onerror = () => reject(new Error("Network error"));
                                                                    xhr.send(file);
                                                                });

                                                                setValue("videoStorageId", storageId, { shouldValidate: true });
                                                                field.onChange(storageId);
                                                                toast.success("Video uploaded successfully!");

                                                            } catch (err) {
                                                                console.error(err);
                                                                toast.error("Failed to upload video file.");
                                                                setVideoPreviewUrl(null);
                                                                setSelectedVideo(null);
                                                            } finally {
                                                                setIsVideoUploading(false);
                                                            }
                                                        }
                                                    }}
                                                />

                                                <div className="relative flex items-center w-full">
                                                    <label
                                                        htmlFor="video-file-upload"
                                                        className={cn(
                                                            "group flex items-center justify-between w-full h-10 pl-2.5 pr-8 rounded-md border-2 md:border md:p-2 p-5 border-input bg-background text-lg md:text-xs cursor-pointer hover:bg-accent/50 transition-all select-none relative",
                                                            isInvalid && "border-destructive",
                                                            (isLoading || isVideoUploading) && "opacity-50 cursor-not-allowed pointer-events-none"
                                                        )}
                                                    >
                                                        <span className="flex flex-row items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[75%]">
                                                            <Film className="size-5 md:size-3.5 shrink-0 stroke-[1.5]" />
                                                            <span className="truncate">
                                                                {isVideoUploading
                                                                    ? `Uploading video... ${uploadProgress}%`
                                                                    : selectedVideo
                                                                    ? selectedVideo.name
                                                                    : hasExistingVideo
                                                                    ? "Change video file..."
                                                                    : "Upload video file..."}
                                                            </span>
                                                        </span>

                                                        {selectedVideo && !isVideoUploading && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    clearVideo();
                                                                    field.onChange(null);
                                                                }}
                                                                disabled={isLoading || isVideoUploading}
                                                                className={cn(
                                                                    "text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted shrink-0 transition-colors relative z-10 cursor-pointer absolute",
                                                                    errorMessage ? "right-7" : "right-2"
                                                                )}
                                                                title="Remove video"
                                                            >
                                                                <X className="size-4.5 md:size-3.5 stroke-[2]" />
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
                                            </div>
                                        );
                                    }}
                                />

                                <Controller
                                    name="thumbnailStorageId"
                                    control={control}
                                    rules={{
                                        validate: (value) => {
                                            const hasExisting = Boolean(selectedVideoPost?.thumbnailUrl || value);
                                            if (value || hasExisting) return true;
                                            return "A thumbnail image is required";
                                        },
                                    }}
                                    render={({ field, fieldState }) => {
                                        const isInvalid = fieldState.invalid;
                                        const errorMessage = fieldState.error?.message;
                                        const hasExistingThumbnail = Boolean(selectedVideoPost?.thumbnailUrl);

                                        return (
                                            <div className="w-full">
                                                <input
                                                    id="thumbnail-upload"
                                                    ref={thumbnailInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    disabled={isLoading}
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            const file = e.target.files[0];
                                                            setSelectedThumbnail(file);
                                                            setThumbnailPreviewUrl(URL.createObjectURL(file));
                                                            field.onChange(file.name);
                                                        }
                                                    }}
                                                />

                                                <div className="relative flex items-center w-full">
                                                    <label
                                                        htmlFor="thumbnail-upload"
                                                        className={cn(
                                                            "group flex items-center justify-between w-full h-10 pl-2.5 pr-8 rounded-md border-2 md:border md:p-2 p-5 border-input bg-background text-lg md:text-xs cursor-pointer hover:bg-accent/50 transition-all select-none relative",
                                                            isInvalid && "border-destructive",
                                                            isLoading && "opacity-50 cursor-not-allowed pointer-events-none"
                                                        )}
                                                    >
                                                        <span className="flex flex-row items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[75%]">
                                                            <Paperclip className="size-5 md:size-3.5 shrink-0 stroke-[1.5]" />
                                                            <span className="truncate">
                                                                {selectedThumbnail
                                                                    ? selectedThumbnail.name
                                                                    : hasExistingThumbnail
                                                                    ? "Change thumbnail..."
                                                                    : "Upload thumbnail image..."}
                                                            </span>
                                                        </span>

                                                        {thumbnailPreviewUrl && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    clearThumbnail();
                                                                    field.onChange(null);
                                                                }}
                                                                disabled={isLoading}
                                                                className={cn(
                                                                    "text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted shrink-0 transition-colors relative z-10 cursor-pointer absolute",
                                                                    errorMessage ? "right-7" : "right-2"
                                                                )}
                                                                title="Remove thumbnail"
                                                            >
                                                                <X className="size-4.5 md:size-3.5 stroke-[2]" />
                                                            </button>
                                                        )}
                                                    </label>

                                                    {errorMessage && (
                                                        <TooltipProvider>
                                                            <Tooltip delayDuration={100}>
                                                                <TooltipTrigger asChild>
                                                                    <div className="absolute right-2 flex items-center justify-center text-destructive cursor-help z-10">
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
                                            </div>
                                        );
                                    }}
                                />

                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{ 
                                        required: "A video title is required", 
                                        minLength: { value: 3, message: "Title must be at least 3 characters" } 
                                    }}
                                    render={({ field, fieldState }) => (
                                        <div className="relative flex items-center w-full">
                                            <div
                                                className={cn(
                                                    "relative flex items-center w-full h-12 md:h-9 rounded-md border-2 md:border border-input bg-background overflow-hidden transition-all",
                                                    fieldState.invalid && "border-destructive",
                                                    isLoading && "opacity-50 pointer-events-none"
                                                )}
                                            >
                                                <input
                                                    placeholder="Video Title"
                                                    type="text"
                                                    disabled={isLoading}
                                                    className="w-full h-full bg-transparent pl-2.5 pr-10 text-lg md:text-xs focus:outline-none"
                                                    {...field}
                                                />
                                                {field.value && (
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange("")}
                                                        className={cn(
                                                            "absolute text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted cursor-pointer",
                                                            fieldState.invalid ? "right-7" : "right-2"
                                                        )}
                                                    >
                                                        <X className="size-4 md:size-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ 
                                        required: "A description is required", 
                                        minLength: { value: 10, message: "Description must be at least 10 characters" } 
                                    }}
                                    render={({ field, fieldState }) => (
                                        <div className={cn(
                                            "relative flex flex-col w-full rounded-md border-2 md:border border-input bg-background overflow-hidden",
                                            fieldState.invalid && "border-destructive",
                                            isLoading && "opacity-50 pointer-events-none"
                                        )}>
                                            <textarea
                                                placeholder="Video Description"
                                                rows={3}
                                                disabled={isLoading}
                                                className="w-full bg-transparent p-3 pr-10 text-lg md:text-xs focus:outline-none resize-y min-h-[60px]"
                                                {...field}
                                            />
                                        </div>
                                    )}
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-10 mt-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? "Publishing..." : "Publish video post"}
                                </button>

                            </div>
                        </form>
                    </div>
                </ScrollArea>
                
                <div className="hidden lg:flex items-stretch justify-center h-full">
                    <Separator orientation="vertical" className="h-full w-[1px]" />
                </div>

                {isDesktop && (
                    <ScrollArea className="w-full my-4 sm:px-6 overflow-y-auto h-[calc(100%-2rem)] min-h-0 min-w-0 max-w-full">
                        <div className="w-full min-w-0 overflow-hidden">
                            <LivePostPreview 
                                control={control} 
                                videoPreviewUrl={videoPreviewUrl} 
                                isUploading={isVideoUploading} 
                                uploadProgress={uploadProgress} 
                            />
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
}