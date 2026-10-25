"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface CreateSeriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (seriesId: string) => void;
}

export function CreateSeriesDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateSeriesDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createSeries = useMutation(api.series.createSeries);
  const generateUploadUrl = useMutation(api.series.generateUploadUrl);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertImageToPngFile = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const fileContent = event.target?.result as string;
          
          let processedContent = fileContent;
          let svgWidth = 1200;
          let svgHeight = 630;

          if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
            const viewBoxMatch = processedContent.match(/viewBox\s*=\s*["']([\d\s.-]+)["']/i);
            if (viewBoxMatch) {
              const parts = viewBoxMatch[1].trim().split(/[\s,]+/);
              if (parts.length === 4) {
                svgWidth = parseFloat(parts[2]) || 1200;
                svgHeight = parseFloat(parts[3]) || 630;
              }
            }

            if (!processedContent.includes('fill="#ffffff"') && !processedContent.includes('fill="white"')) {
              processedContent = processedContent.replace(
                /(<svg[^>]*>)/i,
                `$1<rect width="${svgWidth}" height="${svgHeight}" fill="#ffffff"/>`
              );
            }
          }

          const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(processedContent)}`;
          const img = new window.Image();
          img.crossOrigin = "anonymous";

          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = file.type === "image/svg+xml" || file.name.endsWith(".svg") ? svgWidth : (img.naturalWidth || 1200);
              canvas.height = file.type === "image/svg+xml" || file.name.endsWith(".svg") ? svgHeight : (img.naturalHeight || 630);

              const ctx = canvas.getContext("2d");
              if (!ctx) {
                reject(new Error("Could not create canvas context"));
                return;
              }

              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              canvas.toBlob((pngBlob) => {
                if (!pngBlob) {
                  reject(new Error("Failed to convert image to PNG blob"));
                  return;
                }
                const pngFileName = file.name.replace(/\.[^/.]+$/, "") + ".png";
                const pngFile = new File([pngBlob], pngFileName, { type: "image/png" });
                resolve(pngFile);
              }, "image/png");
            } catch (err) {
              reject(err);
            }
          };

          img.onerror = () => reject(new Error("Failed to load image into canvas"));
          img.src = dataUrl;
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let coverImageStorageId: string | undefined = undefined;
      let coverImagePngStorageId: string | undefined = undefined;

      if (selectedImage) {
        const postUrl1 = await generateUploadUrl();
        const result1 = await fetch(postUrl1, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });

        if (!result1.ok) throw new Error("Failed to upload original cover image.");
        const json1 = await result1.json();
        coverImageStorageId = json1.storageId;

        const pngFile = await convertImageToPngFile(selectedImage);
        const postUrl2 = await generateUploadUrl();
        const result2 = await fetch(postUrl2, {
          method: "POST",
          headers: { "Content-Type": "image/png" },
          body: pngFile,
        });

        if (!result2.ok) throw new Error("Failed to upload processed PNG cover image.");
        const json2 = await result2.json();
        coverImagePngStorageId = json2.storageId;
      }

      const slug = generateSlug(title);
      
      const newSeriesId = await createSeries({
        title: title.trim(),
        slug,
        description: description.trim() || undefined,
        coverImage: coverImageStorageId,
        coverImagePng: coverImagePngStorageId,
      });

      setTitle("");
      setDescription("");
      handleRemoveImage();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess(newSeriesId);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create series. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Article Series</DialogTitle>
            <DialogDescription>
              Group your related blog posts into an ordered series or playlist.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Next.js 15 Masterclass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What will readers learn in this series?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Cover Image (Optional)</Label>
              {imagePreview ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <Image
                    src={imagePreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md"
                    onClick={handleRemoveImage}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl p-6 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center"
                >
                  <ImagePlus className="h-8 w-8 text-zinc-400" />
                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Click to upload cover image
                  </p>
                  <p className="text-[10px] text-zinc-400">SVG, PNG, or JPG</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Series
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}