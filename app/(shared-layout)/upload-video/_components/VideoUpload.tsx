"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/app/ConvexClientProvider";

export default function VideoUpload() {
    const generateUploadUrl = useMutation(api.videos.generateUploadUrl);
    const createVideoPost = useMutation(api.videos.createVideoPost);

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [postType, setPostType] = useState<"community" | "team">("community");
    const [tagInput, setTagInput] = useState("");
    
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progressText, setProgressText] = useState("");

    const userData = useCurrentUser();

    const author = userData?.userId || "";
    const displayName = userData?.profile?.displayName;
    const username = String(userData?.profile?.username || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile || !thumbnailFile) {
            alert("Please select both a video file and a thumbnail image.");
            return;
        }

        try {
            setUploading(true);

            setProgressText("Uploading thumbnail...");
            const thumbPostUrl = await generateUploadUrl();
            const thumbResult = await fetch(thumbPostUrl, {
                method: "POST",
                headers: { "Content-Type": thumbnailFile.type },
                body: thumbnailFile,
            });
            const { storageId: thumbnailStorageId } = await thumbResult.json();

            setProgressText("Uploading video file...");
            const videoPostUrl = await generateUploadUrl();
            const videoResult = await fetch(videoPostUrl, {
                method: "POST",
                headers: { "Content-Type": videoFile.type },
                body: videoFile,
            });
            const { storageId: videoStorageId } = await videoResult.json();

            setProgressText("Saving post...");
            const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);

            await createVideoPost({
                title,
                subtitle,
                content,
                author,
                displayName,
                username,
                postType,
                tags,
                videoStorageId,
                thumbnailStorageId,
                readTime: 3,
            });

            console.log("Video post created successfully!");
            setTitle("");
            setSubtitle("");
            setContent("");
            setVideoFile(null);
            setThumbnailFile(null);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Check console for details.");
        } finally {
            setUploading(false);
            setProgressText("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg">
            <input
                type="text"
                placeholder="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border p-2 rounded-lg dark:bg-gray-800"
            />
            <input
                type="text"
                placeholder="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="border p-2 rounded-lg dark:bg-gray-800"
            />
            <textarea
                placeholder="Description / Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border p-2 rounded-lg dark:bg-gray-800"
            />

            <div className="flex gap-4">
                <label className="flex flex-col gap-1 text-sm font-medium">
                    Cover Thumbnail Image:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                        required
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                    Video File:
                    <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        required
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
                {uploading ? progressText : "Publish Video Post"}
            </button>
        </form>
    );
}