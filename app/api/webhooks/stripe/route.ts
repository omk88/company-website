import { NextResponse } from "next/server";
import crypto from "crypto";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

function verifyStripeSignature(payload: string, sigHeader: string, secret: string): boolean {
  const parts = sigHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) return false;

  const toleranceSeconds = 300;
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > toleranceSeconds) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!webhookSecret || !secretKey) {
    console.error("Missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const sigHeader = req.headers.get("stripe-signature");

  if (!sigHeader || !verifyStripeSignature(rawBody, sigHeader, webhookSecret)) {
    console.error("Invalid Stripe webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  const relevantEventTypes = new Set([
    "v2.core.account[configuration.merchant].capability_status_updated",
    "v2.core.account[requirements].updated",
    "v2.core.account.updated",
    "v2.core.account_link.returned",
  ]);

  if (relevantEventTypes.has(event.type)) {
    const stripeAccountId: string | undefined =
      event?.related_object?.id || event?.data?.object?.id;

    if (!stripeAccountId) {
      return NextResponse.json({ received: true });
    }

    try {
      const params = new URLSearchParams();
      params.append("include[]", "configuration.merchant");
      params.append("include[]", "requirements");

      const accountRes = await fetch(
        `https://api.stripe.com/v2/core/accounts/${stripeAccountId}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${secretKey}`,
            "Stripe-Version": "2026-10-28.endive",
          },
          cache: "no-store",
        }
      );

      if (!accountRes.ok) {
        console.error("Failed to fetch Stripe v2 account in webhook:", await accountRes.text());
        return NextResponse.json({ error: "Failed to fetch account" }, { status: 500 });
      }

      const account = await accountRes.json();

      const cardPaymentsStatus =
        account?.configuration?.merchant?.capabilities?.card_payments?.status;

      const hasDueRequirements = (account?.requirements?.entries ?? []).some(
        (entry: any) =>
          entry.minimum_deadline?.status === "currently_due" ||
          entry.minimum_deadline?.status === "past_due"
      );

      const chargesEnabled = cardPaymentsStatus === "active";
      const payoutsEnabled = cardPaymentsStatus === "active";
      const detailsSubmitted = !hasDueRequirements;

      await fetchMutation(api.profiles.updateStripeStatusByAccountId, {
        stripeAccountId,
        stripeChargesEnabled: chargesEnabled,
        stripePayoutsEnabled: payoutsEnabled,
        stripeDetailsSubmitted: detailsSubmitted,
      });

      console.log(`Synced Stripe account ${stripeAccountId}:`, {
        chargesEnabled,
        payoutsEnabled,
        detailsSubmitted,
      });
    } catch (err) {
      console.error("Error processing Stripe webhook:", err);
      return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
} 