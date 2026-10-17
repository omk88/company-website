import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPaginatedSeriesByAuthor = query({
  args: {
    author: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const paginatedSeries = await ctx.db
      .query("series")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.author))
      .order("desc")
      .paginate(args.paginationOpts);

    return paginatedSeries;
  },
});