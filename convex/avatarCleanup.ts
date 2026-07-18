import { api } from "./_generated/api"
import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

export const purgeOrphanedFiles = action({
    args: {},
    handler: async (ctx) => {
        const expiredUploads = await ctx.runQuery(api.avatarCleanup.getExpiredUploads);

        for (const upload of expiredUploads) {
            try {
                await ctx.storage.delete(upload.storageId);

                await ctx.runMutation(api.avatarCleanup.deleteLedgerRow, { id: upload._id });
            } catch (error) {
                console.error(`Failed to purge storageId ${upload.storageId}`, error);
            }
        }
    }
});

export const getExpiredUploads = query({
    args: {},
    handler: async (ctx) => {
        const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

        return await ctx.db
            .query("uploadedAvatar")
            .filter((q) => q.lt(q.field("_creationTime"), twoHoursAgo))
            .collect();
    },
});

export const deleteLedgerRow = mutation({
    args: { id: v.id("uploadedAvatar") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});