"use client";

import { useRef, useState, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { formatSmartDate, ProfileHoverCard } from "./web/ProfileHoverCard";
import { 
    Eye, 
    ThumbsUp, 
    MessageSquare, 
    Play, 
    Pause, 
    Volume2, 
    VolumeX, 
    Maximize, 
    Minimize, 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

type PaginatedBlogsResult = FunctionReturnType<typeof api.blogs.getPaginatedPostsByType>;
export type BlogPostItem = PaginatedBlogsResult["page"][number];

interface VideoPlayerProps {
    blog: BlogPostItem;
}

const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function VideoPlayer({ blog }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const updateProgress = () => {
            if (videoRef.current && isPlaying) {
                setCurrentTime(videoRef.current.currentTime);
                animationFrameId = requestAnimationFrame(updateProgress);
            }
        };

        if (isPlaying) {
            animationFrameId = requestAnimationFrame(updateProgress);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return;

        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen().catch((err) => {
                console.error("Error attempting to enable fullscreen:", err);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.muted = true;
            setIsMuted(true);
        }
    };

    const handleSeek = (value: number[]) => {
        const newTime = value[0];
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const username = blog.username;
    const displayName = blog.displayName;

    return (
        <div className="flex flex-col w-full border border-border/50 rounded-none overflow-hidden bg-background">
            <div className="px-2 pb-1">
                <h3 className="leading-tight py-1 text-xl font-bold tracking-tight line-clamp-2 text-foreground break-words">
                    {blog.title}
                </h3>
                <div className="font-roboto flex items-center gap-1 text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    <ProfileHoverCard authorUsername={username} displayName={displayName || username}>
                        <span className="cursor-pointer">{displayName || username}</span>
                    </ProfileHoverCard>
                    
                    <span>&middot;</span>
                    
                    <span>{formatSmartDate(blog._creationTime, false)}</span>
                </div>
            </div>

            <div 
                ref={playerContainerRef}
                className="relative w-full bg-black h-90 group cursor-pointer flex items-center justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={togglePlay}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full h-full object-cover"
                    src={blog.videoUrl || ""}
                >
                    Your browser does not support the video tag.
                </video>

                <div 
                    className={`absolute bottom-0 left-0 right-0 px-3 py-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center gap-3 transition-opacity duration-200 ${isHovered || !isPlaying ? "opacity-100" : "opacity-0"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={togglePlay}
                        className="text-white transition-transform hover:scale-110 focus:outline-none cursor-pointer shrink-0"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                    </button>

                    <div className="flex-1">
                        <Slider
                            value={[currentTime]}
                            max={duration || 100}
                            step={0.01}
                            onValueChange={handleSeek}
                            className="cursor-pointer relative w-full [&_[role=slider]]:!bg-white [&_[role=slider]]:!border-white [&_[role=slider]]:h-3.5 [&_[role=slider]]:w-3.5 [&_span:first-child]:bg-white/30 [&_span:first-child_span]:bg-white"
                        />
                    </div>

                    <div className="text-xs text-white font-medium shrink-0 whitespace-nowrap select-none px-1">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>

                    <button 
                        onClick={toggleMute}
                        className="text-white transition-transform hover:scale-110 focus:outline-none cursor-pointer shrink-0"
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? (
                            <VolumeX className="w-6 h-6 fill-current" />
                        ) : (
                            <Volume2 className="w-6 h-6 fill-current" />
                        )}
                    </button>

                    <button 
                        onClick={toggleFullscreen}
                        className="text-white transition-transform hover:scale-110 focus:outline-none cursor-pointer shrink-0"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <div className="p-2 flex font-sans font-semibold items-center justify-between text-sm tracking-tight select-none w-full mt-auto">
                <div className="flex items-center">
                    <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                        <Eye className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{blog.totalViews}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                        <ThumbsUp className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{blog.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-[3rem] justify-start">
                        <MessageSquare className="w-4 h-4 stroke-[2.3] shrink-0" />
                        <span>{blog.commentCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}