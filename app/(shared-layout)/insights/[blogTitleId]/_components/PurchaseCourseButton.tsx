"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface PurchaseCourseButtonProps {
    seriesId?: Id<"series">;
}

export default function PurchaseCourseButton({seriesId}: PurchaseCourseButtonProps) {

    if (!seriesId) return;

    const [isLoading, setIsLoading] = useState(false);
    const createCheckout = useAction(api.stripe.createCourseCheckoutSession);

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
        <Button onClick={handlePurchase} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-green-50 transition hover:bg-green-900 hover:text-green-200 cursor-pointer">
            Purchase Course
            <ArrowRight className="h-4 w-4" />
        </Button>
    )
}