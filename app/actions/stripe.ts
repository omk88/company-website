"use server";

import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function onboardInstructor(
  userId: string,
  userEmail: string,
  userUsername: string,
  locationCountryCode: string,
  existingStripeAccountId?: string
) {
  const origin = (await headers()).get("origin") || "http://localhost:3000";
  const secretKey = process.env.STRIPE_SECRET_KEY!;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
  }

  if (!existingStripeAccountId && (!locationCountryCode || locationCountryCode.trim().length !== 2)) {
    throw new Error("A valid 2-letter country code must be set on your profile before connecting Stripe.");
  }

  try {
    let accountId = existingStripeAccountId;

    if (!accountId) {
      const accountRes = await fetch("https://api.stripe.com/v2/core/accounts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          "Stripe-Version": "2026-10-28.endive",
        },
        body: JSON.stringify({
          contact_email: userEmail,
          display_name: userUsername,

          dashboard: "full",

          identity: {
            country: locationCountryCode.trim().toLowerCase(),
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
                card_payments: {
                  requested: true,
                },
              },
            },
          },

          include: [
            "configuration.merchant",
            "identity",
            "defaults",
          ],
        }),
      });

      const responseText = await accountRes.text();

      if (!accountRes.ok) {
        console.error("RAW STRIPE V2 ACCOUNT CREATION ERROR:", responseText);
        throw new Error(`Stripe v2 Account Creation Failed: ${responseText}`);
      }

      const accountData = JSON.parse(responseText);
      accountId = accountData.id;

      await fetchMutation(api.profiles.saveStripeAccountId, {
        userId,
        stripeAccountId: accountId!,
      });
    }

    const linkRes = await fetch("https://api.stripe.com/v2/core/account_links", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        "Stripe-Version": "2026-10-28.endive",
      },
      body: JSON.stringify({
        account: accountId,
        use_case: {
          type: "account_onboarding",
          account_onboarding: {
            return_url: `${origin}/${userUsername}`,
            refresh_url: `${origin}/${userUsername}`,
          },
        },
      }),
    });

    const linkResponseText = await linkRes.text();

    if (!linkRes.ok) {
      console.error("RAW STRIPE V2 ACCOUNT LINK ERROR:", linkResponseText);
      throw new Error(`Stripe v2 Account Link Failed: ${linkResponseText}`);
    }

    const linkData = JSON.parse(linkResponseText);

    redirect(linkData.url);

  } catch (error: any) {
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("An unexpected error occurred during onboarding:", error);
    throw error;
  }
}