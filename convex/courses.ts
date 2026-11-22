import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Doc, Id } from "./_generated/dataModel";


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

    const enrichedSeries = await Promise.all(
      validSeries.map(async (series) => {
        const [imageUrl, articles] = await Promise.all([
          series.coverImage
            ? ctx.storage.getUrl(series.coverImage as Id<"_storage">)
            : Promise.resolve(null),
          ctx.db
            .query("seriesItems")
            .withIndex("by_series_and_order", (q) => q.eq("seriesId", series._id))
            .collect(),
        ]);

        return {
          ...series,
          imageUrl,
          articleCount: articles.length,
        }
      })
    )

    return {
      ...paginatedPurchases,
      page: enrichedSeries,
    }
  },
});