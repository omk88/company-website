import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveVideo = mutation({
    args: {
        storageId: v.id("_storage"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("videos", {
            storageId: args.storageId,
            name: args.name,
        });
    },
});