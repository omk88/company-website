import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Doc } from "./_generated/dataModel";


export const getPaginatedPurchasesByAuthor = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const paginatedPurchases = await ctx.db
      .query("purchases")
      .withIndex("by_user_and_series", (q) => q.eq("userId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    const seriesDocs = await Promise.all(
      paginatedPurchases.page.map((purchase) => ctx.db.get(purchase.seriesId))
    );

    const validSeries = seriesDocs.filter(
      (series): series is Doc<"series"> => series !== null
    );

    return {
      ...paginatedPurchases,
      page: validSeries,
    }
  },
});