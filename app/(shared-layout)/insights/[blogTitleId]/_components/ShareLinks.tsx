"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxLinkedinLogo } from "react-icons/rx";
import { toast } from "sonner";

export function ShareLinks() {
    return (
        <div className="flex flex-row items-center gap-4 p-2 w-fit border px-4 rounded-2xl ml-auto bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
            <span className="font-semibold text-base text-zinc-600 dark:text-zinc-400">Share </span>

            <div className="flex flex-row gap-1">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link copied to clipboard!");
                                }}
                                className="flex flex-row items-center justify-center gap-1 h-9 w-9 p-0 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <Copy className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                            <p className="text-xs font-medium">Copy Link</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    const shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
                                        window.location.href
                                    )}&text=${encodeURIComponent("Check out this article!")}`;
                                    window.open(shareUrl, "_blank", "noopener,noreferrer");
                                }}
                                className="flex flex-row items-center justify-center gap-1 h-9 w-9 p-0 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <FaXTwitter className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                            </Button>
                        </TooltipTrigger>

                        <TooltipContent side="bottom" align="center">
                            <p className="text-xs font-medium">Share on X</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                        window.location.href
                                    )}`;
                                    window.open(shareUrl, "_blank", "noopener,noreferrer");
                                }}
                                className="flex flex-row items-center justify-center gap-1 h-9 w-9 p-0 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <RxLinkedinLogo className="h-3.5 w-3.5 shrink-0" />
                            </Button>
                        </TooltipTrigger>
                    
                        <TooltipContent side="bottom" align="center">
                            <p className="text-xs font-medium">Share on LinkedIn</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                        window.location.href
                                    )}`;
                                    window.open(shareUrl, "_blank", "noopener,noreferrer");
                                }}
                                className="flex flex-row items-center justify-center gap-1 h-9 w-9 p-0 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                <FaFacebook className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                            </Button>
                        </TooltipTrigger>
                        
                        <TooltipContent side="bottom" align="center">
                            <p className="text-xs font-medium">Share on Facebook</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}