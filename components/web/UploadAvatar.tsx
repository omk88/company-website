"use client";

import { ImagePlus, X } from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import imageCompression from "browser-image-compression";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface UploadAvatarProps {
    avatarSrc: string;
    defaultAvatarSrc: string;
    onPendingIdChange: (id: Id<"_storage"> | null) => void;
    onUploadingStatusChange: (isUploading: boolean) => void;
    onPromiseCreated: (promise: Promise<Id<"_storage"> | undefined>) => void;
}

export function UploadAvatar({ 
    avatarSrc, 
    defaultAvatarSrc,
    onPendingIdChange,
    onUploadingStatusChange,
    onPromiseCreated
}: UploadAvatarProps) {
    const [previewSrc, setPreviewSrc] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    
    const generateUploadUrl = useMutation(api.profiles.generateUploadUrl);
    const logUploadedAvatar = useMutation(api.avatars.create);

    const handleRemoveProfilePic = () => {
        if (previewSrc) URL.revokeObjectURL(previewSrc);
        setPreviewSrc(defaultAvatarSrc); 
        onPendingIdChange(null);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        if (previewSrc) URL.revokeObjectURL(previewSrc);
        const localUrl = URL.createObjectURL(file);
        setPreviewSrc(localUrl);

        setUploading(true);
        onUploadingStatusChange(true);

        const uploadPromise = (async (): Promise<Id<"_storage"> | undefined> => {
            try {
                const options = {
                    maxSizeMB: 0.15,
                    maxWidthOrHeight: 500,
                    useWebWorker: true,
                    fileType: 'image/jpeg' as const
                };
                const compressedFile = (await imageCompression(file, options)) as File;
                const uploadUrl = await generateUploadUrl();

                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": compressedFile.type },
                    body: compressedFile,
                    signal: controller.signal,
                });

                if (!result.ok) throw new Error("Upload failed");

                const data = (await result.json()) as { storageId: Id<"_storage"> };

                await logUploadedAvatar({ storageId: data.storageId });
                
                onPendingIdChange(data.storageId);
                return data.storageId;

            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log("Upload aborted gracefully because a newer file was chosen.");
                } else {
                    console.error("Background upload failed:", err);
                }
                return undefined;
            } finally {
                if (!controller.signal.aborted) {
                    setUploading(false);
                    onUploadingStatusChange(false);
                    abortControllerRef.current = null;
                }
            }
        })();

        onPromiseCreated(uploadPromise);
    };

    const hasCustomAvatar = previewSrc 
        ? previewSrc !== defaultAvatarSrc 
        : !!avatarSrc && avatarSrc !== defaultAvatarSrc;

    return (
        <div className="relative p-2 w-fit">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
            />
            
            <Avatar className="h-16 w-16 border-2 border-muted">
                <AvatarImage src={previewSrc || avatarSrc || defaultAvatarSrc} />
                
                {hasCustomAvatar && (
                    <AvatarBadge className="p-0 border-none bg-transparent">
                        <button 
                            type="button"
                            onClick={handleRemoveProfilePic}
                            className="flex h-5 w-5 shrink-0 aspect-square items-center justify-center rounded-full bg-zinc-50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <X className="h-3 w-3 stroke-[2.5]" />
                        </button>
                    </AvatarBadge>
                )}
            </Avatar>
            
            <button
                type="button"
                onClick={handleButtonClick}
                disabled={uploading}
                className="absolute inset-2 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer disabled:cursor-not-allowed"
                aria-label="Change avatar"
            >
                {uploading ? (
                    <Spinner className="h-6 w-6 animate-spin" />
                ) : (
                    <ImagePlus className="h-5 w-5" />
                )}
            </button>
        </div>
    );
}