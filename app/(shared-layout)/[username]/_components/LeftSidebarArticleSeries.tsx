"use client";

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarFooter 
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Clock, Library } from "lucide-react";
import Image from "next/image";
import { formatSmartDate, ProfileHoverCard } from "@/components/web/ProfileHoverCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/app/ConvexClientProvider";
import Link from "next/link";
import { useState } from "react";

interface LeftSidebarArticleSeriesProps {
  slug: string;
}

export function getCurrencySymbol(currencyCode: string, locale: string = "en-US"): string {
  try {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
      })
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value || currencyCode
    );
  } catch (e) {
    return currencyCode;
  }
}

export function formatReadTime(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return "0 min read";

  if (totalMinutes < 60) {
    return `${totalMinutes} min read`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  if (hours < 24) {
    if (remainingMinutes === 0) {
      return `${hours} hr read`;
    }
    return `${hours} hr ${remainingMinutes} min read`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} day read`;
  }
  return `${days} day ${remainingHours} hr read`;
}

export function LeftSidebarArticleSeries({ slug }: LeftSidebarArticleSeriesProps) {
  const seriesData = useQuery(api.series.getSeriesBySlug, { slug });

  const createCheckout = useAction(api.stripe.createCourseCheckoutSession);
  const [isLoading, setIsLoading] = useState(false);

  const imageUrl = useQuery(
    api.series.getImageUrl,
    seriesData?.coverImage ? { storageId: seriesData.coverImage } : "skip"
  );

  const avatarSrc = seriesData?.profile?.profilePicUrl;
  const isImageLoading = seriesData?.coverImage && imageUrl === undefined;
  const currentUser = useCurrentUser();
  const isOwnProfile = Boolean(
    currentUser?.userId &&
      seriesData?.profile?.userId &&
      currentUser.userId === seriesData?.profile.userId
  );

  if (seriesData === undefined) {
    return (
      <Sidebar 
        className="flex flex-col !top-16 !z-40 border-r"
        bgClass="bg-background/95" 
        collapsible="icon"
      >
        <SidebarContent className="!p-0 w-full">
          <ScrollArea dir="rtl" className="h-[calc(100vh-4rem)] w-full [&>div>div]:!block">
            <div dir="ltr" className="text-left">
              <SidebarGroup className="pt-3 !px-2 w-full">
                <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
                  <Skeleton className="w-full h-64 rounded-lg" />

                  <div className="flex flex-row gap-2 items-center">
                    <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-4 w-12 rounded ml-auto" />
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <Skeleton className="h-6 w-4/5 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>

                  <div className="flex items-center pt-1">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </SidebarGroup>
            </div>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="hidden" />
      </Sidebar>
    );
  }

  if (seriesData === null) {
    return (
      <Sidebar className="flex flex-col !top-16 !z-40 border-r" bgClass="bg-background/95" collapsible="icon">
        <SidebarContent className="!p-0 w-full">
          <ScrollArea dir="rtl" className="h-[calc(100vh-4rem)] w-full [&>div>div]:!block">
            <div dir="ltr" className="text-left">
              <SidebarGroup className="pt-3 !px-2 w-full">
                <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 text-xs text-zinc-500">
                  Series not found.
                </div>
              </SidebarGroup>
            </div>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="hidden" />
      </Sidebar>
    );
  }

  const seriesId = seriesData._id;
  

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      const { url } = await createCheckout({ seriesId });
      window.location.href = url;
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar 
      className="flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95" 
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <ScrollArea dir="rtl" className="h-[calc(100vh-4rem)] w-full [&>div>div]:!block">
          <div dir="ltr" className="text-left">
            <SidebarGroup className="pt-3 !px-2 w-full">
              <div className="flex flex-col gap-3 w-full pb-6">
                <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    {isImageLoading ? (
                      <Skeleton className="w-full h-full rounded-lg" />
                    ) : imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={seriesData.title || "Series cover"}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                    ) : null}
                  </div>

                  {avatarSrc && (
                    <div className="flex flex-row gap-2 items-center">
                      <div className="h-6 w-6 border border-border rounded-full overflow-hidden bg-muted shrink-0">
                        <img
                          src={avatarSrc}
                          alt="profile"
                          className="h-full w-full object-cover"
                          decoding="async"
                        />
                      </div>
                      <div className="flex flex-col">
                        <ProfileHoverCard
                          displayName={seriesData.profile?.displayName}
                          authorUsername={seriesData.profile?.username || ""}
                        >
                          <span className="text-sm truncate leading-tight cursor-pointer">
                            {seriesData.profile?.displayName || seriesData.profile?.username}
                          </span>
                        </ProfileHoverCard>
                      </div>

                      <time className="capitalize font-semibold text-lg md:text-xs tracking-tight text-zinc-400 mt-0.5 select-none ml-auto">
                        {formatSmartDate(seriesData._creationTime, false)}
                      </time>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg text-foreground">{seriesData.title}</span>
                    {seriesData.description && (
                      <span className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {seriesData.description}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-row">
                    {seriesData.price && seriesData.currency && (
                      <div className="flex items-center">
                        <Badge variant="outline" className="py-1 px-2.5 text-green-600 dark:text-green-300">
                          <span>
                            {getCurrencySymbol(seriesData.currency)}
                            {seriesData.price}
                          </span>
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center ml-auto">
                      <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-zinc-600 dark:text-zinc-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatReadTime(seriesData.totalReadTime)}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center ml-auto">
                      <Badge variant="outline" className="gap-1.5 py-1 px-2.5 text-zinc-600 dark:text-zinc-300">
                        <Library className="w-3.5 h-3.5" />
                        <span>{seriesData.articlesCount} {seriesData.articlesCount === 1 ? 'article' : 'articles'}</span>
                      </Badge>
                    </div>
                  </div>

                  {isOwnProfile && (
                    <Button type="button" size="sm" className="cursor-pointer w-fit rounded-xl mt-2" asChild>
                      <Link href={`/create-article-series?id=${seriesData._id}`}>
                        Edit Series
                      </Link>
                    </Button>
                  )}

                  {!isOwnProfile && seriesData.isCourse && (
                    <Button
                      type="button"
                      size="sm"
                      className="cursor-pointer w-fit rounded-xl mt-2"
                      onClick={handlePurchase}
                      disabled={isLoading}
                    >
                      {isLoading ? "Redirecting to checkout..." : "Purchase Course"}
                    </Button>
                  )}
                </div>
              </div>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}