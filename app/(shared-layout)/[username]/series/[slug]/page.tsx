import { cache } from "react";
import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebarArticleSeries } from "../../_components/LeftSidebarArticleSeries";
import { RightSidebarArticleSeries } from "../../_components/RightSidebarArticleSeries";
import { SeriesItems } from "../../_components/SeriesItems";

interface ArticleSeriesPageProps {
    params: Promise<{ slug: string; username: string }>;
}

const getSeriesData = cache(async (slug: string) => {
    return await fetchQuery(api.series.getSeriesBySlug, { slug });
});

export async function generateMetadata({ params }: ArticleSeriesPageProps): Promise<Metadata> {
    const { slug, username } = await params;
    const series = await getSeriesData(slug);

    if (!series) {
        return {
            title: "Series Not Found",
            robots: { index: false, follow: false },
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taqtiq.tech";
    const seriesUrl = `${baseUrl}/insights/series/${username}/${slug}`;

    const imageUrl = series.coverImage?.startsWith("http")
        ? series.coverImage
        : `${baseUrl}${series.coverImage || "/noImage.png"}`;

    return {
        title: series.title,
        description: series.description,
        alternates: {
            canonical: seriesUrl,
        },
        openGraph: {
            title: series.title,
            description: series.description,
            url: seriesUrl,
            type: "website", 
            images: [
                {
                    url: imageUrl,
                    alt: series.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: series.title,
            description: series.description,
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ArticleSeriesPage({ params }: ArticleSeriesPageProps) {
    const { slug, username } = await params;
    const series = await getSeriesData(slug);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.taqtiq.tech";
    
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: series?.title,
        description: series?.description,
        url: `${baseUrl}/insights/series/${username}/${slug}`,
    };

    return (
        <div className="min-h-screen w-full">
            {series && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <SidebarProvider className="w-full min-h-screen">
                <aside 
                    className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
                >
                    <LeftSidebarArticleSeries slug={slug} />
                </aside>

                <div className="w-full md:flex-1 md:flex md:flex-row md:min-w-0 md:pt-16">
                    <SeriesItems slug={slug} />
                    
                    <aside 
                        style={{ "--sidebar-width": "20rem" } as React.CSSProperties} 
                        className="hidden md:block w-[20rem] shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
                    >
                        <RightSidebarArticleSeries slug={slug} />
                    </aside>
                </div>
            </SidebarProvider>
        </div>
    );
}