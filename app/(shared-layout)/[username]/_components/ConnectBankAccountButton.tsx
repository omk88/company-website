"use client";

import { useCurrentUser } from "@/app/ConvexClientProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { onboardInstructor } from "@/app/actions/stripe";

export default function ConnectBankAccountButton() {
    const currentUser = useCurrentUser();

    const userId = currentUser?.userId || "";
    const userEmail = currentUser?.email || "";
    const userUsername = currentUser?.profile?.username || "";
    const countryCode = currentUser?.profile?.locationCountryCode || "";

    const isMissingCountry = !countryCode;
    const isDisabled = !userId || !userEmail || isMissingCountry;

    const onboardInstructorWithUser = onboardInstructor.bind(
        null,
        userId,
        userEmail,
        userUsername,
        countryCode
    );

    return (
        <div className="hidden md:flex flex-col items-start gap-1.5">
            <form action={onboardInstructorWithUser}>
                <Button
                    type="submit"
                    disabled={isDisabled}
                    title={
                        isMissingCountry
                            ? "Please set your country in your profile settings first"
                            : undefined
                    }
                    className={cn(
                        "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 p-2 w-full sm:w-auto cursor-pointer"
                    )}
                >
                    Connect Bank Account
                </Button>
            </form>

            {currentUser && isMissingCountry && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Set your location in your profile settings to connect a bank account.
                </p>
            )}
        </div>
    );
}