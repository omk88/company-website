"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import { ProfileHoverCard } from "@/components/web/ProfileHoverCard";
import { useRouter } from "next/navigation";
import { useSeriesStore } from "@/stores/useSeriesStore";

interface LeftSidebarProps {
  isEditing?: boolean;
  seriesId?: Id<"series">;
  existingData?: any;
}

export function LeftSidebarCreateArticleSeries({ isEditing, seriesId, existingData }: LeftSidebarProps) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const authorName = currentUser?.profile?.displayName || currentUser?.profile?.username || "User";
  const profilePic = currentUser?.profile?.profilePicUrl || currentUser?.profile?.defaultProfilePic;

  const { stagedBlogs, seriesTitle, description, setSeriesTitle, setDescription } = useSeriesStore();

  const stagedBlogIds = stagedBlogs.map((b) => b._id);
  const totalReadMinutes = stagedBlogs.reduce((acc, blog) => acc + (blog.readTime || 0), 0);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createSeriesWithItems = useMutation(api.series.createSeriesWithItems);
  const updateSeriesWithItems = useMutation(api.series.updateSeriesWithItems);
  const generateUploadUrl = useMutation(api.series.generateUploadUrl);
  const getImageUrl = useQuery(api.series.getImageUrl, existingData?.coverImage ? { storageId: existingData.coverImage } : "skip");

  useEffect(() => {
    if (getImageUrl && !imagePreview && !selectedImage) {
      setImagePreview(getImageUrl);
    }
  }, [getImageUrl, imagePreview, selectedImage]);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  function formatReadTime(totalMinutes: number): string {
    if (!totalMinutes || totalMinutes <= 0) return "0 min read";
    if (totalMinutes < 60) return `${totalMinutes} min read`;

    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    if (hours < 24) {
      if (remainingMinutes === 0) return `${hours} hr read`;
      return `${hours} hr ${remainingMinutes} min read`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days} day read`;
    return `${days} day ${remainingHours} hr read`;
  }

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
              processedContent = processedContent.replace(/(<svg[^>]*>)/i, `$1<rect width="${svgWidth}" height="${svgHeight}" fill="#ffffff"/>`);
            }
          }

          const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(processedContent)}`;
          const img = new window.Image();
          img.crossOrigin = "anonymous";

          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = svgWidth;
            canvas.height = svgHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas context failed"));
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              if (!blob) return reject(new Error("Blob conversion failed"));
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".png", { type: "image/png" }));
            }, "image/png");
          };
          img.src = dataUrl;
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seriesTitle.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let coverImageStorageId: string | undefined = existingData?.coverImage;
      let coverImagePngStorageId: string | undefined = existingData?.coverImagePng;

      if (selectedImage) {
        const postUrl1 = await generateUploadUrl();
        const res1 = await fetch(postUrl1, { method: "POST", headers: { "Content-Type": selectedImage.type }, body: selectedImage });
        if (!res1.ok) throw new Error("Failed to upload cover image.");
        coverImageStorageId = (await res1.json()).storageId;

        const pngFile = await convertImageToPngFile(selectedImage);
        const postUrl2 = await generateUploadUrl();
        const res2 = await fetch(postUrl2, { method: "POST", headers: { "Content-Type": "image/png" }, body: pngFile });
        if (!res2.ok) throw new Error("Failed to upload PNG cover image.");
        coverImagePngStorageId = (await res2.json()).storageId;
      }

      const slug = seriesTitle.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");

      if (isEditing && seriesId) {
        await updateSeriesWithItems({
          seriesId,
          title: seriesTitle.trim(),
          slug,
          description: description.trim() || undefined,
          coverImage: coverImageStorageId,
          coverImagePng: coverImagePngStorageId,
          articleIds: stagedBlogIds,
        });
        router.push(`${currentUser?.username}/series/${slug}`);
      } else {
        const newSlug = await createSeriesWithItems({
          title: seriesTitle.trim(),
          slug,
          description: description.trim() || undefined,
          coverImage: coverImageStorageId,
          coverImagePng: coverImagePngStorageId,
          articleIds: stagedBlogIds,
        });
        router.push(`/series/${newSlug}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save series.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <Sidebar className="flex flex-col !top-16 !z-40 border-r" bgClass="bg-background/95" collapsible="icon">
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-3 !px-2 w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
              
              <div className="relative w-full h-48 overflow-hidden rounded-lg">
                {imagePreview ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    <Image src={imagePreview} alt="Cover preview" fill className="object-cover" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-zinc-400 hover:text-red-500 absolute top-2 right-2 h-6 w-6 rounded-full z-10"
                      onClick={handleRemoveImage}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} className="w-full h-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-lg p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-background/50 text-center">
                    <ImagePlus className="h-8 w-8 text-zinc-400" />
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Click to upload cover image</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isSubmitting} />
              </div>

              <div className="flex flex-row gap-2 items-center">
                {profilePic && (
                  <div className="h-6 w-6 border border-border rounded-full overflow-hidden bg-muted shrink-0">
                    <img src={profilePic} alt="profile" className="h-full w-full object-cover" />
                  </div>
                )}
                <ProfileHoverCard displayName={currentUser?.profile?.displayName} authorUsername={currentUser?.profile?.username || ""}>
                  <span className="text-sm truncate leading-tight cursor-pointer">{authorName}</span>
                </ProfileHoverCard>
                <span className="capitalize font-semibold text-xs text-zinc-400 ml-auto">{currentDate}</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold">Title</Label>
                  <Input id="title" placeholder="Next.js 16 Masterclass" value={seriesTitle} onChange={(e) => setSeriesTitle(e.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold">Description (Optional)</Label>
                  <Textarea id="description" placeholder="What will readers learn?" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isSubmitting} rows={3} className="resize-none" />
                </div>
              </div>

              <div className="flex items-center">
                <Badge variant={"outline"} className="gap-1.5 py-1 px-2.5 text-zinc-600 dark:text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{formatReadTime(totalReadMinutes)}</span>
                </Badge>
              </div>

              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

              <Button type="submit" disabled={isSubmitting || !seriesTitle.trim()} className="w-full mt-2">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Series"}
              </Button>

            </div>
          </form>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}