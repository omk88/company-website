import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const newRecordId = await ctx.db.insert("uploadedAvatar", {
            storageId: args.storageId,
            createdAt: Date.now(),
        });

        return newRecordId;
    }
});