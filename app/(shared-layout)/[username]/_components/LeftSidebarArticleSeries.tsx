"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Clock, Library } from "lucide-react";
import Image from "next/image";
import { formatSmartDate, ProfileHoverCard } from "@/components/web/ProfileHoverCard";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { getGradientDataUrl } from "@/data/themes";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";

interface LeftSidebarArticleSeriesProps {
  series: FunctionReturnType<typeof api.series.getSeriesBySlug>;
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
  } catch {
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

export function LeftSidebarArticleSeries({ series }: LeftSidebarArticleSeriesProps) {

  const resolvedThemeName = series?.profile?.themeName ?? "";
  const resolvedAvatarVariant = series?.profile?.avatarVariant ?? 0;

  const gradientAvatarUrl = useMemo(() => {
    return getGradientDataUrl(resolvedThemeName, resolvedAvatarVariant);
  }, [resolvedThemeName, resolvedAvatarVariant]);

  const avatarSrc = series?.profile?.profilePicUrl || gradientAvatarUrl;

  return (
    <Sidebar
      className="flex flex-col !top-16 !z-40 border-r"
      bgClass="bg-background/95"
      collapsible="icon"
    >
      <SidebarContent className="!p-0 w-full">
        <SidebarGroup className="pt-3 !px-2 w-full">
          <div className="flex flex-col gap-3 w-full pb-6">
            <div className="relative p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/50 flex flex-col gap-3">
              {series &&
                <>
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    {series.coverImageUrl &&
                      <Image
                        src={series.coverImageUrl}
                        alt={series.title || "Series cover"}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                    }
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
                          displayName={series.profile?.displayName}
                          authorUsername={series.profile?.username || ""}
                        >
                          <span className="text-sm truncate leading-tight cursor-pointer">
                            {series.profile?.displayName || series.profile?.username}
                          </span>
                        </ProfileHoverCard>
                      </div>

                      <time className="capitalize font-semibold text-lg md:text-xs tracking-tight text-zinc-400 mt-0.5 select-none ml-auto">
                        {formatSmartDate(series._creationTime, false)}
                      </time>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    {series.title && (
                      <span className="font-bold text-lg text-foreground">
                        {series.title}
                      </span>
                    )}
                    {series.description && (
                      <span className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {series.description}
                      </span>
                    )}
                  </div>
                </>
              }
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="hidden" />
    </Sidebar>
  );
}