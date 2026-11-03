"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSeriesStore } from "@/stores/useSeriesStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarCreateArticleSeries } from "./_components/LeftSidebarCreateArticleSeries";
import { AddSeriesItems } from "./_components/AddSeriesItems";
import { RightSidebarCreateArticleSeries } from "./_components/RightSidebarCreateArticleSeries";
import { Loader2 } from "lucide-react";

export default function CreateOrEditArticleSeriesPage() {
  const searchParams = useSearchParams();
  const seriesId = searchParams.get("id") as Id<"series"> | null;
  const isEditing = Boolean(seriesId);

  const { hydrateSeries, resetSeries } = useSeriesStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const existingSeries = useQuery(
    api.series.getSeriesById,
    seriesId ? { seriesId } : "skip"
  );

  useEffect(() => {
    if (isEditing) {
      if (existingSeries) {
        hydrateSeries({
          title: existingSeries.title,
          description: existingSeries.description,
          blogs: existingSeries.articles as any,
        });
        setIsInitialized(true);
      }
    } else {
      resetSeries();
      setIsInitialized(true);
    }

    return () => {
      resetSeries();
    };
  }, [existingSeries, isEditing, hydrateSeries, resetSeries]);

  if (isEditing && (!existingSeries || !isInitialized)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <SidebarProvider className="w-full min-h-screen">
        <aside 
          className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
          style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
        >
          <LeftSidebarCreateArticleSeries 
            isEditing={isEditing} 
            seriesId={seriesId ?? undefined} 
            existingData={existingSeries} 
          />
        </aside>

        <div className="w-full md:flex-1 md:flex md:flex-row md:min-w-0 md:pt-16 p-2">
          <AddSeriesItems />

          <aside 
            style={{ "--sidebar-width": "20rem" } as React.CSSProperties} 
            className="hidden md:block w-[20rem] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <RightSidebarCreateArticleSeries />
          </aside>
        </div>
      </SidebarProvider>
    </div>
  );
}