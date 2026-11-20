"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import Stripe from "stripe";
import { internal } from "./_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCourseCheckoutSession = action({
  args: {
    seriesId: v.id("series"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("You must be logged in to purchase a course.");

    const checkoutData = await ctx.runQuery(internal.series.getCheckoutDetails, {
      seriesId: args.seriesId,
      buyerUserId: identity.subject,
    });

    if (!checkoutData) throw new Error("Course not found.");
    if (checkoutData.alreadyPurchased) throw new Error("You already own this course.");
    if (!checkoutData.authorStripeAccountId || !checkoutData.chargesEnabled) {
      throw new Error("The creator is not set up to receive payments yet.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: checkoutData.currency.toLowerCase(),
            product_data: {
              name: checkoutData.title,
              description: checkoutData.description || undefined,
              images: checkoutData.imageUrl ? [checkoutData.imageUrl] : [],
            },
            unit_amount: Math.round(checkoutData.price * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round(checkoutData.price * 100 * 0.1),
        transfer_data: {
          destination: checkoutData.authorStripeAccountId,
        },
      },
      metadata: {
        seriesId: args.seriesId,
        buyerUserId: identity.subject,
        authorId: checkoutData.authorId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${checkoutData.authorUsername}/series/${checkoutData.slug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${checkoutData.authorUsername}/series/${checkoutData.slug}`,
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe checkout session.");
    }

    return { url: session.url };
  },
});