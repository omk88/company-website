import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const trackUpload = mutation({
  args: { 
    storageId: v.id("_storage"),
    fullUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("uploadedPostImage", {
      storageId: args.storageId,
      fullUrl: args.fullUrl,
      isClaimed: false,
    });
  },
});

export const claimImagesInContent = mutation({
    args: { content: v.string() },
    handler: async (ctx, args) => {
        const storageIdRegex = /storage\/([a-zA-Z0-9_-]+)/g;
        const matches = [...args.content.matchAll(storageIdRegex)];

        for (const match of matches) {
            const storageId = match[1] as any;

            const record = await ctx.db
                .query("uploadedPostImage")
                .withIndex("by_storageId", (q) => q.eq("storageId", storageId))
                .first();

            if (record && !record.isClaimed) {
                await ctx.db.patch(record._id, { isClaimed: true });
            }
        }
    },
});

export const getExpiredPostUploads = query({
    args: {},
    handler: async (ctx) => {
        const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

        const unclaimed = await ctx.db
            .query("uploadedPostImage")
            .withIndex("by_claimed", (q) => q.eq("isClaimed", false))
            .filter((q) => q.lt(q.field("_creationTime"), twoHoursAgo))
            .collect();

        return unclaimed;
    },
});

export const deleteLedgerRow = mutation({
    args: { id: v.id("uploadedPostImage") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const purgeOrphanedPostImages = action({
  args: {},
  handler: async (ctx) => {
    const expiredUploads = await ctx.runQuery(api.postImageCleanup.getExpiredPostUploads);

    for (const upload of expiredUploads) {
      try {
        await ctx.storage.delete(upload.storageId);

        await ctx.runMutation(api.postImageCleanup.deleteLedgerRow, { id: upload._id });
        console.log(`Purged orphaned storageId: ${upload.storageId}`);
      } catch (error) {
        console.error(`Failed to purge storageId ${upload.storageId}`, error);
      }
    }
  },
});