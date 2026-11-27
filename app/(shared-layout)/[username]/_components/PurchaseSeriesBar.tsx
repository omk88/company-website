"use client";

import { useCurrentUser } from "@/app/ConvexClientProvider";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { getCurrencySymbol } from "./LeftSidebarArticleSeries";

interface PurchaseSeriesBarProps {
    series: FunctionReturnType<typeof api.series.getSeriesBySlug>
}

export function PurchaseSeriesBar({ series }: PurchaseSeriesBarProps) {
    
    const currentUser = useCurrentUser();

    const isOwnSeries = Boolean( currentUser?.userId &&
        series?.profile?.userId &&
        currentUser.userId === series?.profile.userId
    );

    const createCheckout = useAction(api.stripe.createCourseCheckoutSession);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [isEditingLoading, setIsEditingLoading] = useState(false);

    const handlePurchase = async () => {
        if (!series?._id) return;

        if (!currentUser) {
            toast.error("You must be logged in to purchase a course.", {
                action: {
                label: "Sign in",
                onClick: () => router.push("/sign-in"),
                },
            });
            return;
        }

        try {
            setIsCheckoutLoading(true);
            const { url } = await createCheckout({ seriesId: series._id });
            window.location.href = url;
        } catch (error) {
            console.error("Checkout failed:", error);
        } finally {
            setIsCheckoutLoading(false);
        }
    };


    return (
        <div className="fixed bottom-0 h-16 w-full border-t bg-background">
            {series && 
                <div className="flex flex-row p-4 items-center">
                    {isOwnSeries && (
                        <Button
                            type="button"
                            size="sm"
                            className="cursor-pointer w-fit text-base p-4 ml-auto"
                            asChild
                        >
                            <Link href={`/create-article-series?id=${series._id}`}>
                                Edit Series
                            </Link>
                        </Button>
                    )}

                    {!isOwnSeries && series.isCourse && (
                        <div className="ml-auto flex items-center gap-3">
                            <span className="text-lg font-semibold tabular-nums">
                                {getCurrencySymbol(series?.currency || "")}{series?.price}
                            </span>

                            <Button
                                type="button"
                                size="sm"
                                className="bg-green-600 text-green-50 transition hover:bg-green-900 hover:text-green-200 cursor-pointer w-fit text-base p-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handlePurchase}
                                disabled={isCheckoutLoading}
                            >
                                {isCheckoutLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Redirecting to checkout...
                                    </>
                                ) : (
                                    <>
                                        Purchase Course
                                        <ArrowRight className="h-6 w-6 stroke-[2.5]" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}