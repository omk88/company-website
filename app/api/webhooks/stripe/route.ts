import { NextResponse } from "next/server";
import crypto from "crypto";
import { fetchMutation } from "convex/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api, internal } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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

function getConvexAdminClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const deployKey = process.env.CONVEX_DEPLOY_KEY;
  if (!convexUrl || !deployKey) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL or CONVEX_DEPLOY_KEY");
  }
  const client = new ConvexHttpClient(convexUrl);
  (client as any).setAdminAuth(deployKey);
  return client;
}

async function resolveCheckoutSession(event: any, secretKey: string) {
  let session = event?.data?.object;

  if (!session?.metadata || !session?.id) {
    try {
      const eventRes = await fetch(`https://api.stripe.com/v1/events/${event.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      });

      if (eventRes.ok) {
        const fullEvent = await eventRes.json();
        session = fullEvent?.data?.object ?? session;
      }
    } catch (err) {
      console.error("Failed to fetch full Stripe checkout event:", err);
    }
  }

  if (typeof session?.id === "string" && session.id.startsWith("cs_") && !session?.metadata) {
    try {
      const sessionRes = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${session.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
          cache: "no-store",
        }
      );

      if (sessionRes.ok) {
        session = await sessionRes.json();
      }
    } catch (err) {
      console.error("Failed to retrieve Stripe Checkout Session:", err);
    }
  }

  return session;
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

  if (event.type === "checkout.session.completed" ||
      event.type === "v1.checkout.session.completed"
  ) {
    try {
      const session = await resolveCheckoutSession(event, secretKey);
      const { seriesId, buyerUserId, authorId } = session?.metadata || {};

      const isPaidOrFreePromo =
        !session?.payment_status ||
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required";

      if (isPaidOrFreePromo && seriesId && buyerUserId && authorId && session?.id) {

        await fetchMutation(api.purchases.recordCompletedPurchaseFromWebhook, {
          webhookSecret: process.env.CONVEX_WEBHOOK_SECRET!,
          seriesId: seriesId as Id<"series">,
          userId: buyerUserId,
          authorId,
          amountPaid: typeof session.amount_total === "number" ? session.amount_total : 0,
          currency: session.currency || "usd",
          stripeSessionId: session.id,
        });

        console.log(`Recorded completed purchase for session ${session.id}:`, {
          seriesId,
          buyerUserId,
          authorId,
        });
      } else {
        console.warn("Skipping checkout.session.completed due to missing fields or unpaid status:", {
          eventId: event.id,
          sessionId: session?.id,
          paymentStatus: session?.payment_status,
          metadata: session?.metadata,
        });
      }

      return NextResponse.json({ received: true });
    } catch (err) {
      console.error("Error processing checkout.session.completed:", err);
      return NextResponse.json({ error: "Failed to record purchase" }, { status: 500 });
    }
  }

  const relevantEventTypes = new Set([
    "v2.core.account[configuration.merchant].capability_status_updated",
    "v2.core.account[requirements].updated",
    "v2.core.account.updated",
    "v2.core.account_link.returned",
  ]);

  if (relevantEventTypes.has(event.type)) {
    let stripeAccountId: string | undefined = undefined;

    if (event?.related_object?.id?.startsWith("acct_")) {
      stripeAccountId = event.related_object.id;
    } else if (typeof event?.context === "string" && event.context.startsWith("acct_")) {
      stripeAccountId = event.context;
    } else {
      try {
        const fullEventRes = await fetch(
          `https://api.stripe.com/v2/core/events/${event.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${secretKey}`,
              "Stripe-Version": "2026-10-28.endive",
            },
            cache: "no-store",
          }
        );

        if (fullEventRes.ok) {
          const fullEvent = await fullEventRes.json();
          stripeAccountId =
            fullEvent?.data?.account_id ||
            (fullEvent?.related_object?.id?.startsWith("acct_")
              ? fullEvent.related_object.id
              : undefined) ||
            (typeof fullEvent?.context === "string" && fullEvent.context.startsWith("acct_")
              ? fullEvent.context
              : undefined);
        }
      } catch (err) {
        console.error("Error fetching full Stripe v2 event:", err);
      }
    }

    if (!stripeAccountId || !stripeAccountId.startsWith("acct_")) {
      console.log(`Skipping event ${event.type} (${event.id}) - could not resolve account ID.`);
      return NextResponse.json({ received: true });
    }

    try {
      const queryParams = new URLSearchParams({
        "include[0]": "configuration.merchant",
        "include[1]": "requirements",
      });

      const accountRes = await fetch(
        `https://api.stripe.com/v2/core/accounts/${stripeAccountId}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${secretKey}`,
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