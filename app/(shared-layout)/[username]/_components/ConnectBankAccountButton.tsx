"use client";

import { useCurrentUser } from "@/app/ConvexClientProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { onboardInstructor } from "@/app/actions/stripe";

export default function ConnectBankAccountButton() {
  const currentUser = useCurrentUser();
  const profile = currentUser?.profile;

  const userId = currentUser?.userId || "";
  const userEmail = currentUser?.email || "";
  const userUsername = profile?.username || "";
  const countryCode = profile?.locationCountryCode || "";
  const stripeAccountId = profile?.stripeAccountId;

  const isFullyConnected = Boolean(
    stripeAccountId && profile?.stripeChargesEnabled && profile?.stripePayoutsEnabled
  );
  const isIncomplete = Boolean(stripeAccountId && !isFullyConnected);

  if (isFullyConnected) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Stripe Connected
        </span>
        <a
          href="https://dashboard.stripe.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
        >
          Dashboard
        </a>
      </div>
    );
  }

  const isMissingCountry = !stripeAccountId && !countryCode;
  const isDisabled = !userId || !userEmail || isMissingCountry;

  const onboardInstructorWithUser = onboardInstructor.bind(
    null,
    userId,
    userEmail,
    userUsername,
    countryCode,
    stripeAccountId
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
            "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none p-2 w-full sm:w-auto cursor-pointer",
            isIncomplete
              ? "bg-amber-600 text-white hover:bg-amber-600/90"
              : "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
          )}
        >
          {isIncomplete ? "Complete Stripe Setup" : "Connect Stripe"}
        </Button>
      </form>

      {currentUser && isMissingCountry && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Set your country in your profile settings to connect Stripe.
        </p>
      )}
    </div>
  );
}