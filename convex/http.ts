import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { internal } from "./_generated/api";
import Stripe from "stripe";
import { httpAction } from "./_generated/server";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const signature = request.headers.get("stripe-signature");
    if (!signature) return new Response("Missing signature", { status: 400 });

    const payload = await request.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return new Response("Invalid webhook signature", { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { seriesId, buyerUserId, authorId } = session.metadata || {};

      if (seriesId && buyerUserId && authorId) {
        await ctx.runMutation(internal.purchases.recordCompletedPurchase, {
          seriesId: seriesId as any,
          userId: buyerUserId,
          authorId,
          amountPaid: session.amount_total || 0,
          currency: session.currency || "usd",
          stripeSessionId: session.id,
        });
      }
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;