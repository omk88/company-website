"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function VideoUpload() {
    const generateUploadUrl = useMutation(api.videos.generateUploadUrl);
    const saveVideo = useMutation(api.videos.saveVideo);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            const postUrl = await generateUploadUrl();

            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            const { storageId } = await result.json();

            await saveVideo({
                storageId,
                name: file.name,
            });

            console.log("Video uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <label className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
            <span>{uploading ? "Uploading video..." : "Upload Video"}</span>
            <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
            />
        </label>
    );
}