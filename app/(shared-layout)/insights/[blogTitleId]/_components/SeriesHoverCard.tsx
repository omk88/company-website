"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, List } from "lucide-react";
import Image from "next/image";

interface SeriesHoverCardProps {
    slug: string;
    username: string;
    children: ReactNode;
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
}

export function SeriesHoverCard({ 
    slug, 
    username, 
    children, 
    align = "start", 
    side = "bottom" 
}: SeriesHoverCardProps) {
    const seriesData = useQuery(api.series.getSeriesBySlug, { slug });

    const imageUrl = useQuery(
        api.series.getImageUrl,
        seriesData?.coverImage ? { storageId: seriesData.coverImage } : "skip"
    );

    if (!seriesData) {
        return <>{children}</>;
    }

    return (
        <div className="inline-block">
            <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                    {children}
                </HoverCardTrigger>
                <HoverCardContent side={side} align={align} className="w-80 p-0 overflow-hidden">
                    <Link 
                        href={`/${username}/series/${slug}`}
                        className="group flex flex-col p-3 gap-3 hover:bg-accent hover:text-accent-foreground transition-colors duration-100 cursor-pointer w-full"
                    >
                        <div className="relative w-full h-32 overflow-hidden rounded-xl bg-muted">
                            {imageUrl === undefined ? (
                                <div className="w-full h-full animate-pulse bg-muted-foreground/20" />
                            ) : imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={seriesData.title || "Series cover"}
                                    fill
                                    className="object-cover"
                                />
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-1 min-w-0">
                            <h4 className="text-sm font-bold truncate leading-tight text-foreground group-hover:text-accent-foreground">
                                {seriesData.title}
                            </h4>
                            {seriesData.description && (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-accent-foreground/80 line-clamp-2 leading-relaxed">
                                    {seriesData.description}
                                </p>
                            )}
                        </div>

                        <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-accent-foreground/80 font-medium">
                                <List className="w-3.5 h-3.5" />
                                <span>{seriesData.blogs?.length || 0} articles</span>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-accent-foreground">
                                <span>View Series</span>
                                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                        </div>

                    </Link>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}