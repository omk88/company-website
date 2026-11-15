"use server";

import { stripe } from "@/lib/stripe";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function onboardInstructor(userId: string, userEmail: string) {
  const origin = (await headers()).get("origin") || "http://localhost:3000";

  const account = await (stripe.v2.core.accounts.create as any)({
    contact_email: userEmail,
    dashboard: "express",
    identity: {
      country: "US",
      entity_type: "individual",
    },
    defaults: {
      responsibilities: {
        fees_collector: "stripe",
        losses_collector: "stripe",
      },
    },
    configuration: {
      merchant: {
        capabilities: {
          card_payments: { requested: true },
        },
      },
    },
  });

  await fetchMutation(api.profiles.saveStripeAccountId, {
    userId,
    stripeAccountId: account.id,
  });

  const accountLink = await (stripe.v2.core.accountLinks.create as any)({
    account: account.id,
    use_case: {
      type: "account_onboarding",
      account_onboarding: {
        configurations: ["merchant"],
        refresh_url: `${origin}/settings/connect?refresh=true`,
        return_url: `${origin}/settings/connect?success=true`,
      },
    },
  });

  redirect(accountLink.url);
}